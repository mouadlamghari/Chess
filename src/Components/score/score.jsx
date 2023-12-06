import React from 'react'

const Score = ({score}) => {
  return (
    <div className='score'  >
        <h4>{score.state}</h4>
       { score.winnner && <p> <code className=' wining ' >{score.winnner}</code> Win </p>}
    </div>
  )
}

export default Score