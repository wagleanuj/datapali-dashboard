import { Alert, Alignment, Button, Intent, Navbar } from "@blueprintjs/core";
import React, { useState } from "react";

export type NavBarProps = {
    onLogoutClick?: () => void;
}
export function NavBar(props: NavBarProps) {
    const [isSignOutModalOpen, setSignOutModalOpen] = useState(false);
    const onConfirmLogout = () => {
        if (props.onLogoutClick) props.onLogoutClick();
        setSignOutModalOpen(false);

    }
    return (
        <>
            <Navbar fixedToTop>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>Datapali</Navbar.Heading>
                    <Navbar.Divider />
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <Button onClick={() => setSignOutModalOpen(true)} className="bp3-minimal" icon={"log-out"} />
                </Navbar.Group>
            </Navbar>
            <Alert
                cancelButtonText="Cancel"
                confirmButtonText="Logout"
                icon="log-out"
                intent={Intent.DANGER}
                isOpen={isSignOutModalOpen}
                onCancel={() => setSignOutModalOpen(false)}
                onConfirm={onConfirmLogout}
            >
                <p>
                    Are you sure you want to logout ?
                    </p>
            </Alert>
        </>

    )
}