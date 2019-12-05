import React, { Component } from 'react';
import { list } from '../api/apiUser';
import DefaultProfile from '../image/avatar.jpg'
import { Link } from 'react-router-dom';
import styles from '../style/User.module.css'

class Users extends Component {
    constructor() {
        super()
        this.state = {
            users: []
        }
    }

    // list all the users
    componentDidMount = () => {
        list().then(data => {
            if ( data.error ) {
                console.log(data.error)
            } else {
                this.setState({ users: data })
            }
        })
    }

    // show all users 
    renderUser = (users) => (
        <div className="container">
            <div className="row">
                { users.map((user, i) => (
                    <div class="col-xl-3 col-md-6 mb-4">

                        <div style={{borderRadius: "3px"}} className="card border-0 shadow" key={i}>

                            <img 
                                style={{height: "200px", width: "auto", borderRadius: "3px"}} 
                                className="img-thumbail" 
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} 
                                onError={i => (i.target.src = `${DefaultProfile}`)}
                                alt={user.name} 
                            />

                            <div className="card-body">
                                <h5 className="card-title text-center mb-0">{user.name}</h5>
                                <p className="card-text text-black-50">{user.email}</p>

                                <hr />

                                <Link
                                    id={styles.btn}
                                    to={`/user/${user._id}`}
                                    className="btn btn-raised btn-sm">
                                        View Profile
                                </Link>
                            </div>
                        </div>  
                    </div>
                ))}
            </div>
        </div>
    );
 
    render() {

        const { users } = this.state;
        return (
            <>
                <h2 style={{textAlign: "center"}} className="mb-5">Users</h2>
                <div className="container">

                    { this.renderUser(users) }
        
                </div>
            </>
        )
    }
}

export default Users;