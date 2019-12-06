import { useMutation, useQuery } from '@apollo/react-hooks';
import { Avatar, Button, Card, Col, Empty, Input, List, message, PageHeader, Popconfirm, Row, Skeleton, Tag } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AssignUser } from './assignUser.component';
import { NewFormDialog } from './newFormDialog.component';


const GET_FORMS = gql`
    query{
        forms{
          id
          name
          createdAt
          updatedAt
          assignedTo{
              _id
              firstName
              lastName
          }
        }
      } 

`;

const DELETE_FORMS = gql`
      mutation($formIds: [String]!){
          deleteForm(id:$formIds){
              message
          }
      }
`;

interface IFormItem {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    sharedTo: string[];
}

type NonIdealFormsStateProps = {
    onCreateClick: () => void;
}
function NonIdealFormsState(props: NonIdealFormsStateProps) {
    return (
        <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}

            description={
                <span>
                    No Forms found!
          </span>
            }
        >
            <Button onClick={props.onCreateClick} type="primary">Create Form</Button>
        </Empty>

    )
}
type FormsProps = {
}

export function Forms(props: FormsProps) {
    const { loading, error, data } = useQuery(GET_FORMS, { pollInterval: 1000 });
    const [deleteForm, { data: deleteFormResult }] = useMutation(DELETE_FORMS);

    const [isWizardOpen, setWizardOpen] = useState(false);
    const [assigningForm, setAssigningForm] = useState(null);

    const onAddFormClick = () => {
        setWizardOpen(true);
    }

    const onFormDeleteConfirm = async (toDeleteForms: string[]) => {
        const { data, errors } = await deleteForm({ variables: { formIds: toDeleteForms } });
        if (errors) message.error("Could not delete the form file, try again later!");
        else {
            message.success("Successfully deleted!");
        }
    }

    const content = (
        <div className="form-content">
            <Paragraph>
                Manage your forms and assign or unassign to your surveyors.
            </Paragraph>

            <Paragraph>
            </Paragraph>
            <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Col span={12}>
                    <Input.Search type="" size="large" placeholder="Find Users..." />
                </Col>
            </Row >

        </div >

    );

    const render = () => {

        if (!loading && (error || !data || data.forms.length === 0)) {
            return <NonIdealFormsState onCreateClick={() => setWizardOpen(true)} />
        }
        return (<>
            <AssignUser onOk={() => setAssigningForm(null)} onCancel={() => setAssigningForm(null)} formId={assigningForm} visible={!!assigningForm} />
            <NewFormDialog onCancel={() => setWizardOpen(false)} isOpen={isWizardOpen} onCreationSuccess={() => { setWizardOpen(false) }} />
            <Card>
                <PageHeader
                    title="Forms"
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    subTitle=""
                    extra={[
                        <Button onClick={() => setWizardOpen(true)} icon="file" type="primary" key="3">Create Form</Button>,

                    ]}
                    avatar={{ icon: "file" }}
                >
                    <div

                    >
                        {content}
                    </div>
                </PageHeader>
                <List
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={data && data.forms || []}
                    renderItem={(item: any) => (
                        <List.Item

                            actions={[
                                <Button onClick={() => {
                                    setAssigningForm(item.id)
                                }} type="primary" icon={'user-add'} key="add-user" />,
                                <Popconfirm placement={"left"} arrowPointAtCenter={true} title="Are you sure you want to delete this form?" onCancel={() => { }} onConfirm={() => onFormDeleteConfirm([item.id])} >
                                    <Button type="danger" icon={'delete'} key="delete" />
                                </Popconfirm>,

                            ]}
                        >
                            <Skeleton loading={loading} active avatar>
                                <List.Item.Meta
                                    avatar={<Avatar shape="square" size={64} icon="file-text" />
                                    }
                                    title={<Link to={`/formbuilder?id=${item.id}`}>{item.name}</Link>}
                                    description={new Date(parseInt(item.updatedAt)).toLocaleTimeString()}
                                />
                                <div>
                                    {item.assignedTo.map(item => <Tag key={item._id}>{item.firstName + " " + item.lastName}</Tag>)}
                                </div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
            </Card>

        </>
        );
    }
    return render();
}
