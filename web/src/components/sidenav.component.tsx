

import { Divider } from '@blueprintjs/core'
import React, { Component } from 'react'
import { ISidebarItemNode, SidebarMenu } from './navMenu.component'
import Logo from "../assets/images/icon.png";
const tabs: ISidebarItemNode[] = [
    {
        title: "Forms",
        routeKey: "forms",
        icon: "form",
        children:[]
    },
    {
        title: "Surveyors",
        routeKey: "surveyors",
        icon: "person",
        children: []

    },
    {
        title: "Statistics",
        routeKey: "statistics",
        icon: "grouped-bar-chart",
        children: []
    }
]

type SideNavProps = {

}

export default class SideNav extends Component<SideNavProps, { selectedRoute: string }> {
    state = {
        selectedRoute: ""
    }
    onSideBarItemClick(routeKey: string) {
        this.setState({
            selectedRoute: routeKey
        })
    }
    render() {
        return (
            <div className="sidebar">
                <div className="logo">
                    <img height={190} style={{ padding: 15 }} src={Logo} />
                </div>
                <Divider />
                <SidebarMenu
                    items={tabs}
                    activeRouteKey={this.state.selectedRoute}
                    onItemClick={this.onSideBarItemClick.bind(this)}
                />
            </div>
        )
    }
}
