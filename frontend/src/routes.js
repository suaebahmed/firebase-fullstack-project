import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Signin from './components/auth/Signin'
import Signup from './components/auth/Signup'
import Deshbord from './components/Deshbord'

function routes() {
    return (
        <div>
            <Switch>
                <Route exact path="/" component={Deshbord} />
                <Route  path="/signup" component={Signup} />
                <Route  path="/signin" component={Signin} />
            </Switch>
        </div>
    )
}

export default routes
