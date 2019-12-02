import React, { Component } from 'react';
import { isAuthenticated } from '../Components/Menu/Menu'
import { Redirect } from "react-router-dom"

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            user: "",
            redirectToSignin: false
        }
    }

    // Get the user iformation based on the user Id from the backend
    componentDidMount () {
        const userId = this.props.match.params.userId;
        fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${ isAuthenticated().token }`
            }
        })
        // handle the response to add to the state
        .then(response => {
            return response.json()
        })
        .then(data => {
            if(data.error) {
                this.setState({ redirectToSignin: true })
            } else {
                this.setState({ user: data })
            }
        })

    }

    render() {
        const redirectToSignin = this.state.redirectToSignin;
        if(redirectToSignin) return <Redirect to="/signin"/>

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">
                    Profile
                </h2>
                <p>Hello {isAuthenticated().user.name} </p>
                <p> {isAuthenticated().user.email} </p>
                <p> {`Joined ${new Date(this.state.user.created).toDateString()}`} </p>
            </div>
        )
    }
}

export default Profile;