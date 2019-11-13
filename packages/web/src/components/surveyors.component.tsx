import { Checkbox, ControlGroup } from '@blueprintjs/core';
import React, { Component } from 'react';
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

const list = [
    { name: 'Brian Vaughn', description: 'Software engineer' }
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
                            headerHeight={20}
                            rowHeight={30}
                            rowCount={list.length}
                            rowGetter={({ index }) => list[index]}
                        >
                            <Column
                                width={50}
                                headerRenderer={()=><ControlGroup><Checkbox/></ControlGroup>}
                                cellRenderer={()=><ControlGroup><Checkbox/></ControlGroup>}
                            />
                            <Column
                                label='Name'
                                dataKey='name'
                                width={100}
                            />
                            <Column
                                width={200}
                                label='Description'
                                dataKey='description'
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
        <>
        </>
    )
}