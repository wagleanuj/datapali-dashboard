import { ApolloConsumer, useMutation, useQuery } from "@apollo/react-hooks";
import { Button, NonIdealState, Spinner } from "@blueprintjs/core";
import { RootSection } from "@datapali/dpform";
import { SurveyForm } from "@datapali/formbuilder";
import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AppToaster } from "../App";

export const GET_FORM = gql`
    query GetForm($formId:[String!]){
        forms(id: $formId){
          id
          name
          content
        }
      } 
`;

export const Save_Form = gql`
    mutation SaveForm($saveFile: FormFileInput!){
        saveForm(form: $saveFile){
          id
        }
      }`;


export function FormBuilder() {
    const params = new URLSearchParams(useLocation().search);
    const [saveForm, { data: saveFormResult }] = useMutation(Save_Form);
    const [isSaving, setSaving] = useState(false);
    const history = useHistory();
    //save handler
    const onSave = async (root: RootSection) => {
        if (!isSaving) {
            const file = RootSection.toJSON(root);
            file.content = JSON.stringify(file.content);
            setSaving(true);
            const { data, errors } = await saveForm({ variables: { saveFile: file } });
            if (errors) AppToaster.show({ message: "Form could not be saved", intent: "danger", icon: "warning-sign", timeout: 1000 });
            else AppToaster.show({ message: "Form has been saved", intent: "success", icon: "saved", timeout: 1000 });
            setSaving(false);
        }
    }
    const formId = params.get("id");
    //get form query execute
    const { data, loading, error } = useQuery(GET_FORM, {
        variables: {
            formId: [formId]
        }
    });

    const render = (client: ApolloClient<any>) => {
        if (loading) return <Spinner />

        if (error || !data) {
            return (
                <NonIdealState
                    icon={"warning-sign"}
                    title="Form not found"
                    description={"Please create a new Form by going back to Home"}
                    action={<Button icon="home" onClick={() => history.replace("/forms")}> Home</Button>}

                />
            )
        }
        let root: RootSection;
        if (data.forms.length === 0) {
            AppToaster.show({ message: "Started a new form", intent: "success", icon: "tick-circle", timeout: 2000 });
            root = new RootSection();
        } else {
            const form = data.forms[0];
            form.content = typeof (form.content) === "string" ? JSON.parse(form.content) : form.content
            root = RootSection.fromJSON(form);
        }

        return <>
            <SurveyForm token={""} onChange={() => { }} onSave={onSave} root={root} />
        </>
    }
    return (
        <ApolloConsumer>
            {client => render(client)}
        </ApolloConsumer>
    )
}