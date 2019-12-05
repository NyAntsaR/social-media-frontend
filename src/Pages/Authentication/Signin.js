import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import styles from '../../style/Signin.module.css'
import SocialLogin from './SocialLogin';

class Signin extends Component {

    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name] : event.target.value});
    }

    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });

        const { email, password } = this.state;
        const user = {
            email, 
            password
        };

        this.signin(user)
        .then(data => {
            if (data.error) {
                this.setState({ error : data.error, loading: false })
            } else {
                // Authenticate user
                this.authenticate(data, () => {
                    this.setState({ redirectToReferer: true })
                })
            }
        });
    }

    authenticate = (jwt, next) => {
        // check if window is not undefined
        if (typeof window !== "undefined") {
            localStorage.setItem("jwt", JSON.stringify(jwt));
        } next();
    }

    signin = (user) => {
        // Make a post request to the backend
        return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
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

    signinForm = ( email, password ) => {
        return (
            <>
                <div className={styles.bg}></div>
                <div className={styles.modal}>
                    <div className={styles.card}>
                        <div className={styles.title}> SignIn </div>
                        <div>
                            <SocialLogin />
                        </div>
                        <hr></hr>
                        <form id={styles.signUp}>

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

        const { email, password, error, redirectToReferer, loading } = this.state;

        if ( redirectToReferer ) {
            return <Redirect to="/" />
        }

        return (
            <>
                <div>
                    <div className="alert alert-primary" style={{ display: error ? "" : "none" }}>
                        { error }
                    </div>

                    { this.signinForm( email, password ) }
                </div>
            </>
        )
    }
}

export default Signin;