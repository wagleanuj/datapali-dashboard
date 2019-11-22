import React, { Component } from 'react'
import RunQuery from './runQuery.component'
type DatabaseManagementProps = {

}
export default class DatabaseManagement extends Component<DatabaseManagementProps, any> {
    render() {
        return (
            <div>
                <RunQuery formId="root-53c37497-3808-cfd8-c886-1361dbaab171" onQuerySuccess={res => console.log(res)} />
            </div>
        )
    }
}
