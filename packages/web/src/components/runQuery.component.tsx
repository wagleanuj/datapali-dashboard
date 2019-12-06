import { ApolloConsumer } from '@apollo/react-hooks';
import { Button, Card, Divider, Form, Input, message, Radio, Typography } from 'antd';
import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import prettyFormat from 'pretty-format';
import React, { Component } from 'react';
const RUN_QUERY = gql`
query RunQuery($formId: String!, $query: String!){
    runQueryOn(formId:$formId, query:$query)
  }
`;

const RUN_AGGREGATION = gql`
query RunAggregation($formId: String!, $query: String!){
    runAggregationOn(formId:$formId, query:$query)
  }
`;


const INIT_DB = gql`
mutation InitDB($formId:String!){
    initDbFor(formId:$formId)
    {
      message
    }
  }`;
type QueryMode = "query" | "aggregation"
type RunQueryProps = {
    formId: string;
    onQuerySuccess: (result: string) => void;

}
type RunQueryState = {
    mode: QueryMode;
    results: any;
}
export default class RunQuery extends Component<RunQueryProps, RunQueryState> {
    queryInput: any;
    client: ApolloClient<any>;
    constructor(props: RunQueryProps) {
        super(props);
        this.state = {
            mode: "query",
            results: ""
        }
    }
    handleModeChange = (e) => {
        this.setState({
            mode: e.target.value
        });
    }

    validate = () => {

    }
    runQuery = async () => {
        const query = this.queryInput.state.value;
        this.client.mutate({
            mutation: this.state.mode === "query" ? RUN_QUERY : RUN_AGGREGATION,
            variables: {
                formId: this.props.formId,
                query: query

            }
        }).then(res => {
            console.log(res);
            const result = this.state.mode === "query" ? res.data.runQueryOn : res.data.runAggregationOn;
            this.setState({
                results: JSON.parse(result)
            })
        }).catch(err => {
            message.error("Invalid query or database has not been initialized")
        });



    }

    render() {
        return (
            <ApolloConsumer>
                {client => {
                    this.client = client;
                    return (
                        <div>
                            <Radio.Group value={this.state.mode} onChange={this.handleModeChange}>
                                <Radio.Button value="query">Query</Radio.Button>
                                <Radio.Button value="aggregation">Aggregation</Radio.Button>
                            </Radio.Group>
                            <Form.Item>
                                <Input.TextArea rows={10} ref={r => this.queryInput = r} />
                            </Form.Item>

                            <Button style={{ width: "100%" }} type="primary" icon="play-circle" onClick={this.runQuery}>Execute</Button>

                            <Divider />
                            <div>
                                <Typography.Title level={4}>Results</Typography.Title>
                                {this.state.results && <Card>
                                    <code>{prettyFormat(this.state.results, { highlight: true, indent: 4 })}</code>
                                </Card>}
                            </div>
                        </div>
                    )
                }}
            </ApolloConsumer>

        )
    }
}
