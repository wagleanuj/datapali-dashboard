import { Alignment, Button, Navbar } from "@blueprintjs/core"
import React, { ReactNode } from "react"
import { SideNav } from "./sidenav.component"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ISidebarItemNode } from "./navMenu.component"
import { tabs } from "../routes";


type DashboardProps = {

}
type DashboardState = {
}
export class DashboardComponent extends React.Component<DashboardProps, DashboardState>{

    render() {
        return (
            <Router>

                <div className="dashboard-wrapper">
                    <Navbar fixedToTop>
                        <Navbar.Group align={Alignment.LEFT}>
                            <Navbar.Heading>Blueprint</Navbar.Heading>
                            <Navbar.Divider />
                            <Button className="bp3-minimal" icon="home" text="Home" />
                            <Button className="bp3-minimal" icon="document" text="Files" />
                        </Navbar.Group>
                    </Navbar>
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
