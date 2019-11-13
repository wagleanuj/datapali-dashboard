import { useMutation } from "@apollo/react-hooks";
import { Button, Classes, Dialog, FormGroup, InputGroup } from "@blueprintjs/core";
import { RootSection } from "@datapali/dpform";
import { GraphQLError } from "graphql";
import React, { useState } from "react";
import { Save_Form } from "./formbuilder.component";

type NewFormDialogProps = {
    onCreationSuccess?: (id: string) => void;
    isOpen: boolean;
    onCancel: () => void;
    onCreationFailed?: (errors: GraphQLError[]) => void;
}
export const NewFormDialog = function (props: NewFormDialogProps) {
    const [newFormName, setNewFormName] = useState(null)
    const [saveForm, { data: saveFormResult }] = useMutation(Save_Form);
    const [error, setError] = useState("");
    const onCreateNewForm = async () => {
        const formName = newFormName;
        if (!formName) {
            setError("Form Name cannot be empty");
        }
        const newForm = new RootSection().setName(formName);
        const formJson = RootSection.toJSON(newForm);
        formJson.content = JSON.stringify(formJson.content);
        const { errors, data } = await saveForm({ variables: { saveFile: formJson } });
        if (errors) {
            if (props.onCreationFailed) props.onCreationFailed(errors);
            return;
        }
        setNewFormName("")
        if (props.onCreationSuccess) props.onCreationSuccess(newForm.id);
    }
    const onCancelFormCreation = () => {
        setNewFormName("");
        if (props.onCancel) props.onCancel();
    }
    return (
        <Dialog title={"Create New Form"} isOpen={props.isOpen} isCloseButtonShown={false}>
            <div className={Classes.DIALOG_BODY}>
                <FormGroup label="Form Name">
                    <InputGroup onChange={(e: React.FormEvent<HTMLInputElement>) => setNewFormName(e.currentTarget.value)} />
                </FormGroup>

            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button color="primary" onClick={onCreateNewForm}>Create</Button>
                    <Button color="secondary" onClick={onCancelFormCreation}>Cancel</Button>
                </div>
            </div>

        </Dialog>
    )
}