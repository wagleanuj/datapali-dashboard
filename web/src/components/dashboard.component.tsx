import { Alignment, Button, Navbar } from "@blueprintjs/core"
import React from "react"
import SideNav from "./sidenav.component"
import { from } from "zen-observable"


type DashboardProps = {

}
type DashboardState = {
}
export class DashboardComponent extends React.Component<DashboardProps, DashboardState>{

    render() {
        return (
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

                    </div>
                </div>
            </div>

        )
    }
}
