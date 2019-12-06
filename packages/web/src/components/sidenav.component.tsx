

import { Menu, Typography } from 'antd';
import React from 'react';
import { tabs } from '../routes';
import { SidebarMenu } from './sidebar.component';
const { Title } = Typography;

type SideNavProps = {
    isVisible: boolean;
}

export function SideNav(props: SideNavProps) {


    if (!props.isVisible) return <></>
    return (
        <>
            <div style={{ textAlign: "center" }}>
                <Typography.Title ellipsis style={{ color: 'white' }}>Datapali</Typography.Title>

            </div>

            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                {SidebarMenu({
                    parentRouteKey: "",
                    items: tabs
                })}
            </Menu>
        </>
    )
}

