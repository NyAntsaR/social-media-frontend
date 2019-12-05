import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../Pages/Authentication/Signout';
import style from '../style/Menu.module.css'

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#ff9900', fontWeight: "bold", fontStyle: "italic"};
    else return { color: '#ffffff', fontWeight: "bold" };
};

const Menu = ({ history }) => (
    <div className={style.navbar}>
        <ul className="nav navbar navbar-right">
            <li className="navbar-brand">
                
                <Link className="nav-link" style={isActive(history, '/')} to="/">
                    <i className="fa fa-home" aria-hidden="true" style={{ color: "black" }}></i>
                    {"  "}<span style={{ fontFamily: "Dancing Script", color: "#ff9900" }}> Connect </span>
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/users')} to="/users">
                    <i class="fa fa-users" aria-hidden="true" style={{ color: "black" }}></i>
                    {"  "}Users
                </Link>
            </li>

            { !isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">
                            <i class="fa fa-sign-in" aria-hidden="true" style={{ color: "black" }}></i>
                            {"  "}Sign In
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">
                            <i class="fa fa-sign-in" aria-hidden="true" style={{ color: "black" }}></i>
                            {"  "}Sign Up
                        </Link>
                    </li>
                </>
            )}

            { isAuthenticated() && (
                <>

                    <li className="nav-item">
                       
                       <Link className="nav-link"
                           to={`/findpeople`}
                           style={ isActive(history, `/findpeople`) }

                       >    
                            <i class="fa fa-search" aria-hidden="true" style={{ color: "black" }}></i>
                            {"  "}Find People
                       </Link>
                           
                   </li>

                   <li className="nav-item">
                       
                       <Link className="nav-link"
                           to={`/post/create`}
                           style={ isActive(history, `/post/create`) }

                       >
                           <i class="fa fa-plus" aria-hidden="true" style={{ color: "black" }}></i>
                           {"  "}Create Post
                       </Link>
                           
                   </li>

                    <li className="nav-item">
                       
                        <Link className="nav-link"
                            to={`/user/${isAuthenticated().user._id}`}
                            style={ isActive(history, `/user/${isAuthenticated().user._id }`) }

                        >
                            <i class="fa fa-user" aria-hidden="true" style={{ color: "#ff9900" }}></i>
                            <span style={{ fontWeight: "bold", color: "#ff9900"}}> 
                                {"  "}{`${isAuthenticated().user.name}`}
                            </span> 's profile
                        </Link>
                            
                    </li>

                    <li className="nav-item">
                        <span 
                            className="nav-link" 
                            style={isActive(history, '/signout')}
                            onClick={() => signout(() => history.push('/'))}
                        >
                            <i class="fa fa-sign-out" aria-hidden="true" style={{ color: "black" }}></i>
                            {"   "}Sign Out
                        </span>
                    </li>
                </>
            )}

        </ul>

    </div>
);



export default withRouter(Menu);