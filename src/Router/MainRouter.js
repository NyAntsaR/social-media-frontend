import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../Pages/Home';
import Signup from '../Pages/User/Signup';

const MainRouter = () => (
    <div>
        <Switch>
            <Route exact path="/" component={ Home }></Route>
            <Route exact path="/signup" component= { Signup }></Route>
        </Switch>
    </div>
);

export default MainRouter;