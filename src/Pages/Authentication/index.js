export const authenticate = (jwt, next) => {
    // check if window is not undefined
    if (typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(jwt));
    } next();
};

export const socialLogin = user => {
    return fetch(`${process.env.REACT_APP_API_URL}/social-login/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
        .then(response => {
            console.log('signin response: ', response);
            return response.json();
        })
        .catch(err => console.log(err));
};