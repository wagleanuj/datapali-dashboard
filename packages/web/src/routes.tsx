import React from "react";
import { FilledFormsPage } from "./components/filledFormsPage.component";
import { FormBuilder } from "./components/formbuilder.component";
import { FormViewer } from "./components/formfiller/formviewer.component";
import { Forms } from "./components/forms.component";
import { ISidebarItemNode } from "./components/navMenu.component";
import { Statistics } from "./components/statistics.component";
import { Users } from "./components/surveyors.component";
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
        icon: "user",
        component: <Users />,
        children: []
    },
    {
        title: "Statistics",
        routeKey: "/statistics",
        icon: "pie-chart",
        component: <Statistics />,
        children: []
    },

    {
        title: "Form Builder",
        routeKey: "/formbuilder",
        hideOnSidebar: true,
        icon: "form",
        children: [],
        component: <FormBuilder />
    },

    {
        title: "Filled Forms",
        routeKey: "/filledForms",
        hideOnSidebar: false,
        icon: "form",
        children: [],
        component: <FilledFormsPage />
    },

    {
        title: "Form Builder",
        routeKey: "/formviewer",
        hideOnSidebar: true,
        icon: "form",
        children: [],
        component: <FormViewer renderSectionHeader={() => null} renderQuestion={() => null} />
    },

]
