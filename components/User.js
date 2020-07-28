import {Query} from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

const CURRENT_USER_QUERY = gql`
    query {
        me {
        id
        email
        name
        permissions
    }
    }
`;

/**
 * Our own render prop component, so that if we want user info, we wont have to do the Query in every component,
 * but just import this one and as children pass a function that has access to the payload with the
 * queried data.
 */
const User = props => (
    <Query {...props} query={CURRENT_USER_QUERY}>
        {payload=>props.children(payload)}
    </Query>
);

User.propTypes = {
    children: PropTypes.func.isRequired,
};

export default User;
export {CURRENT_USER_QUERY};