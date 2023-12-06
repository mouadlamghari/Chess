import React from 'react'
import './start.css'
const Start = ({click}) => {
  return (
    <div className='start' >
        <button onClick={click} >Start Game </button>
    </div>
  )
}

export default Start