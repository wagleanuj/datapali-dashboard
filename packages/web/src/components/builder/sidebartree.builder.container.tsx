import { connect } from "react-redux"
import { IAppState } from "../../types"
import SidebarTree from "./sidebartree.builder.component"

const mapStateToProps = (state: IAppState, props: any) => ({
    tree: state.rootForms.byId[props.formId]
})

const mapDispatchToProps = {

}

export const ConnectedBuilderSidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarTree);
