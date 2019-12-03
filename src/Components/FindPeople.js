import React, { Component } from 'react';
import { findPeople } from '../Pages/User/apiUser';
import DefaultProfile from '../image/avatar.jpg'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../Pages/Authentication/Signout';

class FindPeople extends Component {
    constructor() {
        super()
        this.state = {
            users: []
        }
    }

    // list all the users
    componentDidMount = () => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        findPeople( userId, token ).then(data => {
            if ( data.error ) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
            }
        })
    }

    // show all users 
    renderUser = (users) => (
        <div className="row">
           
            { users.map((user, i) => (
                <div className="card col-md-4" key={i}>

                    <img 
                        style={{height: "200px", width: "auto"}} 
                        className="img-thumbail" 
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} 
                        onError={i => (i.target.src = `${DefaultProfile}`)}
                        alt={user.name} 
                    />

                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>

                        <Link 
                            to={`/user/${user._id}`}
                            className="btn btn-raised btn-primary btn-sm">
                                View Profile
                        </Link>

                    </div>

              </div>
            ))}
        </div>
    );
 
    render() {

        const { users } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>

                { this.renderUser(users) }
    
            </div>
        )
    }
}

export default FindPeople;