import { useCallback, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'
import Board from '../Components/Board/Board'
import Timer from '../Components/Timer/Timer'
import { BoardItems } from '../assets/Board'


function PlayWithFriend() {
  const [Current, setCurrent] = useState('w')
  const [My,setMy]=useState('w')
  const [timer,setTimer]=useState({w:180,b:180});
  const [start,setStart]=useState(false)
  const time = (time)=>{
    let eq = time / 60
    const Min = String(Math.floor(eq))
    const Sec = String(Math.ceil((eq - Min) * 60)) 
    let t = ` ${Min.length==1?'0'+Min:Min} : ${Sec.length==1?'0'+Sec:Sec} ` 
    return t
  }
  const switchRole =(()=>setCurrent(prev=>prev=='w'?'b':'w'))
  return (
    <>
    <Timer current={"b"} time={time(timer.b)} />
     <Board  start={start} setStart={()=>setStart(true)}  flip={Current!=My} BoardItems={BoardItems} timer={timer} setTimer={setTimer} switchRole={switchRole} current={Current} my={My}  />
    <Timer current={"w"} time={time(timer.w)} />
    </>
  )
}

export default PlayWithFriend