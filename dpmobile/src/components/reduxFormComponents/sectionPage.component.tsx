import React from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-ui-kitten";
import { connect } from "react-redux";
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { FormItem } from "../../formComponents/surveyformitem";
import { getRootFormById, getRootFormSectionById } from "../../redux/selectors/questionSelector";
type SectionPagedProps = {
    sectionId: string;
    formId: string;
    rootId: string;
    data: any[]
} & InjectedFormProps
export class PagedSection_ extends React.Component<SectionPagedProps, {}> {
    render() {
        let comp: any = [];
        if (this.props.data.length > 1) {
            this.props.data.forEach((item, index) => {
                comp.push(
                    <Button appearance='outline' >{item.title}</Button>
                )
            })
        } else {
            comp = <View>
                <View>
                    <Text>{this.props.data[0].title}</Text>
                </View>
                <SectionContentList parentProps={this.props} data={this.props.data[0].content} />
            </View>
        }
        return comp;
    }
}


type SectionContentListProps = {
    data: any[],
    parentProps: SectionPagedProps
}
export class SectionContentList extends React.Component<SectionContentListProps, {}>{
    child = (props, item) => {
        return <FormItem
            formId={this.props.parentProps.formId}
            path={item.path}
            rootId={this.props.parentProps.rootId}
            questionId={item.id}
            value={props.input.value}
            onChange={props.input.onChange}
            onBlur={props.input.onChange}
        />
    }
    renderItem(item) {
        if (Array.isArray(item.item)) {
            return <PagedSection_ key={item.item[0].valueLocationName} {...this.props.parentProps} data={item.item} />
        }
        return <Field
            key={item.item.valueLocationName}
            name={item.item.valueLocationName}
            component={props => this.child(props, item.item)}
        />
    }
    render() {

        return <View>
            <FlatList
                data={this.props.data}
                keyExtractor={(item) => Array.isArray(item) ? item[0].id : item.id}
                renderItem={item => this.renderItem(item)}
            />
            {/* {this.props.data.map(item => this.renderItem(item, () => { }))} */}
        </View>

    }
}

const PagedSection = (reduxForm({
    destroyOnUnmount: false,
})(PagedSection_))

const mapStateToProps = (state, props) => {
    const s = getRootFormSectionById(state, props);
    return {
        section: s,
        form: props.formId,
        root: getRootFormById(state, props)
    }
}
const mapDisPatchToProps = (dispatch) => {
    return {

    }
};

export const SectionPageContainer = connect(mapStateToProps, mapDisPatchToProps)(PagedSection);