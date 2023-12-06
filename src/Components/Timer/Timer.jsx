import React from 'react'

const Timer = ({current,time}) => {
    

  return (
    <div className={`  timer  `} >
       <span className={` kingTimer ${current} `} >
        <img src={` /Images/${current}k.png `} alt="" />  
      </span> 
       <span className={`${current=='w' ? 'TimeWhite' : 'TimeGreen' } `} >{time}</span> 
    </div>
  )
}

export default Timer