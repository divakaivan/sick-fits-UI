import React from "react";
import {Query} from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";

import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const possiblePermissions = [
    "ADMIN",
    "USER",
    "ITEMCREATE",
    "ITEMUPDATE",
    "ITEMDELETE",
    "PERMISSIONUPDATE"
];

const ALL_USERS_QUERY = gql`
    query {
        users{
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = props => (
    <Query query={ALL_USERS_QUERY}>
        {({data, loading, error}) => (
            <div>
                <Error error={error}/>
                <div>
                    <h2>Manage permissions</h2>
                    <Table>
                        <thead>
                        <tr>
                            <th>name</th>
                            <th>Email</th>
                            {possiblePermissions.map((permission, i)=><th key={i}>{permission}</th>)}
                            <th>\/</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.users.map((user, i) => <User key={i} user={user}/>)}
                        </tbody>
                    </Table>
                </div>
            </div>
        )}
    </Query>
);

class User extends React.Component {
    render() {
        const user = this.props.user;
        return (
            <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map((permission, i)=>(
                    <td key={i}>
                        <label htmlFor={`${user.id}-permission-${permission}`}>
                            <input type="checkbox"/>
                        </label>
                    </td>
                ))}
                <td>
                    <SickButton>Update</SickButton>
                </td>
            </tr>
        )
    }
}

export default Permissions;
