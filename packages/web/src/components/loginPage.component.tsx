import { LoginForm } from "../containers/login.container";
import React from "react";

export function LoginPage() {
    return (
        <div style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <LoginForm />
        </div>
    )
}