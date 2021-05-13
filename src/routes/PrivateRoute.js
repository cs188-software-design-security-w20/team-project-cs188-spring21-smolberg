import React from 'react'
import { Route } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'

const PrivateRoute = ({ component: Component, ...rest }) => {

    // TODO: finish auth controller for this component.
    // const { currentUser, currentOAuthUser } = useAuth()
    // const loggedIn = currentOAuthUser && currentUser

    return (
        <Route
            {...rest} render={
                props => {
                    return <Component {...props} /> 
            }
            }>
        </Route>
    )
}

export default PrivateRoute
