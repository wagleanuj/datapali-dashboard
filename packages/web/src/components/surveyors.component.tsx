import { useQuery } from '@apollo/react-hooks';
import { Button, Card, Col, Input, Modal, Row, Spin, Table, Tabs, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import 'react-virtualized/styles.css'; // only needs to be imported once
import { SignUpForm } from '../containers/signUp.container';

const list = [
    { name: 'Anuj Wagle', email: 'anujwagle@gmail.com' }
    // And so on...
];
const GET_USERS = gql`query{
    users{
      _id
      firstName
      lastName
      email
      filledForms{
        id
        
      }
      createdForms{
        id
        name
      }
      availableForms{
        id
        name
      }
    }
  }`;
type UsersProps = {

}
enum UserTypes {
    ADMIN = "admin",
    SURVEYOR = "surveyor"

}
type UsersState = {
    selectedTab: UserTypes;
    isSignUpDialogOpen: boolean;

}
export class Users extends Component<UsersProps, UsersState> {
    state = {
        selectedTab: UserTypes.SURVEYOR,
        isSignUpDialogOpen: false,
    }
    handleTabChange = (tabId: UserTypes) => {
        this.setState({
            selectedTab: tabId
        })
    }
    toggleSignUpDialog = () => {
        this.setState(prevState => {
            return {
                isSignUpDialogOpen: !prevState.isSignUpDialogOpen
            }
        })
    }
    getAddUserButton() {
        return (
            <Button onClick={this.toggleSignUpDialog} icon="user">{this.state.selectedTab === "admin" ? "Add Admin" : "Add Surveyor"}</Button>
        )
    }
    render() {
        return (
            <Card style={{ width: "100%", height: "100%" }}>
                <>
                    <Row>
                        <Col span={6}>
                            {this.getAddUserButton()}
                        </Col>
                        <Col span={6}>
                            <Button icon="filter"></Button>
                        </Col>
                        <Col span={12}>
                            <Input.Search placeholder="Find User..." type="search" />
                        </Col>
                    </Row>
                    <Tabs onChange={this.handleTabChange} defaultActiveKey={this.state.selectedTab}>
                        <Tabs.TabPane key="surveyor" tab={'Surveyors'} ><SurveyorUsers /></Tabs.TabPane>
                        <Tabs.TabPane key="admin" tab={'Admin'}><AdminUsers /></Tabs.TabPane>
                    </Tabs>

                </>

                <Modal centered destroyOnClose onCancel={this.toggleSignUpDialog} visible={this.state.isSignUpDialogOpen} title={`Create ${this.state.selectedTab}`}>
                    <SignUpForm signUpType={this.state.selectedTab} />
                </Modal>
            </Card >
        )
    }
}
export function AdminUsers() {
    return (
        <>
        </>
    )
}
export function SurveyorUsers() {
    const { loading, data, error } = useQuery(GET_USERS, { pollInterval: 2000 });
    const onMakeFormUnavailable = () => {

    }

    const columns: ColumnProps<any>[] = [
        {
            key: "name",
            title: 'Name',
            dataIndex: 'name',

        },
        {
            key: "email",
            title: 'Email',
            dataIndex: 'email',

        },
        {
            key: "filledforms",
            title: 'Filled Forms',
            dataIndex: 'filledFormsCount',

        },
        {
            key: "assignedForms",
            title: 'Assigned Forms',
            dataIndex: 'assignedForms',

            render: ((data, record, index) => {
                return (
                    <span key={'assignedForms' + index}>
                        {data.map(d => <Tag key={d.id} title={d.name} >{d.name}</Tag>)}
                    </span>
                )
            })

        },
    ];



    const render = () => {
        if (loading) {
            return (
                <Spin />
            )
        }
        if (data && data.users) {
            const transformedData = data.users.map(item => ({
                name: item.firstName + " " + item.lastName,
                email: item.email,
                filledFormsCount: item.filledForms.length,
                assignedForms: item.availableForms,

            }));

            return (
                <Table rowKey={record => record._id} columns={columns} dataSource={transformedData} />
            )

        }
    }
    return render();
}