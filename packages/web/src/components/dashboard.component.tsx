import { Layout, Menu } from "antd";
import React, { ReactNode, useState } from "react";
import { BrowserRouter as Router, Route, useLocation } from 'react-router-dom';
import { ConnectedNavBar } from "../containers/navBar.container";
import { tabs } from "../routes";
import { ISidebarItemNode } from "./navMenu.component";
import { SideNav } from "./sidenav.component";


const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

type DashboardProps = {

}
type DashboardState = {
    isSidebarVisible: boolean;
}
export function DashboardComponent(props: DashboardProps) {
    const location = useLocation();
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
    const shouldShowSidebar = location.pathname !== "/formbuilder";
    return (

        <Router>
            <Layout>
                <Sider trigger={null} collapsible collapsed={isSidebarCollapsed}  >
                    <SideNav isVisible />
                </Sider>
                <Layout>


                    <Header style={{ background: '#fff', display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <ConnectedNavBar isSidebarCollapsed={isSidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />

                    </Header>

                    <Content style={{ padding: 16 }}>
                        {getRoutesComponents(tabs)}
                    </Content>
                    <Footer></Footer>

                </Layout>
            </Layout>

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
