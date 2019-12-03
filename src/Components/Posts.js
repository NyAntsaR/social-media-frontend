import React, { Component } from 'react';
import { list } from '../api/apiPost';
import DefaultPost from '../image/default.jpg';
import { Link } from 'react-router-dom';

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
            <div className="row"> 
                { posts.map((post, i) => {
                    
                    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                    const posterName = post.postedBy ? post.postedBy.name : "Unknown";

                    return (

                        <div className="card col-md-4" key={i}>
                            <img 
                                src={`${process.env.REACT_APP_API_URL}/post/ohoto/${post._id}`} 
                                alt={post.title}
                                onError={i => i.target.src = `${DefaultPost}`}
                                className="img-thumbnail mb-3"
                                style={{ height: '200px', width: 'auto' }}
                            />


                            <div className="card-body">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{post.body.substring(0, 100)}</p>
                                
                                <br />

                                <p className="font-italic mark">
                                    Posted by <Link to={`${posterId}`}>{posterName}{" "}</Link>
                                    on {new Date(post.created).toDateString()}
                                </p>

                                <Link 
                                    to={`/post/${post._id}`}
                                    className="btn btn-raised btn-primary btn-sm">
                                        Read More
                                </Link>

                            </div>
                        </div>
                    )
                })}
            </div>
        )
    };
 
    render() {

        const { posts } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Recent Posts</h2>

                { this.renderPost(posts) }
    
            </div>
        )
    }
}

export default Posts;