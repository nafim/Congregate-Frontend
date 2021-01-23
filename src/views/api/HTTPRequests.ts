

export const getGameID = () => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + '/api/getUniqueGameID')
        .then(res => res.json())
        .catch(err => console.error(err))
    );
}

export const getAnonymousToken = () => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + '/api/getAnonymousToken')
        .then(res => res.json())
        .then(data => {
            if (data.error) throw Error(data.error);
            localStorage.setItem(process.env.REACT_APP_TOKEN_NAME!, data.token);
            return data.token;
        })
        .catch(err => console.error(err))
    );
}