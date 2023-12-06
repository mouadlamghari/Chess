import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'





const Box = ({role,color,index,handelClick,isPossible,i,KingInDanger,castling,row}) => {

  let num = '12345678'.split('').reverse().join('')
  let alph = 'abcdefgh'

const [dragging,setDragging]=useState(null)

  const drag = (e)=>{
    const {id} = e.target.closest('.Box')
    console.log({id},'drag')
    e.dataTransfer.setData('text/plain',id);
    handelClick(id)
    setDragging(true)
  }
  
  const dragOver=(e)=>{
    e.preventDefault()
    setDragging(false)
  }
  
  const drop = (e)=>{
    e.preventDefault()
   let {id} =  e.target.closest('.Box');
   console.log({id},'drop')
  handelClick(id)
  }
  


  let item = <span className='num' >{i%8==0 ? num[i/8]  : '' }</span>
  let alphItem = <span className='alph' >{i/7>=8 ? alph[i%8]  : '' }</span>



  return (
    <div   onDragStart={drag} onDrop={drop} onDragOver={dragOver} onClick={(e)=>handelClick(e.target.closest('.Box').id)}  id={index} style={{position:'relative',background:color?'#779455':'#ebebd0'}}   className={`  ${dragging?'dragging':''}  ${KingInDanger==index?'KingDanger':''}   ${isPossible  ?  role ? 'possibleHint' : 'possible': '' }  Box ${color? 'White':'Green'}  `} >
      {role 
      &&
        role!='pb' &&
      <img  draggable={role && true} src={'/Images/'+role+'.png'} className='' />
      }
      {item}
      {/* <span style={{position:'absolute',color:'#333'}} >{index}</span> */}
      {alphItem}
      {castling.includes(index) &&
      <span className='castling' ></span>
      }
    </div>
  )
}

export default Box