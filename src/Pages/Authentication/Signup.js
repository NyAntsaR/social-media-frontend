import React, { Component } from 'react';
import { Link } from "react-router-dom";
import styles from '../../style/Signup.module.css'

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
        }
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name] : event.target.value});
    }

    clickSubmit = event => {
        event.preventDefault();
        const { name, email, password } = this.state;
        const user = {
            name,
            email, 
            password
        };

        this.signup(user)
        .then(data => {
            if (data.error) {
                this.setState({ error : data.error })
            } else {
                this.setState({
                    error: "",
                    name: "",
                    email: "",
                    password: "",
                    open: true
                })
            }
        });
    }

    signup = (user) => {
        // Make a post request to the backend
        return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then (response => {
            return response.json()
        })
        .catch(err => console.log(err));
    }

    signupForm = ( name, email, password ) => {
        return (
            <>
                <div className={styles.bg}></div>
                <div className={styles.modal}>
                    <div className={styles.card}>
                        <div className={styles.title}> Sign Up </div>
                        <form id={styles.signUp}>

                            <div className={styles.input}>
                                <label className="text-muted"> Name </label>
                                <input 
                                    onChange = { this.handleChange("name") } 
                                    type="text" 
                                    className="form-control" 
                                    value = { name }
                                />
                            </div>

                            <div className={styles.input}>
                                <label className="text-muted"> Email </label>
                                <input 
                                    onChange = { this.handleChange("email") } 
                                    type="email" 
                                    className="form-control" 
                                    value = { email }
                                />
                            </div>

                            <div className={styles.input}>
                                <label className="text-muted"> Password </label>
                                <input 
                                    onChange = { this.handleChange("password") } 
                                    type="password" 
                                    className="form-control" 
                                    value = { password }
                                />
                            </div>
                        </form>

                        <hr/>

                        <button 
                            style={{backgroundColor: "#ff9900"}}
                            className="btn btn-raised btn-lg"
                            onClick={this.clickSubmit}>
                                Submit
                        </button>
                    </div>
                </div> 
            </> 
        )
    }

    render () {

        const { name, email, password, error, open } = this.state;

        return (
            <>

                <div className="alert alert-primary" style={{ display: error ? "" : "none" }}>
                    { error }
                </div>

                <div className="alert alert-info" style={{ display: open ? "" : "none" }}>
                    New account is successfully created. Please <Link to="/signin">Sign In</Link>!
                </div>

                { this.signupForm( name, email, password ) }
            </>
           
        )
    }
}

export default Signup;