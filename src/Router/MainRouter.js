import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../Pages/Home';
import Signup from '../Pages/Authentication/Signup';
import Signin from '../Pages/Authentication/Signin';
import Menu from '../Components/Menu/Menu';
import Profile from  '../Pages/Profile';
import Users from '../Pages/User/Users';


const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={ Home }></Route>
            <Route exact path="/users" component = { Users }></Route>
            <Route exact path="/signup" component= { Signup }></Route>
            <Route exact path="/signin" component= { Signin }></Route>
            <Route exact path="/user/:userId" component= { Profile }></Route>
        </Switch>
    </div>
);

export default MainRouter;