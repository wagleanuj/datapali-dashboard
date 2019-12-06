import { connect } from "react-redux"
import { getFormValues } from "redux-form"
import { IAppState } from "../../types"
import SidebarTree from "./sidebartree.builder.component"

const mapStateToProps = (state: IAppState, props: any) => ({
    tree: state.rootForms.byId[props.formId],
    values: getFormValues(props.formId)(state)
})

const mapDispatchToProps = {

}

export const ConnectedBuilderSidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarTree);
