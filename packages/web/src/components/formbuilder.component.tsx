import { ApolloConsumer, useMutation, useQuery } from "@apollo/react-hooks";
import { RootSection } from "@datapali/dpform";
import { SurveyForm } from "@datapali/formbuilder";
import { Button, Empty, message, Row, Spin } from "antd";
import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

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
            if (errors) message.error("Form could not be saved");
            else message.success("Form has been saved");
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

        if (!loading && (error || !data)) {
            return (
                <Empty
                    image={Empty.PRESENTED_IMAGE_DEFAULT}
                    description={"Please create a new Form by going back to Home"}
                >
                    <Button icon="home" onClick={() => history.replace("/forms")}> Home</Button>

                </Empty>
            )
        }
        if (loading) return <Row style={{ marginTop: 60 }}></Row>;
        let root: RootSection;
        if (data.forms.length === 0) {
            message.success("Started a new form!");
            root = new RootSection();
        } else {
            const form = data.forms[0];
            form.content = typeof (form.content) === "string" ? JSON.parse(form.content) : form.content
            root = RootSection.fromJSON(form);
        }

        return <SurveyForm token={""} onChange={() => { }} onSave={onSave} root={root} />
    }
    return (
        <ApolloConsumer>
            {client => <Spin spinning={loading}>{render(client)}</Spin>}
        </ApolloConsumer>
    )
}