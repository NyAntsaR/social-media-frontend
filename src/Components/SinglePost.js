import React, { Component } from "react";
import { signlePost } from '../api/apiPost';


class SinglePost extends Component {

    state = {
        post: ''
    }

    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        signlePost(postId).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                this.setState({ post: data })
            }
        })
    }

    render () {
        return (
            <div>
                <h2>Signle post</h2>
                {JSON.stringify(this.state.post)}
            </div>
        );
    }
}

export default SinglePost;