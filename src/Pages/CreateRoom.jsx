import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const CreateRoom = () => {
    const [socket,setSocket]=useState()
    const [channel,setChannel]=useState();

    console.log({socket})
    useEffect(()=>{
        const socket = io('http://localhost:3000')
        socket.on('message',(msg)=>{
            switch(msg.event){
                case 'receive':
                    setChannel(msg.channel)
                }

        })

        
        setSocket(socket)
    },[])
    function sendMessage(){
        socket.emit('message',{event:'create'})
    }
  return (
    <div className=' createRoom ' >
        
        <button onClick={()=>sendMessage()} style={{margin:'auto' , marginBottom:'20px'}} >Create Room</button>
        {channel&& 
        <div  className='clipboard'  >
            <input value={channel} readOnly type="text" />
            <button onClick={()=>navigator.clipboard.writeText('http://localhost:5173/game/'+channel)}  >Copy Channel</button>
        </div>
        }
    </div>
  )
}

export default CreateRoom