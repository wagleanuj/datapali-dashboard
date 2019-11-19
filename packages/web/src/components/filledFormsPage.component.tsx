import { useQuery } from "@apollo/react-hooks";
import { Avatar, Button, Card, List, PageHeader, Popconfirm, Skeleton, Spin, Typography } from "antd";
import gql from "graphql-tag";
import produce from "immer";
import React from "react";
import { Link } from "react-router-dom";
import { AutoSizer, InfiniteLoader, List as VList } from "react-virtualized";
const GET_FILLED_FORMS = gql`
query GetFilledFormsPaged($pagination: PaginationInput!) {
    getFilledForms(pagination: $pagination) {
      totalCount
      forms {
        id
        filledBy {
          firstName
          lastName
          email
        }
        formId
      }
    }
  }
  `;
type FilledFormsPageProps = {

}
export function FilledFormsPage(props: FilledFormsPageProps) {
    const { data, loading, error, fetchMore } = useQuery(GET_FILLED_FORMS, {
        variables: {
            pagination: {
                offset: 0,
                limit: 5,
            }
        }
    });
    const onClick = () => {

    }
    const onFormDeleteConfirm = (ids: string[]) => {

    }
    const rowRenderer = ({ key, index, style }) => {
        let item = data.getFilledForms.forms[index];
        const loadingItem = {
            loading: true,
            id: "",
            updatedAt: "",

        }
        if (!item) item = loadingItem;
        return (

            <List.Item
                key={key}
                style={style}
                actions={[

                    <Popconfirm placement={"left"} arrowPointAtCenter={true} title="Are you sure you want to delete this form?" onCancel={() => { }} onConfirm={() => onFormDeleteConfirm([item.id])} >
                        <Button type="danger" icon={'delete'} key="delete" />
                    </Popconfirm>,

                ]}
            >
                <Skeleton loading={item.loading} avatar>
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
        )

    }
    const isRowLoaded = ({ index }) => {
        return data && data.getFilledForms && !!data.getFilledForms.forms[index];

    }

    const loadMoreRows = () => {
        return fetchMore({
            variables: {
                pagination: {
                    offset: data && data.getFileldForms ? data.getFilledForms.forms.length : 0,
                    limit: 5
                }

            },
            updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return produce(prev, draft => {
                    //@ts-ignore

                    draft.getFilledForms.forms = [...prev.getFilledForms.forms, ...fetchMoreResult.getFilledForms.forms];
                    //@ts-ignore

                    draft.getFilledForms.totalCount = fetchMoreResult.getFilledForms.totalCount;
                })
            }
        })
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

                    <InfiniteLoader
                        isRowLoaded={isRowLoaded}
                        loadMoreRows={loadMoreRows}
                        rowCount={data && data.getFilledForms && data.getFilledForms.totalCount || 0}
                    >
                        {({ onRowsRendered, registerChild }) => {
                            return (
                                <AutoSizer disableHeight>
                                    {({ width }) => {
                                        return <VList
                                            height={600}
                                            onRowsRendered={onRowsRendered}
                                            ref={registerChild}
                                            rowCount={data && data.getFilledForms && data.getFilledForms.totalCount || 0}
                                            rowRenderer={rowRenderer}
                                            width={width}
                                            rowHeight={73}

                                        />
                                    }}
                                </AutoSizer>

                            )
                        }}

                    </InfiniteLoader>




                </Spin>
            </Card>

        </>
    )
}