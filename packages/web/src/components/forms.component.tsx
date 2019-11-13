import { useMutation, useQuery } from '@apollo/react-hooks';
import { Alert, Alignment, Button, ButtonGroup, Card, Classes, EditableText, Elevation, Intent, Navbar, NonIdealState, Spinner } from '@blueprintjs/core';
import classNames from 'classnames';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AppToaster } from '../App';
import { Save_Form } from './formbuilder.component';
import { NewFormDialog } from './newFormDialog.component';


const GET_FORMS = gql`
    query{
        forms{
          id
          name
          createdAt
          updatedAt
        }
      } 

`;

const DELETE_FORMS = gql`
      mutation($formIds: [String]!){
          deleteForm(id:$formIds){
              message
          }
      }
`;

interface IFormItem {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
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
    const { loading, error, data } = useQuery(GET_FORMS, { pollInterval: 1000 });
    const [saveForm, { data: saveFormResult }] = useMutation(Save_Form);
    const [deleteForm, { data: deleteFormResult }] = useMutation(DELETE_FORMS);
    const history = useHistory();
    const location = useLocation();
    const [selected, setSelected] = useState([]);
    const [newFormName, setNewFormName] = useState(null)
    const [isWizardOpen, setWizardOpen] = useState(false);
    const [toDeleteForms, setToDeleteForms] = useState([]);
    const onItemClick = (id: string) => {
        history.push("/formbuilder?id=" + id, location.state);
    }
    const onAddFormClick = () => {
        setWizardOpen(true);
    }

    const onFormDeleteConfirm = async () => {
        const { data, errors } = await deleteForm({ variables: { formIds: toDeleteForms } });
        if (errors) AppToaster.show({ message: "Could not delete the form file, try again later!", intent: Intent.DANGER, icon: "warning-sign" });
        else {
            AppToaster.show({ message: "Successfully deleted!", intent: Intent.SUCCESS, icon: "tick" });
        }
        setToDeleteForms([]);
    }
    const onDeleteFormClick = (id: string) => {
        setToDeleteForms([id]);
    }


    const render = () => {
        if (loading) {
            return <Spinner />
        }
        if (error || !data || data.forms.length === 0) {
            return <NonIdealFormsState />
        }
        return (<>
            <NewFormDialog onCancel={() => setWizardOpen(false)} isOpen={isWizardOpen} onCreationSuccess={() => { setWizardOpen(false) }} />
            <Navbar>
                <Navbar.Group align={Alignment.LEFT}>
                    <Button onClick={onAddFormClick} icon="plus">New Form</Button>
                </Navbar.Group>
            </Navbar>
            <Alert
                cancelButtonText="Cancel"
                confirmButtonText="Delete"
                icon="delete"
                intent={Intent.DANGER}
                isOpen={toDeleteForms.length > 0}
                onCancel={() => setToDeleteForms([])}
                onConfirm={() => onFormDeleteConfirm()}
            >
                <p>
                    Are you sure you want to delete the form ?
                    </p>
            </Alert>

            {data.forms.map(item => {
                return (
                    <FormItem
                        key={item.id}
                        {...item}
                        style={{ marginTop: 10, marginBottom: 10 }}
                        onDeleteClick={() => onDeleteFormClick(item.id)}
                        createdAt={parseInt(item.createdAt)}
                        updatedAt={parseInt(item.updatedAt)}
                        onClick={() => onItemClick(item.id)}
                    />)
            })}
        </>
        )
    }
    return render();
}


type FormItemProps = {
    onTitleChange: (newTitle: string) => void;
    onClick: () => void;
    onDeleteClick: () => void;
    style?: object;
} & IFormItem
function FormItem(props: FormItemProps) {

    return (
        <Card style={props.style} elevation={Elevation.FOUR} >
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <h4>
                    <EditableText value={props.name} />
                </h4>
                <ButtonGroup>
                    <Button title="Edit Form" onClick={props.onClick} large icon="edit" />
                    <Button title="Delete Form" onClick={props.onDeleteClick} large icon="trash"></Button>
                </ButtonGroup>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <div>
                    <p className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>{props.createdBy}</p>
                    <p className={classNames(Classes.TEXT_MUTED, Classes.TEXT_SMALL)}>Last Updated: {new Date(props.updatedAt).toLocaleTimeString()}</p>
                </div>

            </div>


        </Card>
    )
}
