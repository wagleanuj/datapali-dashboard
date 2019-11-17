import { useMutation, useQuery } from "@apollo/react-hooks";
import { message, Modal, Spin, Tooltip, Transfer, Typography } from "antd";
import { TransferItem } from "antd/lib/transfer";
import gql from "graphql-tag";
import React, { useState } from "react";

const GET_USERS = gql`query{
    users{
      _id
      firstName
      lastName
      email
      accountType
      availableForms{
        id
        name
      }
    }
  }`;

const GET_FORM = gql`
    query($ids: [String]){
        forms(id: $ids){
          name
          assignedTo{
              _id
              email
             
          }
        }
      } 
`;

const MAKE_AVAILABLE = gql`
    mutation MakeAvailable($formIds:[String]!,$surveyors:[String]!){
        makeFormsAvailableFor(formIds:$formIds, surveyorEmails:$surveyors){
            message
        }
    }
`
const MAKE_UNAVAILABLE = gql`
    mutation MakeUnavailable($formIds:[String]!,$surveyors:[String]!){
        makeFormsUnavailableFor(formIds:$formIds, surveyorEmails:$surveyors){
            message
        }
    }
`
const useTargetUsersForForm = function (formId: string) {
    const [targetUsers, setTargetUsers] = useState([]);

}
type AssignUserProps = {
    visible: boolean;
    formId: string;
    onOk: () => void;
    onCancel: () => void;
}
export function AssignUser(props: AssignUserProps) {
    const [targetUsers, setTargetUsers] = useState([]);
    const [initialUsers, setInitialUsers] = useState([]);
    const { data: usersData, error: usersError, loading: usersLoading } = useQuery(GET_USERS, {

    });

    const { data: formData, error: formError, loading: formLoading } = useQuery(GET_FORM, {
        variables: { ids: [props.formId] },
        onCompleted: (resultForm) => {
            setInitialUsers(resultForm.forms[0] ? resultForm.forms[0].assignedTo.map(item => item.email) : []);
            setTargetUsers(resultForm.forms[0] ? resultForm.forms[0].assignedTo.map(item => (item.email)) : [])
        }
    });

    const [makeAvailable] = useMutation(MAKE_AVAILABLE);
    const [makeUnavailable] = useMutation(MAKE_UNAVAILABLE);



    const handleChange = (newUsers: string[]) => {

        setTargetUsers(newUsers);
    }
    const onOK = async () => {
        const newUsers = targetUsers;
        let unavailTo = [];
        initialUsers.forEach(user => {
            if (!newUsers.includes(user)) {
                unavailTo.push(user);
            }
        });
        const a = makeAvailable({
            variables: {
                formIds: [props.formId],
                surveyors: newUsers
            }
        });
        const u = makeUnavailable({
            variables: {
                formIds: [props.formId],
                surveyors: unavailTo
            }
        })
        Promise.all([a, u]).then(res => {
            message.success("Sucessfully made changes.");
            if (props.onOk) props.onOk();
        }).catch(err => {
            message.error("Something went wrong, please try again later.");

        })
    }
    const onCancel = () => {
        if (props.onCancel) props.onCancel();
    }

    const dataSource = (): TransferItem[] => formData && usersData ? usersData.users
        .filter(user => user.accountType === "surveyor")
        .map(user => {
            return {
                key: user.email,
                title: user.firstName + " " + user.lastName,
                email: user.email,
            } as TransferItem
        }) : [];


    return (
        <Modal visible={props.visible} onCancel={onCancel} onOk={onOK}>
            <Spin spinning={usersLoading || formLoading}>
                <Transfer
                    titles={["All Users", "Available To"]}
                    dataSource={dataSource()}
                    targetKeys={targetUsers}
                    onChange={handleChange}
                    render={item => <Tooltip placement="top" title={item.email}>
                        <Typography.Text >{item.title}</Typography.Text>
                    </Tooltip>}
                />
            </Spin>

        </Modal>

    )
}

