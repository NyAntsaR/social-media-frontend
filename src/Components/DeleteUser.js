import React, { Component } from 'react';
import { isAuthenticated } from '../Pages/Authentication/Signout';
import { remove } from '../api/apiUser';
import { signout } from '../Pages/Authentication/Signout'
import { Redirect } from 'react-router-dom'

class DeleteUser extends Component {

        state = {
            redirect: false
        }

   

    // delete account
    deleteAccount = () => {
       const token = isAuthenticated().token;
       const userId = this.props.userId;
       remove(userId, token)
       .then(data => {
           if( data.error ) {
               console.log(data.error)
           } else {
               // signout user
               signout( () => console.log("User is deleted"))
               // redirect
               this.setState({ redirect: true })
           }
       })
    }

    // ask for the user confirmation
    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your account?")
        if (answer) {
            this.deleteAccount()
        }
    }

    render () {
        if (this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <button style={{ color: "black" }} onClick={this.deleteConfirmed} className="btn btn-raised btn-danger mr-5" >
                    <i class="fa fa-trash" aria-hidden="true"></i>
                    {" "}Delete Profile
                </button>
            </div>
        )
    }
}

export default DeleteUser;