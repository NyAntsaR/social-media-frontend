import React, { Component } from "react";
import { singlePost, remove, like, unlike } from '../api/apiPost';
import DefaultPost from '../image/default.jpg';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../Pages/Authentication/Signout'
import Comment from "../Components/Comment"

class SinglePost extends Component {

    state = {
        post: '',
        redirectToHome: false,
        redirectToSignin: false,
        like: false,
        likes: 0,
        comments: []
    }

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    }

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;

        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({redirectToHome: true})
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your account?")
        if (answer) {
            this.deletePost();
        }
    }

    renderPost = (post) => {
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : "Unknown";

        const { like, likes } = this.state;

        return (
            <div style={{border: "1px solid black", borderRadius: "3px", padding:"10px"}} className="container">
                <div className="card border-0 shadow">
                    <img 
                        src={`${process.env.REACT_APP_API_URL}/post/ohoto/${post._id}`} 
                        alt={post.title}
                        onError={i => i.target.src = `${DefaultPost}`}
                        className="img-thumbnail mb-3"
                        style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                    />

                    {like ? (
                        <h3 style={{ marginLeft: "30px"}} onClick={this.likeToggle}>
                            <i
                                className="fa fa-heart text-danger bg-dark"
                                style={{ padding: "10px", borderRadius: "50%" }}
                            />{" "}
                            {likes}
                        </h3>
                    ) : (
                        <h3 style={{ margin: "30px"}} onClick={this.likeToggle}>
                            <i
                                className="fa fa-heart text-warning bg-dark"
                                style={{ padding: "10px", borderRadius: "50%" }}
                            />{" "}
                            {likes} 
                        </h3>
                    )}
                    <p style={{ margin: "0 30px 0 30px"}} className="card-text text-black-50">{post.body}</p>
                        
                    <hr />

                    <p style={{ marginLeft: "30px", backgroundColor: "#ffd699"}} className="font-italic">
                        Posted by {" "}
                        <Link 
                            style={{ textDecoration: "none", color: "#ff9900", fontFamily: "Dancing Script", fontWeight: "bold"}} 
                            to={`${posterId}`}>{posterName}{" "}
                        </Link>
                        on {new Date(post.created).toDateString()}
                    </p>

                    <div className="d-inline-block">
                        <Link 
                            style={{ margin: "0 0 30px 30px", backgroundColor:"#8B0000", color: "white"}}
                            to={`/`}
                            className="btn btn-raised btn-sm mr-5">
                                Back to posts
                        </Link>

                        {isAuthenticated().user &&
                            isAuthenticated().user._id === post.postedBy._id && 
                            <>
                                <Link 
                                    to={`/post/edit/${post._id}`}
                                    className="btn btn-raised btn-warning btn-sm mr-5">
                                        Update post
                                </Link>

                                <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">
                                    Delete  Post
                                </button>
                            </>
                        }   
                    </div>
                </div>

            </div>
        )
    }

    render () {

        const { post, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        return (
            <>
                <h2 style={{textAlign:"center"}} className="display-2 mb-5">{post.title}</h2>
                
                { !post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div> ) : (
                        this.renderPost(post)
                    )
                }
                <div className="container">
                    <Comment
                        postId={post._id}
                        comments={comments.reverse()}
                        updateComments={this.updateComments}
                    />  
                </div>

            </>
        );
    }
}

export default SinglePost;