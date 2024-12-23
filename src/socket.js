import io from "socket.io-client";

let socket;

const connectSocket = (user_id) => {
    socket = io("http://localhost:3000", {
        query: `user_id=${user_id}`,
        // reconnection: true,
        // reconnectionDelay: 1000,
        // reconnectionAttempts: Infinity
    })
}


//

export { socket, connectSocket };