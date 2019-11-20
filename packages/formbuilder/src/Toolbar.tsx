import { Navbar, Alignment, Button, IconName, EditableText } from "@blueprintjs/core";
import React, { ReactNode } from "react";

const toolbarItems = [

    {
        type: "button",
        name: "up-one-level",
        icon: "arrow-up",
        text: ""
    },
    {
        type: "button",
        name: "save-root",
        icon: "floppy-disk",
        text: "Save Form"
    },
    {
        type: "button",
        name: "add-section",
        icon: "box",
        text: "Add Section"
    },
    {
        type: "button",
        name: "add-question",
        icon: "document",
        text: "Add Question"
    },
    {
        type: "button",
        name: "copy-state",
        icon: "clipboard",
        text: "Copy State"
    },

]
interface ToolbarProps {
    handleItemClick: (tItem: string) => void,
    children: ReactNode,
}
interface ToolbarState {

}
export class Toolbar extends React.Component<ToolbarProps, ToolbarState>{
    constructor(props: ToolbarProps) {
        super(props);
        this.state = {

        }
    }
    handleClick(name: string) {
        if (this.props.handleItemClick) this.props.handleItemClick(name)
    }
    render() {
        return (
            <Navbar  fixedToTop>
                <Navbar.Group align={Alignment.LEFT}>
                    {this.props.children}
                    {toolbarItems.map(item => <Button onClick={this.handleClick.bind(this, item.name)} key={item.name} icon={item.icon as IconName} text={item.text} className="bp3-minimal" />)}
                </Navbar.Group>
            </Navbar>
        )
    }

}