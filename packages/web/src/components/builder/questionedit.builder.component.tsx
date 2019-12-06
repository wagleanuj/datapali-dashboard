import { Form } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Action, Dispatch } from 'redux'
import { handleUpdateQuestion } from '../../actions/actions'
import { IAppState } from '../../types'
import { IQuestion } from '../formfiller/types'
type QuestionEditProps = {
    nodeId: string;
    rootId: string;
    node?: IQuestion
}
export default class QuestionEdit extends Component<QuestionEditProps, any> {
    render() {
        console.log(this.props.node)
        return (
            <div>
                <Form.Item label="Question Title">
                    <TextArea placeholder="question title" />
                </Form.Item>

                <Form.Item label="Question Type">
                    <TextArea placeholder="question title" />
                </Form.Item>

            </div>
        )
    }
}
const mapStateToProps = (state: IAppState, props: QuestionEditProps) => {
    return {
        node: state.rootForms.byId[props.rootId][props.nodeId]
    }
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        updateQuestion: (q: IQuestion, rootId: string) => dispatch(handleUpdateQuestion(rootId, q))
    }
}

export const ConnectedQuestionEdit = connect(mapStateToProps, mapDispatchToProps)(QuestionEdit);

