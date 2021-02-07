import jwt_decode from 'jwt-decode';

export const getGameID = (city: string) => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + `/api/getUniqueGameID?city=${city}`)
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
    exp: number;
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

export const grabAndVerifyToken = () => {
    return (
    new Promise(function(resolve: (value: string) => void, reject) {
        const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);

        // check the existence of token by trying decode
        let decoded: JWTPayload | undefined;
        try {
            decoded = jwt_decode<JWTPayload>(token!);
        } catch {
            decoded = undefined;
        }

        // if a token already exists, check for expiration
        if (decoded) {
            // check existing token is expired or not within margin of secondsBeforeExpire
            const now = Date.now().valueOf() / 1000;
            const secondsBeforeExpire = 1800;
            // if expiring soon, get new anonymous token
            if (decoded.exp - now < secondsBeforeExpire) {
                getAnonymousToken()
                .then(data => {
                    if (data.error) reject(new Error("Anon Token Error"));
                    if (data.token) resolve(data.token);
                })
                .catch( error => {
                    reject(new Error("Anon Token Error"));
                })
            // if not expiring soon
            } else {
                resolve(token!);
            }
        // if no token exists, grab an anonymous token
        } else {
            getAnonymousToken()
            .then(data => {
                if (data.error) reject(new Error("Anon Token Error"));
                if (data.token) resolve(data.token);
            })
            .catch( error => {
                reject(new Error("Anon Token Error"));
            })
        }
    })
    );
}

export const register = (username: string, key: string) => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + `/api/user/register?key=${key}&username=${username}`)
        .then(res => res.json())
        .then(data => {
            if (data.errors) return data;
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
        .then(data => {
            if (data.error) return data;
            if (data.token) localStorage.setItem(process.env.REACT_APP_TOKEN_NAME!, data.token);
            return data;
        })
    );
}

export const postChangeUsername = (newUsername: string) => {
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_NAME!);
    return (
        fetch(process.env.REACT_APP_API_BACKEND + `/api/user/userInfo`, {
            method: "POST",
            headers: {
            "Content-Type": 'application/json', 
            'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify ({
                username: newUsername
            }),
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
                callbackUrl: `https://${process.env.REACT_APP_WEBSITE_DOMAIN}/verify`
            }),
        })
        .then(res => res.json())
    );
}


//////////////////////////////////////////////////////
//////////////// Leaderboard requests ////////////////
//////////////////////////////////////////////////////

export interface AvgEntry {
    username: string;
    avgScore: number;
}

export interface MaxEntry {
    username: string;
    maxScore: number;
}

export const getLeaderboard = () => {
    return (
        fetch(process.env.REACT_APP_API_BACKEND + '/api/game/leaderboard')
        .then(res => res.json())
    );
}