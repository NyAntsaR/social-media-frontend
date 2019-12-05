import React, { Component } from 'react';
import { findPeople, follow } from '../api/apiUser';
import DefaultProfile from '../image/avatar.jpg'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../Pages/Authentication/Signout';
import styles from '../style/FindPeople.module.css'

class FindPeople extends Component {
    constructor() {
        super()
        this.state = {
            users: [],
            error: "",
            open: false
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

    clickFollow = (user, i) => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        // follow in apiUser
        follow( userId, token, user._id)
        .then(data => {
            if (data.error) {
                this.setState({error: data.error})
            } else {
                // find the user and remove 
                let toFollow = this.state.users;
                toFollow.splice(i, 1)
                this.setState({
                    users: toFollow,
                    // show the message instead of the user
                    open: true,
                    followMessage: `Following ${user.name}`
                })
            }
        })
    }

    // show all users 
    renderUser = (users) => (
        <div className="container">
            <div className="row">
                { users.map((user, i) => (
                    <div className="col-xl-3 col-md-6 mb-4">
                        <div style={{borderRadius: "3px", border:"1px solid black", width:"302px"}} key={i}>

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

                                <hr/>

                                <Link 
                                    id={styles.btn}
                                    to={`/user/${user._id}`}
                                    className="btn btn-raised btn-sm">
                                        View Profile
                                </Link>

                                <button style={{backgroundColor: "#"}} onClick={() => this.clickFollow(user, i)} className="btn float-right btn-sm btn btn-success btn-raised mr-5">
                                    Follow
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
 
    render() {

        const { users, open, followMessage } = this.state;
        return (
            <>
                <h2 style={{ textAlign: "center"}} className="mb-5">Follow people</h2>
                
                {open && (
                    <div className="alert alert-success">
                        <p>
                            { followMessage }
                        </p> 
                    </div>
                )}
                { this.renderUser(users) }
            </>
        )
    }
}

export default FindPeople;