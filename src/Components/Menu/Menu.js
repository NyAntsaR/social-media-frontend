import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const isActive = (history, path) => {
    if (history.location.pathname === path) return { color: '#ff9900' };
    else return { color: '#ffffff' };
};

export const signout = (next) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem("jwt")
    }
    next();

    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err));
}

export const isAuthenticated = () => {
    if (typeof window == "undefined") {
        return false
    }

    if (localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    } else {
        return false;
    }
}

const Menu = ({ history }) => (
    <div>

        <ul className="nav nav-tabs bg-primary">

            <li className="nav-item">
                <Link className="nav-link" style={isActive(history, '/')} to="/">
                    Home
                </Link>
            </li>

            { !isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signin')} to="/signin">
                            Sign In
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" style={isActive(history, '/signup')} to="/signup">
                            Sign Up
                        </Link>
                    </li>
                </>
            )}

            { isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <a 
                            className="nav-link" 
                            style={isActive(history, '/signout')}
                            onClick={() => signout(() => history.push('/'))}
                        >
                            Sign Out
                        </a>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link"
                            to={`/user/{${isAuthenticated().user._id}'s profile}`} 
                            style={{ color:"#fff" }}
                        >
                            {`${isAuthenticated().user.name}'s profile`}
                        </Link>
                    </li>
                </>
            )}
        </ul>
    </div>
);



export default withRouter(Menu);