import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './room.css'
import Guessing from './guessing'

function Room(props) {
    const roomId = useParams().roomid
    const [players, setPlayers] = useState([])
    const ws = useRef()
    const navigate = useNavigate()
    const {isOwner, setIsOwner, setUsername, username} = props
    const [gameStarted, setGameStarted] = useState(false)

    async function getData() {
        const res = await fetch(`https://animalguessingpg.onrender.com/rooms/${roomId}`)
        const data = await res.json()

        setPlayers(data.players)
        // console.log(players)
    }

    async function addPlayer(name) {
        console.log(players)
        // await fetch(`https://animalguessingpg.onrender.com/roomplayers/${roomId}`, {
        //     method: "PATCH",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         playerArr: players
        //     })
        // })
    }

    useEffect(() => { // WS
        ws.current = new WebSocket('wss://animalguessingws.onrender.com')
        // console.log('k')
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            
            if(data.roomId === roomId && data.msgType === 'joinroom') {
                // addPlayer(data.username)

                getData()
            } else if(data.roomId === roomId && data.msgType === 'startgame') {
                // console.log('game started')
                setGameStarted(true)
            } else if(data.roomId === roomId && data.msgType === 'closeroom') {
                // console.log('game started')
                navigate('/home')
                // window.alert('room has closed')
            }
        }
    }, [])

    useEffect(() => { // data stuff
        getData()

        // console.log(isOwner.current)
    }, [])

    function closeRoom(e) {
        e.preventDefault()
        fetch(`https://animalguessingpg.onrender.com/rooms/${roomId}`, {
            method: "DELETE"
        })
        localStorage.setItem('isowner', 'no')
        setIsOwner('no')
        navigate('/home')

        ws.current.send(JSON.stringify({
            roomId: roomId,
            msgType: 'closeroom'
        }))
    }

    function startGame(e) {
        e.preventDefault()
        if(players.length > 1) {
            ws.current.send(JSON.stringify({
                roomId: roomId,
                msgType: 'startgame'
            }))            
        }

    }

    return (
        <div>
            {!gameStarted && <div>
                {players.length && <div>
                    <h1>welcome to the room</h1>
                    {isOwner === 'yes' && <h1>you are the owner of the room</h1>}
                    <h2>room-{roomId}</h2>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://jacobsiew.dev/qrjoin/${roomId}`}/>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://animalguessing.onrender.com/qrjoin/${roomId}`}/>
                    <br/>
                    <br/>
                    {isOwner === 'yes' && <button onClick={closeRoom}>close room</button>}
                    {isOwner === 'yes' && <button onClick={startGame}>start game</button>}
                    <div className='players'>
                        {players.map((player) => (
                            <div className='player'>
                                <h2>{player}</h2>
                            </div>
                        ))}
                    </div>
                </div>}
                
                {!players.length && <h1>this room does not exist</h1>}
            </div>}
           {gameStarted && <div>
                <Guessing username={username} playernum={players.length - 1} playerlist={players.slice(0)} roomId={roomId} isowner={isOwner} playername={username}/>
            </div>}
        </div>
    )
}

export default Room