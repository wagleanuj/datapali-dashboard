import { useMutation, useQuery } from '@apollo/react-hooks';
import { Button, Card, Empty, List, message, Popconfirm, Row, Spin } from 'antd';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NewFormDialog } from './newFormDialog.component';


const GET_FORMS = gql`
    query{
        forms{
          id
          name
          createdAt
          updatedAt
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



    const render = () => {
        if (loading) {
            return <Spin />
        }
        if (error || !data || data.forms.length === 0) {
            return <NonIdealFormsState onCreateClick={() => setWizardOpen(true)} />
        }
        return (<>
            <NewFormDialog onCancel={() => setWizardOpen(false)} isOpen={isWizardOpen} onCreationSuccess={() => { setWizardOpen(false) }} />
            <Row align='middle' justify='center' style={{ height: 40 }}>
                <Button onClick={onAddFormClick} icon="plus">New Form</Button>

            </Row>
            <Card>
                <List
                    className="demo-loadmore-list"
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={data.forms}
                    renderItem={(item: any) => (
                        <List.Item
                            actions={[
                                <Popconfirm placement={"left"} arrowPointAtCenter={true} title="Are you sure you want to delete this form?" onCancel={() => { }} onConfirm={() => onFormDeleteConfirm([item.id])} >
                                    <Button icon={'delete'} key="delete" />
                                </Popconfirm>
                            ]}
                        >
                            <List.Item.Meta
                                title={<Link to={`/formbuilder?id=${item.id}`}>{item.name}</Link>}
                                description={new Date(parseInt(item.updatedAt)).toLocaleTimeString()}
                            />
                        </List.Item>
                    )}
                />
            </Card>

        </>
        );
    }
    return render();
}
