import React, { Component } from 'react';
import { isAuthenticated } from '../Pages/Authentication/Signout'
import { read, update, updateUser } from '../api/apiUser'
import { Redirect } from 'react-router-dom'
import DefaultProfile from "../image/avatar.jpg"

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
            about: ""
        };
    }

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    error: "",
                    about: data.about
                });
            }
        });
    };

    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    // check if the input fields are valide
    isValid = () => {
        const { name, email, password, fileSize } = this.state;

        if (fileSize > 1000000) {
            this.setState({ error: "File size should be less than 1000kb" });
            return false;
        }
        if (name.length === 0 ) {
            this.setState({error: "Name is required!"})
            return false
        }

        // regulare expression to check if it's not a valid email
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            this.setState({error: "A Valid Email is required!"})
            return false
        }

        // password update optional
        if ( password.length >= 1 && password.length <= 5  ) {
            this.setState({
                error: "Password must be at least 6 characters!"
            })
            return false;
        }

        return true;
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        const value =
            name === "photo" ? event.target.files[0] : event.target.value;

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({ [name]: value, fileSize });
    };

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        
        if(this.isValid()) {     
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;

            update(userId, token, this.userData).then(data => {
                if (data.error) this.setState({ error: data.error });
                else
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        });
                    }) 
            });
        }
    };

    signupForm = (name, email, password, about) => (
        <div className="container">
            <div className="row" style={{marginBottom: "20px"}}>
                <div className="col-8">

              
                    <div style={{ padding: "20px"}}className="card card-signin flex-row my-10">
                        <div className="card-body">
                            <h5 style={{fontSize:"30px"}} className="card-title text-center">Edit Profile</h5>
                            <hr />

                            <form class="form-signin">
                                <div className="form-group">
                                    <label className="text-muted">Profile Photo</label>
                                    <input
                                        onChange={this.handleChange("photo")}
                                        type="file"
                                        accept="image/*"
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="text-muted">Name</label>
                                    <input
                                        onChange={this.handleChange("name")}
                                        type="text"
                                        className="form-control"
                                        value={name}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="text-muted">Email</label>
                                    <input
                                        onChange={this.handleChange("email")}
                                        type="email"
                                        className="form-control"
                                        value={email}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="text-muted">About</label>
                                    <textarea
                                        onChange={this.handleChange("about")}
                                        type="text"
                                        className="form-control"
                                        value={about}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="text-muted">Password</label>
                                    <input
                                        onChange={this.handleChange("password")}
                                        type="password"
                                        className="form-control"
                                        value={password}
                                    />
                                </div>
                                <button
                                    style={{ color: "white", backgroundColor:"#ff9900"}}
                                    onClick={this.clickSubmit}
                                    className="btn btn-raised btn-lg btn-block text-uppercase"
                                >
                                    Update
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <img style={{width: "435px", borderRadius: "3px"}} src="https://cdn.pixabay.com/photo/2017/05/13/12/39/beauty-2309516_1280.jpg"></img>
                </div>
            </div>
        </div>
    );

    render() {
        const { id, name, email, password, redirectToProfile, error, loading, about } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${id}`} />;
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        
        return (
            <>
                <h2 style={{textAlign: "center"}} className="mb-5">Edit Profile</h2>
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

                    <img 
                        style={{height: "200px", width: "auto"}} 
                        className="img-thumbnail" 
                        src={photoUrl} alt={name} 
                    />

                    {this.signupForm(name, email, password, about)}
                </div>
            </>
        );
    }
}

export default EditProfile;