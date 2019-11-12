import React, { ReactNode, useState } from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { ConnectedNavBar } from "../containers/navBar.container";
import { tabs } from "../routes";
import { ISidebarItemNode } from "./navMenu.component";
import { SideNav } from "./sidenav.component";


type DashboardProps = {

}
type DashboardState = {
    isSidebarVisible: boolean;
}
export function DashboardComponent(props: DashboardProps) {
    const location = useLocation();
    const shouldShowSidebar = location.pathname !== "/formbuilder";
    return (
        <Router>

            <div className="dashboard-wrapper">
                <ConnectedNavBar />
                <div className="dashboard">

                    <div style={{ display: shouldShowSidebar ? 'flex' : "none" }} className="sidebar-wrapper">
                        <SideNav isVisible={true} />
                    </div>
                    <div className="content-wrapper">
                        <Switch>
                            {getRoutesComponents(tabs)}
                        </Switch>
                    </div>
                </div>
            </div>
        </Router>


    )

}

function getRoutesComponents(tabs: ISidebarItemNode[], bag: ReactNode[] = [], parentPath: string = "") {
    tabs.forEach(tab => {
        const currentPath = parentPath + tab.routeKey;
        bag.push(
            <Route
                key={tab.routeKey}
                exact
                path={currentPath}
                children={tab.component || <h2>{tab.routeKey}</h2>}
            />
        );
        if (tab.children.length > 0) {
            getRoutesComponents(tab.children, bag, currentPath);
        }
    });
    return bag;
}
