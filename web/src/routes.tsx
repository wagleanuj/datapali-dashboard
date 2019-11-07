import React from "react";
import { Forms } from "./components/forms.component";
import { ISidebarItemNode } from "./components/navMenu.component";
import { Statistics } from "./components/statistics.component";
import { Surveyors } from "./components/surveyors.component";

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

]
