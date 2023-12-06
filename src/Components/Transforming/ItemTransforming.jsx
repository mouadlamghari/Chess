import React from 'react'

const ItemTransforming = ({item,handel}) => {
  return (
    <div onClick={()=>handel(item)} className=' item ' >
        <img src={`/Images/${item.item}.png`} alt="" />
    </div>
  )
}

export default ItemTransforming