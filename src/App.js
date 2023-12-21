import React, { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './components/homepage'
import Room from './components/room'
import Joinroomfromqr from './components/joinroomfromqr'

function App() {
  const [isOwner, setIsOwner] = useState(localStorage.getItem('isowner') ? localStorage.getItem('isowner') : "no")
  const [username, setUsername] = useState('')
  useEffect(() => {
    console.log(isOwner)
  }, [])
  return (
    <div className='App'>
      {/* <h1>routes be here</h1> */}
      <Routes>
        <Route path='/home' element={<Homepage isOwner={isOwner} setIsOwner={setIsOwner} setUsername={setUsername}/>}/>
        <Route path='/room/:roomid' element={<Room isOwner={isOwner} setIsOwner={setIsOwner} setUsername={setUsername} username={username}/>}/>
        <Route path='/qrjoin/:id' element={<Joinroomfromqr isOwner={isOwner} setIsOwner={setIsOwner} setUsername={setUsername}/>}/>
        <Route path='*' element={<Navigate to='/home'/>}/>
      </Routes>
    </div>
  )
}

export default App