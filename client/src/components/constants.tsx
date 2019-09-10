import { Drawer } from "@blueprintjs/core";
import React from "react";




interface ConstantDefinitionsState {

}
interface ConstantDefinitionsProps {
    isOpen: boolean,
}
export class ConstantDefinitions extends React.Component<ConstantDefinitionsProps, ConstantDefinitionsState>{

    constructor(props: ConstantDefinitionsProps) {
        super(props);
        this.state = {

        }
    }
    render() {
         return (
            <Drawer isOpen={this.props.isOpen}>

            </Drawer>
        )
    }
}