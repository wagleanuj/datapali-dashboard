import { Alignment, Button, Navbar } from "@blueprintjs/core";
import React, { ReactNode } from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { tabs } from "../routes";
import { ISidebarItemNode } from "./navMenu.component";
import { SideNav } from "./sidenav.component";
import { NavBar } from "./navBar.component";
import { persistor } from "../configureStore";
import { ConnectedNavBar } from "../containers/navBar.container";


type DashboardProps = {

}
type DashboardState = {
}
export class DashboardComponent extends React.Component<DashboardProps, DashboardState>{

    render() {
        return (
            <Router>

                <div className="dashboard-wrapper">
                   <ConnectedNavBar/>
                    <div className="dashboard">

                        <div className="sidebar-wrapper">
                            <SideNav />
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
