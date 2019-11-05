import { Button, Card, EditableText, Elevation } from '@blueprintjs/core';
import React, { Component } from 'react';
import { AutoSizer, CellMeasurer, CellMeasurerCache, List, ListRowProps } from 'react-virtualized';

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
                createdDate: 123123123,
                createdBy: "Anuj Wagle",
                sharedTo: ["who", "who"]

            }
        ]
    }
    componentDidMount() {
        window.addEventListener("resize", () => {
            this.height = window.innerHeight;
        })
    }
    renderRow(index: number) {
        const data = this.props.data[index];
        return (

            <FormItem
                key={data.id}
                {...data}
                onClick={(id) => console.log(id)}
                onTitleChange={(newTitle) => console.log(newTitle)}
            />

        )
    }
    render() {
        return (
            <div style={{ display: 'flex' }}>

                <div style={{ flex: '1 1 auto' }}>
                    {this.props.data.map((item,index)=> this.renderRow(index))}
                   
                </div>
            </div>

        )
    }
}
type FormItemProps = {
    onTitleChange: (newTitle: string) => void;
    onClick: (id: string) => void;
    style?: object;
} & IFormItem
function FormItem(props: FormItemProps) {
    return (
        <Card style={props.style} onClick={() => props.onClick(props.id)} elevation={Elevation.FOUR} interactive>
            <h1>
                <EditableText value={props.title} />
            </h1>
            <Button>This is shit</Button>

        </Card>
    )
}
