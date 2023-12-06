import { useCallback, useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import Board from '../Components/Board/Board'
import Timer from '../Components/Timer/Timer'
import { BoardItems } from '../assets/Board'
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'


function PlayOnline() {

    const {id}=useParams()
    const socket = io('http://localhost:3000')
    const [count,setCount]=useState()

    useEffect(()=>{
        socket.on('connect',()=>{
            socket.emit('message',{event:'join',roomId:id})
        })
        socket.on('message',(message)=>{
          console.log({message})
          if(message.event==='board'){
            setBoard(JSON.parse(message.board))
          }
          if(message.current=='current'){
            setCurrent(message.current)
          }
          if(message.event=='room'){
            setCount(message.count)
          }
          if(message.event=='player'){
            console.log('t')
            setMy(message.player)
            console.log(message.player)
          }
        })
    },[])

    console.log(count)


    function play(to,selected){
      socket.emit('message',{event:'play',roomId:id,to,selected})
    }
    
  const [Current, setCurrent] = useState('w')
  const [My,setMy]=useState('w')
  const [board,setBoard]=useState(BoardItems)
  const [timer,setTimer]=useState({w:180,b:180});
  const [start,setStart]=useState(false)
  useEffect(()=>{
    if(My=='w'){
      setBoard(prev=>[...prev.reverse()])
    }
  },[])
  const time = (time)=>{
    let eq = time / 60
    const Min = String(Math.floor(eq))
    const Sec = String(Math.ceil((eq - Min) * 60)) 
    let t = ` ${Min.length==1?'0'+Min:Min} : ${Sec.length==1?'0'+Sec:Sec} ` 
    return t
  }
  console.log({board},My)
  const switchRole =(()=>setCurrent(prev=>prev=='w'?'b':'w'))
  return (
    <>
    <Timer current={"b"} time={time(timer.b)} />
     <Board play={play} board={board} setBoard={setBoard} play={play} start={start} setStart={()=>setStart(count==2)}  flip={false}  timer={timer} setTimer={setTimer} switchRole={()=>''} current={Current} my={My}  />
    <Timer current={"w"} time={time(timer.w)} />
    </>
  )
}

export default PlayOnline