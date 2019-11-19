import { useQuery } from '@apollo/react-hooks';
import { Button, Card, Col, Input, Modal, PageHeader, Row, Spin, Table, Tag, Typography } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import 'react-virtualized/styles.css'; // only needs to be imported once
import { SignUpForm } from '../containers/signUp.container';
const { Paragraph } = Typography;
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
      accountType
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
enum FilterTypes {
    ADMIN = "admin",
    SURVEYOR = "surveyor",
    ALL = "all"
}
type UsersState = {
    selectedTab: UserTypes;
    isSignUpDialogOpen: boolean;
    signUpType: UserTypes;
    filterType: FilterTypes;
}


export class Users extends Component<UsersProps, UsersState> {
    state = {
        selectedTab: UserTypes.SURVEYOR,
        signUpType: UserTypes.SURVEYOR,
        isSignUpDialogOpen: false,
        filterType: FilterTypes.ALL,
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
    handleAddUserClick = (type: UserTypes) => {
        this.setState({
            signUpType: type
        }, () => {
            this.toggleSignUpDialog();
        })
    }
    filterUsersByType(type: FilterTypes) {
        this.setState({
            filterType: type
        })
    }

    get Content() {
        return (<div className="user-content">
            <Paragraph>
                Create surveyor and assign them the forms you created.

      </Paragraph>

            <Paragraph>
                Or create admin users who can collaborate with you on creating forms and managing the collected data.
        </Paragraph>
            <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>

                <Col span={12}>
                    <Input.Search type="" size="large" placeholder="Find Users..." />
                </Col>
            </Row >

        </div >);
    }
    render() {
        return (
            <Card style={{ width: "100%", height: "100%" }}>
                <PageHeader
                    title="Users"
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    subTitle=""
                    extra={[
                        <Button onClick={() => this.handleAddUserClick(UserTypes.SURVEYOR)} icon="user-add" type="primary" key="3">Add Surveyor</Button>,
                        <Button onClick={() => this.handleAddUserClick(UserTypes.ADMIN)} icon='user-add' type="primary" key="2">Add Admin</Button>,

                    ]}
                    avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
                >
                    <div

                    >
                        {this.Content}
                    </div>
                </PageHeader>

                <>
                    <UsersTable filterUsersByType={this.state.filterType} />

                </>

                <Modal centered destroyOnClose onCancel={this.toggleSignUpDialog} visible={this.state.isSignUpDialogOpen} title={`Create ${this.state.selectedTab}`}>
                    <SignUpForm signUpType={this.state.signUpType} />
                </Modal>
            </Card >
        )
    }
}
type UsersTableProps = {
    filterUsersByType: FilterTypes
}
export function UsersTable(props: UsersTableProps) {
    const { loading, data, error } = useQuery(GET_USERS, { pollInterval: 2000 });
    const onMakeFormUnavailable = () => {

    }

    const columns: ColumnProps<any>[] = [
        {
            key: "name",
            title: 'Name',
            dataIndex: 'name',

            sorter: (a, b) => a.name.length - b.name.length,
            ellipsis: true,

        },
        {
            key: "email",
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.name.length - b.name.length,
            filteredValue: [props.filterUsersByType]
        },
        {
            key: "role",
            title: 'Role',
            dataIndex: 'role',
            filters: [{ text: 'Admins', value: 'admin' }, { text: 'Surveyors', value: 'surveyor' }],
            onFilter: (value, record) => record.role.includes(value),

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
        let transformedData = [];
        if (data && data.users) {
            transformedData = data.users.map(item => ({
                name: item.firstName + " " + item.lastName,
                email: item.email,
                filledFormsCount: item.filledForms.length,
                assignedForms: item.availableForms,
                role: item.accountType

            }));
        }

        return (
            <Spin spinning={loading}>
                <Table pagination={{ pageSize: 50 }} scroll={{ y: 400 }} key={"surveyorstable"} rowKey={record => record._id} columns={columns} dataSource={transformedData} />
            </Spin>
        )

    }

    return render();
}
export function AdminUsers() {
    return (
        <>
        </>
    )
}
export function SurveyorUsers() {

}