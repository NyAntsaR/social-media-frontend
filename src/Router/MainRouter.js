import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../Pages/Home';
import Signup from '../Pages/Authentication/Signup';
import Signin from '../Pages/Authentication/Signin';
import Menu from '../Components/Menu';
import Profile from  '../Pages/Profile';
import Users from '../Pages/Users';
import EditProfile from '../Components/EditProfile';
import FindPeople from '../Components/FindPeople';
import NewPost from '../Pages/NewPost';
import PrivateRoute from '../Pages/Authentication/PrivateRoute'


const MainRouter = () => (
    <div>
        <Menu />
        <Switch>
            <Route exact path="/" component={ Home }></Route>
            <Route exact path="/users" component = { Users }></Route>
            <Route exact path="/signup" component= { Signup }></Route>
            <Route exact path="/signin" component= { Signin }></Route>
            <PrivateRoute exact path="/user/:userId" component= { Profile }></PrivateRoute>
            <PrivateRoute exact path="/user/edit/:userId" component= { EditProfile }></PrivateRoute>
            <PrivateRoute exact path="/findpeople" component= { FindPeople }></PrivateRoute>
            <PrivateRoute exact path="/post/create" component= { NewPost }></PrivateRoute>
        </Switch>
    </div>
);

export default MainRouter;