import React, { Component } from 'react';
import { read } from '../Pages/User/apiUser'
import DefaultProfile from "../image/avatar.jpg"
import { Redirect, Link } from "react-router-dom"
import DeleteUser from '../Components/DeleteUser'
import { isAuthenticated } from '../Pages/Authentication/Signout'
import FollowProfileButton from '../Components/FollowProfileButton'

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            user: "",
            redirectToSignin: false
        }
    }

    // init
    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token).then(data => {
            if(data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                this.setState({ user: data });
            }
        });
    }

    // Get the user iformation based on the user Id from the backend
    componentDidMount () {
        const userId = this.props.match.params.userId;
        this.init(userId); 
    }

    // to see the current user profile info from the menu link
    componentWillReceiveProps (props) {
        const userId = props.match.params.userId;
        this.init(userId); 
    }

    render() {
        const {redirectToSignin, user } = this.state;
        if(redirectToSignin) return <Redirect to="/signin"/>

        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5"> Profile</h2>
                <div className="row">

                    <div className="col-md-6">

                    <img 
                        style={{height: "200px", width: "auto"}} 
                        className="img-thumbail" 
                        src={photoUrl} 
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                        alt={user.name} 
                    />

                    </div>

                    <div className="col-md-6">

                        <div className="lead mt-2">
                            <p>Hello {user.name} </p>
                            <p> {user.email} </p>
                            <p> {`Joined ${new Date(user.created).toDateString()}`} </p>
                        </div>

                        {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                            <div className="d-inline-block"> 
                                <Link 
                                    className="btn btn-raised btn-success mr-5" 
                                    to={`/user/edit/${ user._id }`}
                                >
                                    Edit Profile
                                </Link>

                                <DeleteUser  userId={user._id}/>
                                
                            </div>
                        ) :  (<FollowProfileButton />
                        
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;