

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
            if (data.error) return data;
            localStorage.setItem(process.env.REACT_APP_TOKEN_NAME!, data.token);
            return data;
        })
        .catch(err => console.error(err))
    );
}

export const getUserToken = (username: string, key: string) => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + `/api/user/token?key=${key}&username=${username}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) return data;
            localStorage.setItem(process.env.REACT_APP_TOKEN_NAME!, data.token);
            return data.token;
        })
        .catch(err => console.error(err))
    );
}

export const sendLoginEmail = (email: string) => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + '/api/user/sendLoginEmail', {
            method: "POST",
            headers: {
            "Content-Type": 'application/json', 
            },
            body: JSON.stringify ({
                email,
                callbackUrl: `http://${process.env.REACT_APP_WEBSITE_DOMAIN}/verify`
            }),
        })
        .then(res => res.json())
    );
}

export enum Role {
    Anonymous='anonymous',
    Normal='normal',
    Admin='admin'
}

export interface JWTPayload {
    sub: string;
    name: string;
    role: Role;
    iat: number;
    aud: string;
}