import { useQuery } from "@apollo/react-hooks";
import { Avatar, Button, Card, List, PageHeader, Popconfirm, Skeleton, Spin, Typography } from "antd";
import gql from "graphql-tag";
import React from "react";
import { Link } from "react-router-dom";
const GET_FILLED_FORMS = gql`
query{
    getFilledForms{
      id
      filledBy
      formId
    }
  }`;
type FilledFormsPageProps = {

}
export function FilledFormsPage(props: FilledFormsPageProps) {
    const { data, loading, error } = useQuery(GET_FILLED_FORMS);
    const onClick = () => {

    }
    const onFormDeleteConfirm = (ids: string[]) => {

    }
    return (
        <>
            <Card>
                <PageHeader
                    title={"Filled forms"}
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    subTitle=""
                    extra={[

                    ]}
                    avatar={{ icon: "file" }}
                >
                    <div

                    >
                        <Typography.Paragraph>
                            Review submitted forms and make changes to the form if necessary.
                        </Typography.Paragraph>
                    </div>
                </PageHeader>
                <Spin spinning={loading}>

                    <List
                        loading={loading}
                        itemLayout="horizontal"
                        dataSource={data && data.getFilledForms || []}
                        renderItem={(item: any) => (
                            <List.Item

                                actions={[

                                    <Popconfirm placement={"left"} arrowPointAtCenter={true} title="Are you sure you want to delete this form?" onCancel={() => { }} onConfirm={() => onFormDeleteConfirm([item.id])} >
                                        <Button type="danger" icon={'delete'} key="delete" />
                                    </Popconfirm>,

                                ]}
                            >
                                <Skeleton loading={loading} active avatar>
                                    <List.Item.Meta
                                        avatar={<Avatar shape="square" size={64} icon="file-text" />
                                        }
                                        title={<Link to={`/formviewer?formId=${item.id}&rootId=${item.formId}`}>{item.id}</Link>}
                                        description={new Date(parseInt(item.updatedAt)).toLocaleTimeString()}
                                    />
                                    <div>
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />

                </Spin>
            </Card>

        </>
    )
}