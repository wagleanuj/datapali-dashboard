import { Button, Menu, Modal, Icon } from "antd";
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
    onLogoutClick?: () => void;
}
export function NavBar(props: NavBarProps) {
    const onConfirmLogout = () => {
        if (props.onLogoutClick) props.onLogoutClick();

    }
    return (
        <>
            <Button style={{ float: 'right' }} onClick={e => showConfirm(onConfirmLogout)} key="1"><Icon type="logout" /></Button>

        </>

    )
}