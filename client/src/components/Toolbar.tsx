import { Navbar, Alignment, Button, IconName } from "@blueprintjs/core";
import React from "react";

const toolbarItems = [
    {
        name: "up-one-level",
        icon: "arrow-up",
        text: ""
    },
    {
        name: "save-root",
        icon: "floppy-disk",
        text: "Save Form"
    },
    {
    name: "add-section",
    icon: "box",
    text: "Add Section"
},
{
    name: "add-question",
    icon: "document",
    text: "Add Question"
},
{
    name: "copy-state",
    icon: "clipboard",
    text: "Copy State"
},

]
interface ToolbarProps {
    handleItemClick: (tItem: string)=>void
}
interface ToolbarState {

}
export class Toolbar extends React.Component<ToolbarProps, ToolbarState>{
    constructor(props: ToolbarProps) {
        super(props);
        this.state = {

        }
    }
    handleClick(name:string){
        if(this.props.handleItemClick) this.props.handleItemClick(name)
    }
    render() {
        return (
            <Navbar className="bp3-dark" fixedToTop>
                <Navbar.Group align={Alignment.LEFT}>
                    {toolbarItems.map(item => <Button onClick={this.handleClick.bind(this, item.name)} key={item.name} icon={item.icon as IconName} text={item.text} className="bp3-minimal" />)}
                </Navbar.Group>
            </Navbar>
        )
    }

}