import { useQuery } from '@apollo/react-hooks';
import { Button, Card, Colors, Dialog, InputGroup, Spinner, Tab, Tabs } from '@blueprintjs/core';
import { Table, Tag } from 'antd';
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
            <Card color={Colors.DARK_GRAY5} style={{ width: "100%", height: "100%" }}>
                <Tabs onChange={this.handleTabChange} selectedTabId={this.state.selectedTab}>
                    <Tab key="surveyors" id="surveyor" title="Surveyors" panel={<SurveyorUsers />} />
                    <Tab key="admin" id="admin" title="Admin" panel={<AdminUsers />} panelClassName="ember-panel" />
                    <Tabs.Expander />
                    {this.getAddUserButton()}
                    <Button icon="filter-list">Filter</Button>
                    <InputGroup leftIcon="search" placeholder="Find User..." type="search" />
                </Tabs>
                <Dialog onClose={this.toggleSignUpDialog} canEscapeKeyClose={true} isOpen={this.state.isSignUpDialogOpen} title={`Create ${this.state.selectedTab}`}>
                    <SignUpForm signUpType={this.state.selectedTab} />
                </Dialog>
            </Card>
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
            key:"name",
            title: 'Name',
            dataIndex: 'name',


        },
        {
            key:"email",
            title: 'Email',
            dataIndex: 'email',

        },
        {
            key:"filledforms",
            title: 'Filled Forms',
            dataIndex: 'filledFormsCount',

        },
        {
            key:"assignedForms",
            title: 'Assigned Forms',
            dataIndex: 'assignedForms',

            render: ((data, record, index) => {
                return (
                <span>
                    {data.map(d => <Tag key={d.id} title={d.name} >{d.name}</Tag>)}
                </span>
                )
            })

        },
    ];



    const render = () => {
        if (loading) {
            return (
                <Spinner />
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
                <Table  columns={columns} dataSource={transformedData} />
            )

        }
    }
    return render();
}