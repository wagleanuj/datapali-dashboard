import { Classes, Collapse, IconName } from "@blueprintjs/core";
import classNames from "classnames";
import React, { Component, ReactNode } from "react";
import { SidebarItem } from "./navMenuItem.component";
export type ISidebarItemNode = {
    title: string;
    routeKey: string;
    icon: IconName;
    children: ISidebarItemNode[];
    component?: ReactNode;
    hideOnSidebar?: boolean;
}

type SidebarProps = {
    activeRouteKey: string;
    items: ISidebarItemNode[];
    onItemClick: (routeKey: string) => void;
    currentRouteKey?: string; //used for nesting
}
type SidebarState = {

}


export class SidebarMenu extends Component<SidebarProps, SidebarState>{
    checkIfSectionHasRouteKey(section: ISidebarItemNode, key: string) {
        if (section.routeKey === key) return true;
        for (let i = 0; i < section.children.length; i++) {
            const curr = section.children[i];
            const result = this.checkIfSectionHasRouteKey(curr, key);
            if (result) return true;
        }
        return false;

    }
    render() {
        const menu = this.props.items.map(section => {
            if (section.hideOnSidebar) return null;
            const item = <SidebarItem
                routeKey={(this.props.currentRouteKey || "") + section.routeKey}
                title={section.title}
                iconName={section.icon}
                className={classNames({
                    "expanded": section.routeKey === this.props.activeRouteKey
                })}
                isSelected={section.routeKey === this.props.activeRouteKey}
                onClick={() => this.props.onItemClick(section.routeKey)}
            />
            const shouldExpand = this.checkIfSectionHasRouteKey(section, this.props.activeRouteKey);
            return (
                <li key={section.routeKey}>
                    {item}
                    {section.children.length > 0 ?
                        <Collapse isOpen={shouldExpand} keepChildrenMounted>

                            <SidebarMenu
                                {...this.props}
                                currentRouteKey={this.props.currentRouteKey || "" + section.routeKey}
                                items={section.children}
                            />
                        </Collapse>
                        : null}
                </li>
            )
        })
        return (
            <ul className={classNames("nav-menu", Classes.LIST_UNSTYLED)}>
                {menu}
            </ul>


        )
    }
}


