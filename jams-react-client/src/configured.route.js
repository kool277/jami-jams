
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth'
import SignUp from "layouts/SignUp.js";

export const ConfiguredRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={
            
            (props) => {
                if (auth.hasAdmin()) {
                    console.log('Admin already exits please signin');
                    return <Component {...props} />

                } else {
                    console.log('Not Admin Please signup and configure');
                    return <SignUp />
                }

            }
        } />
    )
}