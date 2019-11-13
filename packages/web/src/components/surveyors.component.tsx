import { Checkbox, ControlGroup } from '@blueprintjs/core';
import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

const list = [
    { name: 'Anuj Wagle', email: 'anujwagle@gmail.com' }
    // And so on...
];

export class Surveyors extends Component {
    render() {
        return (
            <div>
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <Table
                            width={width}
                            height={300}
                            headerHeight={40}
                            rowHeight={40}
                            rowCount={list.length}
                            rowGetter={({ index }) => list[index]}
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
                                width={100}
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
                        </Table>)}
                </AutoSizer>
            </div>
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
    return (
        <div>
            <AutoSizer disableHeight>
                {({ width }) => (
                    <Table
                        width={width}
                        height={700}
                        headerHeight={40}
                        rowHeight={40}
                        rowCount={list.length}
                        rowGetter={({ index }) => list[index]}
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
                            width={100}
                        />
                        <Column
                            width={200}
                            label='Email'
                            dataKey='email'
                        />
                        <Column
                            width={100}
                            label='Submitted Forms'
                            dataKey='filledFormsNumber'
                        />
                        <Column
                            width={100}
                            label="Assigned Forms"
                            dataKey="assignedForms"
                        />
                    </Table>)}
            </AutoSizer>
        </div>
    )
}