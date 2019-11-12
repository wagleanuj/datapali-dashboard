import { RootSection } from "@datapali/dpform";
import { SurveyForm } from "@datapali/formbuilder";
import React from "react";
import { Forms } from "./components/forms.component";
import { ISidebarItemNode } from "./components/navMenu.component";
import { Statistics } from "./components/statistics.component";
import { Surveyors } from "./components/surveyors.component";
import { FormBuilder } from "./components/formbuilder.component";
export const tabs: ISidebarItemNode[] = [
    {
        title: "Forms",
        routeKey: "/forms",
        icon: "form",
        component: <Forms />,
        children: [

        ]
    },
    {
        title: "Surveyors",
        routeKey: "/surveyors",
        icon: "person",
        component: <Surveyors />,
        children: []

    },
    {
        title: "Statistics",
        routeKey: "/statistics",
        icon: "grouped-bar-chart",
        component: <Statistics />,
        children: []
    },
    {
        title: "Roots",
        routeKey: "/roots",
        icon: "grouped-bar-chart",
        component: <SurveyForm onSave={() => { }} onChange={() => { }} token="" root={new RootSection()} />,
        children: []
    },
    {
        title: "Form Builder",
        routeKey: "/formbuilder",
        hideOnSidebar: true,
        icon: "form",
        children: [],
        component: <FormBuilder />
    }

]
