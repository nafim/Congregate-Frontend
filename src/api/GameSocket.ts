import io from 'socket.io-client';
let socket: SocketIOClient.Socket;

//////////////////////////////////////////////////////
///////////////// Socket Connection //////////////////
//////////////////////////////////////////////////////

export const initiateSocket = (authToken: string, gameID?: string, cb?: () => void) => {
    socket = io(process.env.REACT_APP_API_BACKEND!, {
        query: gameID ? { gameID } : undefined,
        // @ts-ignore
        auth: {
            token: authToken
        }
    });
    if (cb) {
        socket.on('connect', cb);
    }
    socket.on('connect_error', (err: any) => {
        console.log(err.message);
    });
    console.log('Connecting to socket...');
    socket.on('disconnect', () => {
        console.log('Disconnecting socket...');
    })
}

export const isSocketConnected = () => {
    if (socket) return socket.connected;
    return false;
}

export const disconnectSocket = () => {
    if (socket) socket.disconnect();
}

export interface PlayerConnectionData {
    player: string // player username
}

// event emitted when another player connects to the game
export const subscribeToPlayerConnect = (cb: (data: PlayerConnectionData) => void, once?: boolean) => {
    if (!socket) return false;
    if (once) {
        socket.once('playerConnected', cb);
    } else {
        socket.on('playerConnected', cb);
    }
    return true;
}

// event emitted when another player connects to the game
export const subscribeToPlayerDisconnect = (cb: (data: PlayerConnectionData) => void, once?: boolean) => {
    if (!socket) return false;
    if (once) {
        socket.once('playerDisconnected', cb);
    } else {
        socket.on('playerDisconnected', cb);
    }
    return true;
}

//////////////////////////////////////////////////////
///////////////// Game communication /////////////////
//////////////////////////////////////////////////////

export interface GamePosition {
    lat: number;
    lng: number;
}

export interface GameUpdateData {
    pos: GamePosition;
}

export enum GameStatus {
    InLobby = "InLobby", // when waiting for other player
    Starting = "Starting", // game is starting in 3 seconds
    InProgress = "InProgress", // game in progress
    Win = "Win", // players found each other
    Loss = "Loss", // players ran out of time
}

interface PlayerData {
    username: string;
    pos: GamePosition | undefined;
}

// game status data object definition
export interface GameStatusData {
    status: GameStatus
    timeRemaining: number // in seconds
    score: number // cumulative score after each game
    players: PlayerData[]
}

// when successfully matched in random game, this event is sent
export interface MatchSuccessData {
    gameID: string
}

export interface CurrentPlayersData {
    players: string[] // list of player usernames
}

// emit ready status
export const sendPlayerReady = () => {
    if (socket) socket.emit('playerReady');
}

// emit updated game info
export const sendGameUpdate = (gameUpdateData: GameUpdateData) => {
    if (socket) socket.emit('gameUpdate', gameUpdateData);
}

// on game start an initial position will be given
export const subscribeToInitialPosition = (cb: (data: GameUpdateData) => void, once?: boolean) => {
    if (!socket) return false;
    if (once) {
        socket.once('initialPosition', cb);
    } else {
        socket.on('initialPosition', cb);
    }
    return true;
}

// requeset a game status
export const requestGameStatus = () => {
    if (socket) socket.emit(`requestGameStatus`);
}

// Subscribe to game status updates
export const subscribeToGameStatus = (cb: (data: GameStatusData) => void, once?: boolean) => {
    if (!socket) return false;
    if (once) {
        socket.once('gameStatus', cb);
    } else {
        socket.on('gameStatus', cb);
    }
    return true;
}

// Subscribe to successful random matching event
export const subscribeToMatchSuccess = (cb: (data: MatchSuccessData) => void, once?: boolean) => {
    if (!socket) return false;
    if (once) {
        socket.once('matchSuccess', cb);
    } else {
        socket.on('matchSuccess', cb);
    }
    return true;
}

// request a current players in the game
export const requestCurrentPlayers = () => {
    if (socket) socket.emit(`currentPlayers`);
}

// Subscribe to current players in the game event
export const subscribeToCurrentPlayers = (cb: (data: CurrentPlayersData) => void, once?: boolean) => {
    if (!socket) return false;
    if (once) {
        socket.once('currentPlayers', cb);
    } else {
        socket.on('currentPlayers', cb);
    }
    return true;
}

//////////////////////////////////////////////////////
///////////////// Chat communication /////////////////
//////////////////////////////////////////////////////

// message data object definition
export interface MessageEventData {
    text: string
    name: string
    timestamp: number // milliseconds since Unix epoch
}

// emit message data
export const sendMessage = (username:string, messageText: string) => {
    const messageData: MessageEventData = {
        text: messageText,
        name: username,
        timestamp: Date.now()
    };
    if (socket) socket.emit('message', messageData);
}

// receiving messages from other userss
export const subscribeToMessage = (cb: (data: MessageEventData) => void, once?: boolean) => {
    if (!socket) return false;
    if (once) {
        socket.once('message', cb);
    } else {
        socket.on('message', cb);
    }
    return true;
}

//////////////////////////////////////////////////////
/////////////////// Error Handling ///////////////////
//////////////////////////////////////////////////////


export interface ErrorData {
    message: string,
}

  // Subscribe to socket middleware (ex: authentication) errors
export const subscribeToConnectErrors = (cb: (data: ErrorData) => void, once?: boolean) => {
    if (!socket) return false;
    // handle authentication error
    if (once) {
        socket.once('connect_error', cb);
    } else {
        socket.on('connect_error', cb);
    }
}

  // Subscribe to socket connection errors
export const subscribeToErrors = (cb: (error: Error) => void, once?: boolean) => {
    if (!socket) return false;
    // handle connection errors
    if (once) {
        socket.once('error', cb);
    } else {
        socket.on('error', cb);
    }
}



