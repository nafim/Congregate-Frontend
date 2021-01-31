

export const getGameID = () => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + '/api/getUniqueGameID')
        .then(res => res.json())
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
    );
}

export const getUserToken = (key: string) => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + `/api/user/token?key=${key}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) return data;
            if (data.token) {
                localStorage.setItem(process.env.REACT_APP_TOKEN_NAME!, data.token);
            }
            return data;
        })
    );
}

export const register = (username: string, key: string) => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + `/api/user/token?key=${key}&username=${username}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) return data;
            if (data.token) {
                localStorage.setItem(process.env.REACT_APP_TOKEN_NAME!, data.token);
            }
            return data;
        })
    );
}

export const getUserInfo = () => {
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
    return (
        fetch(process.env.REACT_APP_API_BACKEND + `/api/user/userInfo`, {
            method: "GET",
            headers: {
            "Content-Type": 'application/json', 
            'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
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