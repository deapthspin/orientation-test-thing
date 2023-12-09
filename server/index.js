const WebSocket = require('ws')

const server = new WebSocket.Server({
    port: 4200
}, () => {
    console.log('server started at port 4200')
})

const users = new Set()

const sendEnterRoom = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

const sendStartGame = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

const sendQnDone = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

const sendCloseRoom = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}

const sendQuestion = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message))
    })
}


server.on('connection', (ws) => {
    const userRef = {
        ws,
    }

    users.add(userRef)

    ws.on('message', (message) => {
        const data = JSON.parse(message)
        console.log(data)
        if(data.msgType === 'joinroom') {
            try {
                console.log(`${data.username} has connected to room-${data.roomId}`)
                sendEnterRoom({
                    roomId: data.roomId,
                    username: data.username,
                    msgType: data.msgType
                })
            } catch(err) {
                console.error(err)
            }
        } else if(data.msgType === 'startgame') {
            try {
                console.log(`${data.username} has connected to room-${data.roomId}`)
                sendStartGame({
                    roomId: data.roomId,
                    msgType: data.msgType
                })
            } catch(err) {
                console.error(err)
            }
        } else if(data.msgType === 'qndone') {
            try {
                console.log(`${data.username} has connected to room-${data.roomId}`)
                sendQnDone({
                    roomId: data.roomId,
                    msgType: data.msgType,
                    numComplete: data.numComplete,
                })
            } catch(err) {
                console.error(err)
            }
        } else if(data.msgType === 'closeroom') {
            try {
                console.log(`${data.username} has connected to room-${data.roomId}`)
                sendCloseRoom({
                    roomId: data.roomId,
                    msgType: data.msgType,
                })
            } catch(err) {
                console.error(err)
            }
        } else if(data.msgType === 'questiondata') {
            try {
                console.log(`${data.username} has connected to room-${data.roomId}`)
                sendCloseRoom({
                    roomId: data.roomId,
                    msgType: data.msgType,
                    img: data.img,
                    options: data.options
                })
            } catch(err) {
                console.error(err)
            }
        } 
        
    })
})