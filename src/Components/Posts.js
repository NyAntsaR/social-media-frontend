import React, { Component } from 'react';
import { list } from '../api/apiPost';
import DefaultPost from '../image/default.jpg';
import { Link } from 'react-router-dom';
import styles from '../style/Post.module.css';

class Posts extends Component {
    constructor() {
        super()
        this.state = {
            posts: []
        }
    }

    // list all the posts
    componentDidMount = () => {
        list().then(data => {
            if ( data.error ) {
                console.log(data.error)
            } else {
                this.setState({ posts: data })
            }
        })
    }

    // show all users 
    renderPost = (posts) => {
        return (
            <div className="container">
                <div className="row"> 
                        { posts.map((post, i) => {
                            
                            const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                            const posterName = post.postedBy ? post.postedBy.name : "Unknown";

                            return (
                                <div class="col-xl-3 col-md-6 mb-4">

                                    <div className="card border-0 shadow" key={i}>
                                        <img 
                                            src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`} 
                                            alt={post.title}
                                            onError={i => i.target.src = `${DefaultPost}`}
                                            className="card-img-top"
                                            style={{ height: '200px', width: '100%' }}
                                        />


                                        <div className="card-body">
                                            <h5 className="card-title text-center mb-0">{post.title}</h5>
                                            <p className="card-text text-black-50">{post.body.substring(0, 100)}</p>
                                            
                                            <hr />

                                            <p className="font-italic">
                                                Posted by {" "}
                                                <Link 
                                                    style={{ textDecoration: "none", color: "#ff9900", fontFamily: "Dancing Script", fontWeight: "bold"}} 
                                                    to={`${posterId}`}>{posterName}{" "}
                                                </Link>
                                                on {new Date(post.created).toDateString()}
                                            </p>

                                            <Link 
                                                id={styles.btn}
                                                to={`/post/${post._id}`}
                                                className="btn btn-raised btn-sm">
                                                    Read More
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    };
 
    render() {

        const { posts } = this.state;

        return (
            <>  
                <div>
                    { this.renderPost(posts) }
                </div>
            </>
        )
    }
}

export default Posts;