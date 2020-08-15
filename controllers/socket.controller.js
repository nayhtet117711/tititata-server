
module.exports.connect = () => {

}

module.exports.disconnect = () => {

}

module.exports.sendMessage = () => {

}

module.exports.onConnect = () => {
    const { socketIo } = require("../app")
    const connectedClients = require("../data/socket-client.data").clients

    socketIo.on("connection", socket => {
        // console.log(socket.id, " is connected.")

        socket.on("msg-hello", data => {
            console.log("received: ", data)
        })

        socket.on("enter-user", data => {
            if(connectedClients.find(v => v.username===data.username)) {
                socket.emit("enter-user-reject", {...data, reason: "Requested username already joined! Please choose another Nickname!"})
            } else {
                console.log(data.username, " is connected.")
                connectedClients.push({ 
                    socketId: socket.id, 
                    username: data.username,
                    socket: socket,
                    propic: data.propic
                })
                console.log("connectedClients: ", connectedClients.map(v => ({ socketId: v.socketId, username: v.username })))
                socket.emit("enter-user", data)
            }
        })
        // console.log("socketIo: ", ObsocketIo.eio.clients)
        socket.on("message-send", data => {    
            connectedClients.forEach(v => {
                v.socket.emit("message-send", data)
            })
            
        })

        // socket.emit("msg-hello", "Helloooo world 2")

        this.onDisconnect(socket, connectedClients)
    })

    // socketIo.on("msg-hello", data => {
    //     console.log("received: ", data)
    // })

    
}

module.exports.onDisconnect = (socket, connectedClients) => {
    socket.on("disconnect", () => {
        const clientIndex = connectedClients.findIndex(v => v.socketId===socket.id)
        if(clientIndex>=0) {
            console.log(connectedClients[clientIndex].username, " is disconnected!")
            connectedClients.splice(clientIndex, 1)
        } else {
            console.log("WARNN: No client found with requested socket Id: ", socket.id)
        }

    })
}

this.onConnect()