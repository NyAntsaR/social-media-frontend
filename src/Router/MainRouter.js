import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Pages/Home';
import Signup from '../Pages/User/Signup';
import Signin from '../Pages/User/Signin';

const MainRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={ Home }></Route>
            <Route exact path="/signup" component= { Signup }></Route>
            <Route exact path="/signin" component= { Signin }></Route>
        </Switch>
    </div>
);

export default MainRouter;