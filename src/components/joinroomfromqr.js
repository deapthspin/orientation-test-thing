import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Joinroomfromqr(props) {
    const roomId = useParams().id
    const [name, setName] = useState('')
    const [canJoin, setCanJoin] = useState(true)
    const navigate = useNavigate()
    const ws = useRef()
    const {setIsOwner, isOwner, setUsername} = props
    function nameChange(e) {
        
            setName(e.target.value)
        
    }

    useEffect(() => {
        ws.current = new WebSocket('wss://animalguessingws.onrender.com')
    }, [])

    async function joinGame(e) {
        e.preventDefault()
        if(name.trim()) {
            setUsername(name.trim())
            const res1 = await fetch(`https://animalguessingpg.onrender.com/playersinroom/${roomId}`)
            const data1 = await res1.json()
    
            // console.log(data1.players)
            if(!data1.players.includes(name)) {
                    setCanJoin(false)
                    console.log('sent')
                    const res = await fetch(`https://animalguessingpg.onrender.com/rooms/${roomId}`)
                    const data = await res.json()
        
                    let tempplayerArr = [...data.players]
                    
                   tempplayerArr.push(name)
                    console.log(tempplayerArr.toString())
                    await fetch(`https://animalguessingpg.onrender.com/roomplayers/${roomId}`, {
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
                            roomId: roomId,
                            username: name,
                            msgType: 'joinroom'
                        })
                    )
                    localStorage.setItem('isowner', 'no')
                    setIsOwner('no')
                    navigate(`/room/${roomId}`)
                
            }
    
        }
    }

    return (
        <div>
            <input onChange={nameChange}/>
            {canJoin && <button onClick={joinGame}>join</button>}
        </div>
    )
}

export default Joinroomfromqr