import { Alignment, Button, ButtonGroup, Card, Classes, EditableText, Elevation, NonIdealState } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { Component } from 'react';
import { CellMeasurerCache } from 'react-virtualized';

const cache = new CellMeasurerCache({
    defaultWidth: 100,
    minWidth: 75,
    defaultHeight: 120,
    fixedWidth: true,
});

interface IFormItem {
    id: string;
    title: string;
    createdDate: number;
    createdBy: string;
    sharedTo: string[];
}
type FormsProps = {
    data: IFormItem[]
}
export class Forms extends Component<FormsProps, {}> {
    private height: number = 0;
    static defaultProps = {
        data: [
            {
                id: "adsasd",
                title: "Form 1",
                createdDate: new Date().getTime(),
                createdBy: "Anuj Wagle",
                sharedTo: ["who", "who"]

            }
        ]
    }

    renderRow(index: number) {
        const data = this.props.data[index];
        return (

            <FormItem
                key={data.id}
                {...data}
                onClick={() => console.log(data.id)}
                onDeleteClick={() => console.log("delete", data.id)}
                onTitleChange={(newTitle) => console.log(newTitle)}
            />

        )
    }
    nonIdealState() {
        return (
            <NonIdealState
                icon={"folder-open"}
                title="No Forms Found"
                description={"Create a form to populate this area"}
                action={<Button>Create Form</Button>}
            />
        )
    }

    render() {
        const children = this.props.data && this.props.data.length > 0 ? this.props.data.map((item, index) => this.renderRow(index)) : this.nonIdealState();
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ flex: '1 1 auto' }}>
                    {children}
                </div>
            </div>

        )
    }
}
type FormItemProps = {
    onTitleChange: (newTitle: string) => void;
    onClick: () => void;
    onDeleteClick: () => void;
    style?: object;
} & IFormItem
function FormItem(props: FormItemProps) {
    return (
        <Card style={props.style} onClick={() => props.onClick()} elevation={Elevation.FOUR} interactive>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div>

                    <h4>
                        <EditableText value={props.title} />
                    </h4>
                    <p className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{props.createdBy}</p>
                    <p className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{new Date(props.createdDate).toDateString()}</p>

                </div>

                <ButtonGroup large alignText={Alignment.RIGHT}>
                    <Button onClick={props.onDeleteClick} icon="trash"></Button>
                </ButtonGroup>
            </div>


        </Card>
    )
}
