

import { Divider } from '@blueprintjs/core';
import React, { Component } from 'react';
import Logo from "../assets/images/icon.png";
import { tabs } from '../routes';
import { SidebarMenu } from './navMenu.component';

type SideNavProps = {

}

export class SideNav extends Component<SideNavProps, { selectedRoute: string }> {
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
