import React, { Component } from 'react';
import { read } from '../api/apiUser'
import DefaultProfile from "../image/avatar.jpg"
import { Redirect, Link } from "react-router-dom"
import DeleteUser from '../Components/DeleteUser'
import { isAuthenticated } from '../Pages/Authentication/Signout'
import FollowProfileButton from '../Components/FollowProfileButton'
import FollowList from '../Components/FollowList';



class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: ""
        };
    }

    // check if user is already followed or not
    checkFollow = user => {
        const jwt = isAuthenticated();
        // one id has many other ids (followers) and vice versa
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id;
        })
        return match;
    };

    // set the data to the backend and update the follow or unfollow
    // FollowProfileButton component will call this child component method
    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ user: data, following: !this.state.following });
            }
        });
    };

    // init
    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                let following = this.checkFollow(data);
                this.setState({ user: data, following });
            }
        });
    };

    // Get the user iformation based on the user Id from the backend
    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    // to see the current user profile info from the menu link
    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    render() {
        const { redirectToSignin, user } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        const photoUrl = user._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
                  user._id
              }?${new Date().getTime()}`
            : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                    <div className="col-md-6">
                        <img
                            style={{ height: "200px", width: "auto" }}
                            className="img-thumbnail"
                            src={photoUrl}
                            onError={i => (i.target.src = `${DefaultProfile}`)}
                            alt={user.name}
                        />
                    </div>

                    <div className="col-md-6">
                        <div className="lead mt-2">
                            <p>Hello {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>{`Joined ${new Date(
                                user.created
                            ).toDateString()}`}</p>
                        </div>

                        {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id ? (
                            <div className="d-inline-block">
                                <Link
                                    className="btn btn-raised btn-success mr-5"
                                    to={`/user/edit/${user._id}`}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        ) : (
                            <FollowProfileButton
                                following={this.state.following}
                                onButtonClick={this.clickFollowButton}
                            />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />

                        <FollowList
                            followers={user.followers}
                            following={user.following}
                        />
                    </div>
                </div>
            </div>
        );
    }

}

export default Profile;