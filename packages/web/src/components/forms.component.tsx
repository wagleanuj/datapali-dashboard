import { useQuery } from '@apollo/react-hooks';
import { Button, Card, Classes, EditableText, Elevation, NonIdealState, Spinner } from '@blueprintjs/core';
import classNames from 'classnames';
import gql from 'graphql-tag';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';


const GET_FORMS = gql`
    query{
        forms{
          id
          name
        }
      } 

`;

interface IFormItem {
    id: string;
    title: string;
    createdDate: number;
    createdBy: string;
    sharedTo: string[];
}


function NonIdealFormsState() {
    return (
        <NonIdealState
            icon={"folder-open"}
            title="No Forms Found"
            description={"Create a form to populate this area"}
            action={<Button>Create Form</Button>}
        />
    )
}
type FormsProps = {
}

export function Forms(props: FormsProps) {
    const { loading, error, data } = useQuery(GET_FORMS);
    const history = useHistory();
    const location = useLocation();
    const onItemClick = (id: string) => {
        history.replace("/formbuilder?id=" + id);
    }

    const render = () => {
        if (loading) {
            return <Spinner />
        }
        if (data.forms.length === 0) {
            return <NonIdealFormsState />
        }
        return (
            data.forms.map(item => {
                return (
                    <FormItem
                        key={item.id}
                        {...item}
                        onClick={() => onItemClick(item.id)}
                    />)
            })
        )
    }
    return render();
}
Forms.staticProps = [
    {
        id: "adsasd",
        title: "Form 1",
        lastUpdated: new Date().getTime(),
        createdBy: "Anuj Wagle",
        sharedTo: ["who", "who"]

    }
]

type FormItemProps = {
    onTitleChange: (newTitle: string) => void;
    onClick: () => void;
    onDeleteClick: () => void;
    style?: object;
} & IFormItem
function FormItem(props: FormItemProps) {
    return (
        <Card style={props.style} onClick={() => props.onClick()} elevation={Elevation.FOUR} interactive>
            <h4>
                <EditableText value={props.title} />
            </h4>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div>
                    <p className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{props.createdBy}</p>
                    <p className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{new Date(props.createdDate).toDateString()}</p>
                </div>

            </div>


        </Card>
    )
}
