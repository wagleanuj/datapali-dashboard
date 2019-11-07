import React, { ReactNode } from "react";
interface ToolbarProps {
    handleItemClick: (tItem: string) => void;
    children: ReactNode;
}
interface ToolbarState {
}
export declare class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
    constructor(props: ToolbarProps);
    handleClick(name: string): void;
    render(): JSX.Element;
}
export {};
