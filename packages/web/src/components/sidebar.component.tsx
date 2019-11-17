import { Icon, Menu } from "antd";
import React from "react";
import { ISidebarItemNode } from "./navMenu.component";
import { NavLink, Link } from "react-router-dom";

const { SubMenu } = Menu;

type SidebarProps = {
    items: ISidebarItemNode[]
    parentRouteKey: string;
}
type SidebarState = {

}
export function SidebarMenu(props: SidebarProps) {

    return props.items.map(item => {
        if (item.hideOnSidebar) return null;

        if (item.children.length > 0) {
            //render submenu 
            return (

                <SubMenu
                    key={props.parentRouteKey + item.routeKey}
                    title={item.title}
                >
                    {SidebarMenu({
                        parentRouteKey: props.parentRouteKey + item.routeKey,
                        items: item.children
                    })}
                </SubMenu>
            )
        }
        return (
            <Menu.Item key={props.parentRouteKey + item.routeKey}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
                <Link to={props.parentRouteKey + item.routeKey} />
            </Menu.Item>

        )
    });



}      
