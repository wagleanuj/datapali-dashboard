import { getReadablePath } from "@datapali/dpform";
import { Card, Descriptions, Divider, PageHeader } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { FilledFormsPage } from "./components/filledFormsPage.component";
import { FormBuilder } from "./components/formbuilder.component";
import { renderQuestion } from "./components/formfiller/formItem.component";
import { FormViewerW } from "./components/formfiller/FormViewer.container";
import { Forms } from "./components/forms.component";
import { ISidebarItemNode } from "./components/navMenu.component";
import { Statistics } from "./components/statistics.component";
import { Users } from "./components/surveyors.component";
import { IFilledForm } from "./types";
const renderSectionHeader = (sectionName: string, path: number[], type: "section" | "root") => {
    if (type === "root") return null;
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Title level={type === "section" ? 4 : 3}>{`${getReadablePath(path)} ${sectionName}`}</Title>
            <Divider type="horizontal" />
        </div>
    )
}

const renderRootSectionHeader = (filledForm: IFilledForm, name: string) => {
    console.log(filledForm);
    return (
        <Card>

            <PageHeader
                title={name}
                style={{
                    border: '1px solid rgb(235, 237, 240)',
                }}
                subTitle=""
                extra={[

                ]}
                avatar={{ icon: "file" }}
            >
                <div

                >
                    <Descriptions title="Surveyor Information">
                        <Descriptions.Item label="Name">Zhou Maomao</Descriptions.Item>
                        <Descriptions.Item label="Started Date">{new Date(parseInt(`${filledForm.startedDate}`)).toLocaleDateString()}</Descriptions.Item>
                        <Descriptions.Item label="Completed Date">{new Date(parseInt(`${filledForm.completedDate}`)).toLocaleDateString()}</Descriptions.Item>

                    </Descriptions>
                </div>
            </PageHeader>
        </Card>

    )
}
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
        //@ts-ignore
        component: <FormViewerW
            renderSectionHeader={renderSectionHeader}
            renderQuestion={renderQuestion}
            renderRootSectionHeader={renderRootSectionHeader}
        />
    },

]
