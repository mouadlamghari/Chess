import React from 'react'
import { Link } from 'react-router-dom'

const Chose = () => {
  return (
    <div  className='items' >
        <Link to={'/playWithFriend'} className=' item-opt ' >
            <img src="/Images/friend.png" alt="" />
            <span>Play with friend</span>
        </Link>
        <Link to={'/'} className=' item-opt ' >
            <img src="/Images/online.png" alt="" />
            <span style={{width:'min-width'}} >Play Online  </span>
            <span>(comming soon)</span>
        </Link>
    </div>
  )
}

export default Chose