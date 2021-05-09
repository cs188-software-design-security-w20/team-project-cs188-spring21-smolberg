import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoute = ({ component: Component, ...rest }) => {

    const { currentUser, currentOAuthUser } = useAuth()
    const loggedIn = currentOAuthUser && currentUser

    return (
        <Route
            {...rest} render={
                props => {
                    return loggedIn ? <Component {...props} /> : <Redirect to="/login" />
                }
            }>
        </Route>
    )
}

export default PrivateRoute
