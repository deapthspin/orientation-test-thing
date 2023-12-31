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
    const [cards, setCards] = useState([])
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

    function getCards() {
        const wcardsArray = [{text: 'white 1', colour: 'white'},{text: 'white 2', colour: 'white'},{text: 'white 3', colour: 'white'},{text: 'white 4', colour: 'white'},{text: 'white 5', colour: 'white'},{text: 'white 6', colour: 'white'},]
        const bcardsArray = [{text: 'black 1', colour: 'black'},{text: 'black 2', colour: 'black'},{text: 'black 3', colour: 'black'},{text: 'black 4', colour: 'black'},{text: 'black 5', colour: 'black'},{text: 'black 6', colour: 'black'},]

        const chosen = []

        while(chosen.length < 3) {
            let temp = wcardsArray[Math.floor(Math.random() * (wcardsArray.length))]
            if(!chosen.includes(temp)) {
                chosen.push(temp)
            }
        }
        while(chosen.length < 6) {
            let temp = bcardsArray[Math.floor(Math.random() * (wcardsArray.length))]
            if(!chosen.includes(temp)) {
                chosen.push(temp)
            }
        }

        console.log(chosen)
        setCards(chosen)
    }

    useEffect(() => {
        getCards()
    }, [])

    return (
        <div className='app'>
            {!gameStarted && <div>
                {<div>
                    {/* <h1>welcome to the room</h1> */}
                    {isOwner === 'yes' && <h1>you are the owner of the room</h1>}
                    <h2>room-{roomId}</h2>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://jacobsiew.dev/qrjoin/${roomId}`}/>
                    {/* <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://animalguessing.onrender.com/qrjoin/${roomId}`}/> */}
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
                {isOwner === 'no' && <div className='cards'>
                    {cards.map((card) => (
                        <div className={`card-${card.colour}`}>
                            <h1>{card.text}</h1>
                            {/* <h1>{card.colour}</h1> */}
                        </div>
                    ))}
                </div>}
                {/* {!players.length && <h1>this room does not exist</h1>} */}
            </div>}
           {gameStarted && <div>
                <Guessing cards={cards} setCards={setCards} username={username} playernum={players.length - 1} playerlist={players.slice(1)} roomId={roomId} isowner={isOwner} playername={username}/>
            </div>}
        </div>
    )
}

export default Room