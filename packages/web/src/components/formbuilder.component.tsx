import { useQuery } from "@apollo/react-hooks";
import { NonIdealState, Spinner } from "@blueprintjs/core";
import { RootSection } from "@datapali/dpform";
import { SurveyForm } from "@datapali/formbuilder";
import gql from "graphql-tag";
import React from "react";
import { useLocation } from "react-router-dom";

const GET_FORM = gql`
    query GetForm($formId:[String!]){
        forms(id: $formId){
          id
          name
          content
        }
      } 
`;
export function FormBuilder() {
    const params = new URLSearchParams(useLocation().search);

    const { data, loading, error } = useQuery(GET_FORM, {
        variables: {
            formId: [params.get("id")]
        }
    })
    const render = () => {
        if (loading) return <Spinner />
        if (error || !data || (!loading && data.forms.length === 0)) {
            return (
                <NonIdealState />
            )
        }
        const form = data.forms[0];
        form.content = typeof (form.content) === "string" ? JSON.parse(form.content) : form.content
        const root  = RootSection.fromJSON(form);
        return <SurveyForm token={""} onChange={() => { }} onSave={() => { }} root={root} />
    }
    return render();
}