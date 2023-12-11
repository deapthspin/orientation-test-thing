import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

function Joinroomfromqr() {
    const roomId = useParams().id
    const [name, setName] = useState('')

    function nameChange(e) {
        
            setName(e.target.value)
        
    }

    async function joinGame(e) {
        e.preventDefault()
        if(name.trim()) {
            const res1 = await fetch(`https://animalguessingpg.onrender.com/playersinroom/${inputId}`)
            const data1 = await res1.json()
    
            // console.log(data1.players)
            if(!data1.players.includes(inputName)) {
            
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
        <div>
            <input onChange={nameChange}/>
            <button>join</button>
        </div>
    )
}

export default Joinroomfromqr