import { Form } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { Component } from 'react'

export default class QuestionEdit extends Component {
    render() {
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
