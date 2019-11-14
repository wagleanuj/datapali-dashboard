import { useQuery } from '@apollo/react-hooks';
import { Button, Card, Checkbox, Colors, ControlGroup, Dialog, InputGroup, Spinner, Tab, Tabs, Tag } from '@blueprintjs/core';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
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
                filledFormsNumber: item.filledForms.length,
                assignedForms: item.availableForms,

            }))
            return (<AutoSizer disableHeight>
                {({ width }) => (
                    <Table
                        width={width}
                        height={700}
                        headerHeight={40}
                        rowHeight={40}
                        rowCount={transformedData.length}
                        rowGetter={({ index }) => transformedData[index]}
                        style={{ outline: "none" }}
                        gridStyle={{ outline: "none" }}

                    >
                        <Column
                            className={"table-cell"}
                            width={50}
                            headerRenderer={() => <ControlGroup><Checkbox alignIndicator="center" /></ControlGroup>}
                            cellRenderer={() => <ControlGroup><Checkbox alignIndicator="center" /></ControlGroup>}
                        />

                        <Column
                            label='Name'
                            dataKey='name'
                            width={200}
                        />
                        <Column
                            width={200}
                            label='Email'
                            dataKey='email'
                        />
                        <Column
                            width={200}
                            label='Submitted Forms'
                            dataKey='filledFormsNumber'
                        />
                        <Column
                            width={200}
                            label="Assigned Forms"
                            dataKey="assignedForms"
                            cellRenderer={
                                (data) => {
                                    return data.cellData.map(item => {
                                        return (<Tag
                                            key={item.id}
                                            onRemove={onMakeFormUnavailable}
                                        >
                                            {item.name}
                                        </Tag>);

                                    })

                                }
                            }
                        />
                    </Table>)}
            </AutoSizer>
            )
        }
    }
    return render();
}