import { Button, Tooltip } from "antd";
import { ButtonProps, ButtonShape, ButtonType } from "antd/lib/button";
import React from "react";
type FABProps = {
    className?: string;
    type?: ButtonType;
    shape?: ButtonShape;
    icon: string;
    title?: string;
    onClick?: (e: React.MouseEvent) => void;
} & ButtonProps;
export function FAB(props: FABProps) {
    return (
        <Tooltip placement="top" title={props.title}>
            <Button onClick={props.onClick} className={`float ${props.className}`} type={props.type} shape={props.shape} icon={props.icon} />
        </Tooltip>

    )
}