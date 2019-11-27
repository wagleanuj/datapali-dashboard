import { useMutation } from "@apollo/react-hooks";
import { getRandomId, RootSection } from "@datapali/dpform";
import { Form, Input, Modal } from "antd";
import { GraphQLError } from "graphql";
import React, { useState } from "react";
import { Save_Form } from "./formbuilder.component";
import { IRootSection } from "./formfiller/types";

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
        const rootItem: IRootSection = {
            _type: "root",
            childNodes: [],
            id: newForm.id,
            name: formName
        }
        const formJson = RootSection.toJSON(newForm);
        formJson.content = JSON.stringify(
            {
                [rootItem.id]: rootItem
            }
        );
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
        <Modal destroyOnClose centered okText={'Create'} title={"Create New Form"} onCancel={onCancelFormCreation} onOk={onCreateNewForm} visible={props.isOpen} >
            <Form.Item label="Form Name">
                <Input onChange={(e: React.FormEvent<HTMLInputElement>) => setNewFormName(e.currentTarget.value)} />
            </Form.Item>


        </Modal>
    )
}