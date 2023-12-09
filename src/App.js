import React, { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './components/homepage'
import Room from './components/room'

function App() {
  const [isOwner, setIsOwner] = useState(localStorage.getItem('isowner') ? localStorage.getItem('isowner') : "no")
  useEffect(() => {
    console.log(isOwner)
  }, [])
  return (
    <div>
      {/* <h1>routes be here</h1> */}
      <Routes>
        <Route path='/home' element={<Homepage isOwner={isOwner} setIsOwner={setIsOwner}/>}/>
        <Route path='/room/:roomid' element={<Room isOwner={isOwner} setIsOwner={setIsOwner}/>}/>
        <Route path='*' element={<Navigate to='/home'/>}/>
      </Routes>
    </div>
  )
}

export default App