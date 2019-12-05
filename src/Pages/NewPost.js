import React, { Component } from 'react';
import { isAuthenticated } from './Authentication/Signout'
import { create } from '../api/apiPost'
import { Redirect } from 'react-router-dom'


class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            tite: '',
            body: '',
            photo:'',
            error:'',
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({user: isAuthenticated().user})
    }

    // check if the input fields are valide
    isValid = () => {
        const { title, body, fileSize } = this.state;

        if (fileSize > 1000000) {
            this.setState({ error: "File size should be less than 1000kb" });
            return false;
        }
        if (title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required!", loading: false })
            return false;
        }

        return true;
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        
        if(this.isValid()) {     
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            create(userId, token, this.postData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else
                    this.setState({ loading: false, title: '', body: '' , photo: '', redirectToProfile: true})
            });
        }
    };

    newPostForm = (title, body) => (
            <div className="container">
                <div className="row" style={{marginBottom: "20px"}}>
                    <div className="col-8">
                        <div style={{ padding: "20px"}}className="card card-signin flex-row my-10">
                            
                            <div className="card-body">
                                <h5 style={{fontSize:"30px"}} className="card-title text-center">Create your post</h5>
                                <hr/>
                                <form class="form-signin">
                                    <label className="text-muted">Upload Photo</label>
                                    <div className="form-label-group">
                                        <input
                                            onChange={this.handleChange("photo")}
                                            type="file"
                                            accept="image/*"
                                            className="form-control"
                                        />
                                    </div>

                                    <br />

                                    <div className="form-label-group">
                                        <label className="text-muted">Title</label>
                                        <input
                                            onChange={this.handleChange("title")}
                                            type="text"
                                            className="form-control"
                                            value={title}
                                        />
                                    </div>
                               
                                    <br />
                                    <div className="form-label-group">
                                        <label className="text-muted">Description</label>
                                        <textarea
                                            onChange={this.handleChange("body")}
                                            type="text"
                                            className="form-control"
                                            value={body}
                                        />
                                    </div>
                                    <hr/>

                                    <button
                                        style={{backgroundColor: "#ff9900", color: "white"}}
                                        onClick={this.clickSubmit}
                                        className="btn btn-lg btn-block text-uppercase"
                                    >
                                        Create Post
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-4">
                       
                            <img style={{width: "342px", borderRadius: "3px"}}src="https://cdn.pixabay.com/photo/2019/12/04/13/12/hair-4672683_1280.jpg"/>
              
                    </div>
                </div>
            </div>
    
   
    );

    render() {
        const { title, body, photo, user, error, loading, redirectToProfile } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`} />
        }
        
        return (
            <>
                <h2 className="mb-5" style={{ textAlign: "center"}}>Create a new post </h2>
                <div className="container">

                    <div 
                        className="aler alert-danger"
                        style={{ display: error ? "" : "none" }}
                    >
                        {error}
                    </div>

                    { loading ? (
                        <div className="jumbotron text-center">
                            <h2>Loading...</h2>
                        </div>
                    ) : (
                        ""
                    )}

                    {this.newPostForm(title, body)}
                </div>
            </>
        );
    }
}

export default NewPost;