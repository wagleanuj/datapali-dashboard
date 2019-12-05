import React, { Component, ReactNode } from "react";

export const BuilderContext = React.createContext({
    activeSection: undefined,
    activeNode: undefined,
    setActiveSection: (sectionId: string) => { },
    setActiveNode: (nodeId: string) => { }
});
type BCPProps = {
    children: ReactNode,
    defaultSection: string,
    defaultNode: string,
}
export class BuilderContextProvider extends Component<BCPProps, any> {
    state = {
        activeSection: this.props.defaultSection,
        activeNode: this.props.defaultNode,
    }
    render() {
        return (
            <BuilderContext.Provider
                value={{
                    activeSection: this.state.activeSection,
                    activeNode: this.state.activeNode,
                    setActiveNode: (nodeId: string) => this.setState({ activeNode: nodeId }),
                    setActiveSection: (sectionId: string) => this.setState({ activeSection: sectionId })
                }

                }
            >
                {this.props.children}

            </BuilderContext.Provider>
        )
    }
}