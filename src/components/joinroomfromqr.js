import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Joinroomfromqr() {
    const roomId = useParams().id
    const [name, setName] = useState('')
    const navigate = useNavigate()
    function nameChange(e) {
        
            setName(e.target.value)
        
    }

    async function joinGame(e) {
        e.preventDefault()
        if(name.trim()) {
            const res1 = await fetch(`https://animalguessingpg.onrender.com/playersinroom/${roomId}`)
            const data1 = await res1.json()
    
            // console.log(data1.players)
            if(!data1.players.includes(name)) {
            
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
        
                    // ws.current.send(
                    //     JSON.stringify({
                    //         roomId: roomId,
                    //         username: name,
                    //         msgType: 'joinroom'
                    //     })
                    // )
                    
                    navigate(`/room/${roomId}`)
                
            }
    
        }
    }

    return (
        <div>
            <input onChange={nameChange}/>
            <button onClick={joinGame}>join</button>
        </div>
    )
}

export default Joinroomfromqr