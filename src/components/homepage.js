import React, { useEffect, useRef, useState } from 'react'
import './homepage.css'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
function Homepage(props) {
    const navigate = useNavigate()
    const ws = useRef()
    // const [createName, setCreateName] = useState('')
    const [inputId, setInputId] = useState('')
    const [inputName, setInputName] = useState('')
    const {isOwner, setIsOwner, setUsername} = props
    useEffect(() => {
        ws.current = new WebSocket('wss://animalguessingws.onrender.com')
        ws.onopen = (e) => {
            console.log('connected to ws!!!')
        }
    }, [])

    async function createRoom(e) {
        e.preventDefault()
        // console.log('aa')
        const roomid = uuid()
        if(inputName.trim()) {

            await fetch('https://animalguessingpg.onrender.com/rooms', {
                method: "POST",
                body: JSON.stringify({
                    roomId: roomid,
                    players: [`${inputName}`],
                    roomOwner: inputName
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            localStorage.setItem('isowner', 'yes')
            setIsOwner('yes')
            navigate(`/room/${roomid}`)
            
        }

    }

    async function joinRoom(e) {
        e.preventDefault()

        const res1 = await fetch(`https://animalguessingpg.onrender.com/playersinroom/${inputId}`)
        const data1 = await res1.json()

        // console.log(data1.players)
        if(!data1.players.includes(inputName)) {
            if (inputId.trim() && inputName.trim()) {
                setUsername(inputName.trim())

                console.log('sent')
                const res = await fetch(`https://animalguessingpg.onrender.com/rooms/${inputId}`)
                const data = await res.json()
    
                let tempplayerArr = [...data.players]
                
               tempplayerArr.push(inputName)
                console.log(tempplayerArr.toString())
                await fetch(`https://animalguessingpg.onrender.com/roomplayers/${inputId}`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        playerArr: tempplayerArr
                    })
                })
    
                ws.current.send(
                    JSON.stringify({
                        roomId: inputId,
                        username: inputName,
                        msgType: 'joinroom'
                    })
                )
                
                navigate(`/room/${inputId}`)
            }
        }

        
        
    }

    return (
        <div className='main'>
            <h1>homepage</h1>
            <form>
                <input placeholder='your username' onChange={(e) => setInputName(e.target.value)}/>                <br/>
                <br/>
                <button className='create-room' onClick={createRoom}>create room</button>
            </form>
            <h1>or</h1>
            <h2>join a room</h2>
            <input placeholder='room code' onChange={(e) => setInputId(e.target.value)}/>
            <br/>
            <button className='joinbutton' onClick={joinRoom}>join</button>
        </div>
    )
}

export default Homepage