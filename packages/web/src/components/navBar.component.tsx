import { Icon, Modal } from "antd";
import React from "react";
const { confirm } = Modal;

function showConfirm(onConfirm: () => void) {
    confirm({
        title: 'Sign Out',
        content: 'Are you sure you want to sign out?',
        onOk() {
            onConfirm();
        },
        onCancel() { },
    });
}

export type NavBarProps = {
    isSidebarCollapsed: boolean;
    setSidebarCollapsed: (val: boolean) => void;
    onLogoutClick?: () => void;
}
export function NavBar(props: NavBarProps) {
    const onConfirmLogout = () => {
        if (props.onLogoutClick) props.onLogoutClick();

    }
    return (
        <>
            <div>
                <Icon
                    style={{ fontSize: 20, color: "black" }}
                    className="trigger"
                    type={props.isSidebarCollapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={e => props.setSidebarCollapsed(!props.isSidebarCollapsed)}
                />
            </div>
            <div>
                <Icon onClick={() => showConfirm(onConfirmLogout)} style={{color:"black", fontSize: 20, alignSelf: "flex-end" }} type="logout" />
            </div>
        </>

    )
}