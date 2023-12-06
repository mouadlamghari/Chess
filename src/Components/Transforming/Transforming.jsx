import React from 'react'
import ItemTransforming from './ItemTransforming'
import './transforming.css'
const Transforming = ({current,switchItem}) => {
    const items = [
        {item:`${current}q`,type:current},
        {item:`${current}b`,type:current},
        {item:`${current}n`,type:current},
       {item:`${current}r`,type:current},
    ]
  return (
    <div className=' transforming ' >
        {items.map((e,i)=><ItemTransforming handel={switchItem} key={i} item={e} />)}
    </div>
  )
}

export default Transforming