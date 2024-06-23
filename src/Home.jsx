import React from 'react'
import { Route, Routes } from 'react-router-dom'
import PlayWithFriend from './Pages/PlayWithFriend'
import Chose from './Pages/Chose'


const Home = () => {
  console.log('rendred')
  return (
    <div>
      MOUAD LAMGHARI
      <Chose/>
    <Routes>
        <Route path='/' element={<Chose/>} />
        <Route path='/playWithFriend' element={<PlayWithFriend/>} />
    </Routes>
    </div>
  )
}

export default Home
