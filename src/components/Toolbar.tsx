import { Navbar, Alignment, Button } from "@blueprintjs/core";
import React from "react";

interface ToolbarProps {

}
interface ToolbarState {

}
export class Toolbar extends React.Component<ToolbarProps, ToolbarState>{
    constructor(props: ToolbarProps) {
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <Navbar className="bp3-dark" fixedToTop>
                <Navbar.Group align={Alignment.LEFT}>
                    <Button icon="box" text="Add Section" className="bp3-minimal"/>
                    <Button icon="document" text="Add Question" className="bp3-minimal"/>
                </Navbar.Group>
            </Navbar>
        )
    }
   
}