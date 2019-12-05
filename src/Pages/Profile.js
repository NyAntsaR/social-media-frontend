import React, { Component } from 'react';
import { read } from '../api/apiUser'
import DefaultProfile from "../image/avatar.jpg"
import { Redirect, Link } from "react-router-dom"
import DeleteUser from '../Components/DeleteUser'
import { isAuthenticated } from '../Pages/Authentication/Signout'
import FollowProfileButton from '../Components/FollowProfileButton'
import FollowList from '../Components/FollowList';
import { listByUser } from '../api/apiPost'

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: "",
            posts: []
        };
    }

    // check follow
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            // one id has many other ids (followers) and vice versa
            return follower._id === jwt.user._id;
        });
        return match;
    };

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

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToSignin: true });
            } else {
                let following = this.checkFollow(data);
                this.setState({ user: data, following });
                this.loadPosts(data._id);
            }
        });
    };

    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);
    }

    render() {
        const { redirectToSignin, user, posts } = this.state;
        if (redirectToSignin) return <Redirect to="/signin" />;

        const photoUrl = user._id
            ? `${process.env.REACT_APP_API_URL}/user/photo/${
                  user._id
              }?${new Date().getTime()}`
            : DefaultProfile;

        return (
            <>
                <h2 style={{ textAlign: "center"}}>Profile</h2>
                <hr />

                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <img
                                style={{ height: "250px", width: "auto", borderRadius: "50%", marginTop: "10px" }}
                                className="img-thumbnail"
                                src={photoUrl}
                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                alt={user.name}
                            />
                        </div>

                        <div style={{ border: "1px solid #ffe6e6", padding: "10px", borderRadius: "3px"}} className="col-md-8" id="profile">
                            <div className="lead mt-2">
                                <p> 
                                    Hello {" "}   
                                    <span style={{ fontFamily: "Dancing Script", color: "#ff9900", fontWeight: "bold"}}>
                                        {user.name}
                                    </span>
                                    <br />
                                    <span style={{color: "gray", fontSize: "13px", fontFamily: "Yanone Kaffeesatz"}}>
                                        {user.email}
                                    </span>
                                </p>

                                <hr />
                                <p className="lead">{user.about}</p>

                                <p>
                                    <span style={{color: "gray", fontSize: "13px", fontFamily: "Yanone Kaffeesatz"}}>
                                            {`Joined ${new Date(
                                            user.created
                                        ).toDateString()}`}
                                    </span>
                                </p>
                            </div>

                            {isAuthenticated().user &&
                            isAuthenticated().user._id === user._id ? (
                                <div className="btn-group">
                                    <Link
                                        style={{ backgroundColor: "#9e7700", borderRadius: "3px"}}
                                        className="btn btn-raised mr-5"
                                        to={`/post/create`}
                                    >
                                        <i class="fa fa-plus" aria-hidden="true"></i>
                                        {" "}Create Post
                                    </Link>

                                    <Link
                                    
                                        style={{ backgroundColor: "#9e4f00", borderRadius: "3px"}}
                                        className="btn btn-raised mr-5"
                                        to={`/user/edit/${user._id}`}
                                    >
                                        <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                        {" "} Edit Profile
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

                            <FollowList
                                followers={user.followers}
                                following={user.following}
                                posts={posts}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Profile;