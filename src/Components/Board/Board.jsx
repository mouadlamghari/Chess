import React, { useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import './Board.css'
import audioMove from '/Sounds/Move.mp3'
import EatAudio from '/Sounds/Eat.mp3'
import CastleAudio from '/Sounds/castle.mp3'
import start from '/Sounds/start.mp3'
import Box from './Box'
import Transforming from '../Transforming/Transforming';
import Score from '../score/score';
import Start from '../Start/Start';
const Board = ({current,my,switchRole,flip,timer,setTimer,BoardItems,start,setStart}) => {


  const [board,setBoard]=useState([])

  // sounds 
  const Move = useRef();
  const Eat = useRef();
  const castle = useRef();
  const startGame = useRef();




  // score variables
  let draw  = {state:'draw'}
  let ww  = {state:'CHECK',winnner:'w'}
  let bw  = {state:'CHECK',winnner:'b'}


  // danger cells

  const [dangers,setDangers]=useState([])

  // your  moves

  const [Yourmoves,setMoves]=useState([]);

  // state to track king in danger
  
  const [KingInDanger,setKingDanger]=useState()
  
  // score = draw / win
  const [score,setScore]=useState(null);

  // state to track if you have a pne could be devlopped
  const [transforming,setTransforming]=useState(false)

  // set possible castling cells
  const [castling,setKastling]=useState([])  
 


  // state to track the moves
  let [Traking,setTraking]=useState({'w':[],'b':[]})

  // the possible bypass
  let [byPass,setBypass]=useState(null)


  // possibles ceels to move

  const [possible,setPossible]=useState([]);


  // selcted item in Board

  const [selected,setSelected]=useState(null)

  // check if the current role to play is yours

  let index = useMemo(()=>current == my && my=='w' ,[current,my])

  
  
  // set To index to keep watching if user click on pb 
  
  const [to,setTo]=useState(null)
  
    
  // reverse the board
  
  let reversedBoard = useMemo(()=>{
   //  
    return [...board].reverse()
  },[board])
  
  // color cells

  const colorRef = useRef(false);


  // logic of handling clicking in a box

  function handelClick(id){
    // id of cell
    id = Number(id);
    // check if the cell in possible moves
    let currentCell =  possible.includes(id) ? {type:'pb'} :  board[id] ;

    // if you dblclick a  cell it   deselcted 
    if(id==selected) {
     clear()
      return
    }

    // if you click in cell that not yours or the cell is empty 
    if(!currentCell || (currentCell?.type!=(current) && currentCell.type!='pb' )   ) return ''

    // list of possible moves for an item 
    let moves = [];

    // we get the item from the current player possible moves
    let move = Yourmoves.find(e=>e.id==id)

    // swith the cell item
    switch (currentCell.item) {
        case 'bk':
        case 'wk':
          // add castling to moves
          setKastling(move.castling)
        case 'wp':
        case 'bp':
          // add by pass to moves
          if(move.bypass){
            setBypass(move.bypass)
          }
        case 'wq' :
        case 'bq' :
        case 'wb' :
        case 'bb' : 
        case 'wr':
        case 'br':  
        case 'bn':
        case 'wn':
        // set list of Moves 
        moves = move.moves
        // set selected id cell
        setSelected(id);
        break;
            
        default:
          // if the cell is possibe move setTo id 
          setTo(id);
            // 
    }

    // set possible moves 
    setPossible(prev=>moves.length>0 ? moves : prev);

}


// 


//  check castling possibility 
const checkCastlingPossiblility=useCallback(function (board,current,Traking){

  
  // check if traking does not include the rooks and the king 
  let movedRookR = Traking[current].find(({item})=> item?.spec == board[0]?.spec)
  let movedRookL = Traking[current].find(({item})=> item?.spec == board[7]?.spec)
  let movedKing = Traking[current].find(({item})=> item?.item == current+'k')
 
 

  let rightcells = [board[1],board[2]]
  let leftcells = [board[4],board[5],board[6]]
  // if the king us Black we add cell 3 to cell 
  if(current=='b'){
    rightcells.push(board[3])
  }
  // if the king us Black we remove cell 4 from left 
  if(current=='b'){
    leftcells = [board[5],board[6]]
  }
  
  
  
  // we check if the king right cells are empty 
  let checkEmptyRight = rightcells.every((e)=>!e);
  // we check if the king left cells are empty 
  let checkEmptyLeft = leftcells.every((e)=>!e);
 // 

  // 
  // 

  // we return the left castling is poosible if the king and left rook does not move and left cells are empty
  // we return the left castling is poosible if the king and right rook does not move and right cells are empty

  return {Rr:!movedRookR && !movedKing?.item && checkEmptyRight, Rl:!movedKing?.item && !movedRookL && checkEmptyLeft }

},[])


/*
@param moves [] list of moves
@param item wk,wq,wp,bp,bq,... an item from the board
*/
function checkKingSafty(moves,item,id){
  // 
  let p = []

  moves.forEach((ItemMove)=>{
   //  
    let Newboard =  board.map((e,i)=>{
      if(i==id) return undefined;
      return ItemMove==i?{type:current,item}:e
    })

    let Newdangers = GetAllAdvansairPoosible(Newboard,current).flat(Infinity)
   //  
   // 
   //  
    if(isInDanger(Newdangers,Newboard)==null) p.push(ItemMove);
  })
  return p
}

const  castleLogic=(dangers,board,current,Traking)=>{
  
  let {Rl} = checkCastlingPossiblility(board,current,Traking);
  let {Rr} = checkCastlingPossiblility(board,current,Traking);
  
  let y= Rl && !dangers.includes(current=='b'?6:5) ? current=='b'?6:5:null
  let x = Rr && !dangers.includes(current=='b'?2:1) ? current=='b'?2:1:null
  
  return [y,x]
}

const getKeenPossible=useCallback((id,board,current,DangerCells,Traking)=>{

    const moves = []; 

    DangerCells=DangerCells.flat(Infinity).sort()
    
     
    if(id>7 && !DangerCells.includes(id-8)  ){
      if(board[id-8]?.type!==current) moves.push(id-8)
    }

    if(id>7 && id%8!=7 && !DangerCells.includes(id-7) ){
      if(board[id-7]?.type!==current) moves.push(id-7)
    }

    if(id>7 && id%8!=0 && !DangerCells.includes(id-9) ){
      if(board[id-9]?.type!==current) moves.push(id-9)
    }

    if(id%8!=7 && !DangerCells.includes(id+1)){
      if(board[id+1]?.type!==current) moves.push(id+1)
    }

    if(id%8!=0 && !DangerCells.includes(id-1)){
      if(board[id-1]?.type!==current) moves.push(id-1)
    }


    if(id<56 && !DangerCells.includes(id+8)){
      // 
      if(board[id+8]?.type!==current)  moves.push(id+8)
    }

    if(id<56 && id%8!=0 &&  !DangerCells.includes(id+7)){
      // 
      if(board[id+7]?.type!==current)  moves.push(id+7)
    }

    if(id<56 && id%8!=7 && !DangerCells.includes(id+9)){
      if(board[id+9]?.type!==current)  moves.push(id+9)
    }

    let castling =  castleLogic(DangerCells,board,current,Traking)
    

    return {moves,castling}
},[])



const isInDanger=useCallback((dangerList,board)=>{
 // 
  let Id;
    board?.forEach((e,i)=>{ 
      // 
      if(  e?.item==String(current+'k')){
        Id=i
      }
    })
    if(Id==null) return 
    let check = dangerList?.flat(Infinity).includes(Id) ? Id : null
    // 
    return check;
},[current])


const getPone=useCallback((id,board,current,exp=false)=>{

  const moves=[]
  const bypass = []
  if(exp){
    // 
    //  
    if (id % 8 !== 7   ) moves.push(id + 9);
    if (id % 8 !== 0   ) moves.push(id + 7);
  }
  else{
    if (id >= 8 && id <= 15 && !board[id + 16] && !board[id + 8]) moves.push(id + 16);
    if (!board[id + 8]) moves.push(id + 8);
    if (id % 8 !== 7 && board[id + 9] && board[id+9].type!=(current)  ) moves.push(id + 9);
    if (id % 8 !== 0 && board[id + 7] && board[id + 7].type!=(current) ) moves.push(id + 7);
  }
  
  if(id%8 !=7 && board[id+1]?.item[1]=="p" && board[id+1]?.type!=current && !board[id+9]   ){
    if(!exp){
      bypass.push(id+1) ;
    }
      moves.push(id + 9);
  }

  if(id%8 !=0 && board[id-1]?.item[1]=="p" && board[id-1]?.type!=current && !board[id+7]  ) {
    if(!exp){
      bypass.push(id-1);
    }
     moves.push(id + 7);
  }
    
  return {moves,bypass}

},[])



const getYmoves=useCallback((id,board,current,exp=false)=>{
  const moves =[];
  if(id%8!=0){
    
    for(let i = id-1 ; i>=0 ; i=i-1){
       
      if(!board[i]){
          moves.push(i)
      }
      else if(board[i]?.type!=current){
        if(exp){
          if(board[i].item[1]=='k') {  
            moves.push(i)
            continue
          }
          else{
            break
          }
        }
        else{
          moves.push(i)
          break
        }
      }
      else{
        if(exp){
          moves.push(i)
        }
        break
      }
      if(i%8==0) break

      

    }
  }


  if(id%8!=7){
    
    for(let i=id+1; i<=63 ;i=i+1){
      if(!board[i]){
        moves.push(i)
      }
      else if(board[i].type!=current){
        if(exp){
          if(board[i].item[1]=='k') {
            moves.push(i)
            continue
          }
          else{
            break
          }
        }
        else{
          moves.push(i)
          break
        }

      }
      else{
        if(exp){
          moves.push(i)
        }
        break
      }
      if(i%8==7) break
    }  
  }

  if(id<56){
    

    for(let i=id+8 ; i<64 ; i=i+8){
      if(!board[i]){
        moves.push(i)
      }
      else if(board[i].type!=current ){

        if(exp){
           
          if(board[i]?.item[1]=='k') {
            moves.push(i)
            continue
          }
          else{
            break
          }
        }
        else{
          moves.push(i)
          break
        }

      }
      else{
        if(exp){
          moves.push(i)
        }
        break
      }
      if(i>=65) break
    }
  }

  if(id>7){
    
    for(let i=id-8 ; i<64 ; i=i-8){
      if(!board[i]){
        moves.push(i)
      }
      else if(board[i].type!=current ){
        if(exp){
          if(board[i]?.item[1]=='k') {
            moves.push(i)
            continue
          }
          else{
            break
          }
        }
        else{
          moves.push(i)
          break
        }

      }
      else{
        if(exp){
          moves.push(i)
        }
        break
      }
      if(i<=7) break
    }
  }


  return moves;


},[])


const getXMoves= useCallback((id,board,current,exp=false)=>{
  const moves = []

  if(id%8!=0){  
    for(let i=id+7 ; i<64 ; i=i+7 ){
      
      if(!board[i]){
        moves.push(i)
      }
      else if(board[i].type!=current  ){
        if(exp){
           
          if(board[i]?.item[1]=='k') {
            moves.push(i)
            continue
          }
          else{
            break
          }
        }
        else{
          moves.push(i)
          break
        }

      }
      else{
        if(exp){
          moves.push(i)
        }
        break
      }
      if(i%8==0) break ;
    }

    for(let i=id-9 ; i>0 ; i=i-9){
      //  
      //  
    
      if(!board[i]){
        moves.push(i)
      }
      else if(board[i].type!=current  ){
        if(exp){
          if(board[i].item[1]=='k') {
            moves.push(i)
            continue
          }
          else{
            break
          }
        }
        else{
          moves.push(i)
          break
        }
      }
      else{
        if(exp){
          moves.push(i)
        }
        break;
      }
      if(i%8==0) break;
    }


    }
    if(id%8!=7){

        for(let i=id+9 ; i<64 ; i=i+9){
          
          if(!board[i]){
            moves.push(i)
          }
          else if(board[i].type!=(current) ){
            if(exp){
              if(board[i]?.item[1]=='k') {
                moves.push(i)
                continue
              }
              else{
                break
              }
            }
            else{
              moves.push(i)
              break
            }
          }
          else{
            if(exp){
              moves.push(i)
            }
            break;
          }
          if(i%8==7) break;
        }

        for(let i=id-7 ; i>0 ; i=i-7){
          
          if(!board[i]){
            moves.push(i)
          }
          else if(board[i].type!=(current)){
            if(exp){
              if(board[i].item[1]=='k') {
                moves.push(i)
                continue
              }
              else{
                break
              }
            }
            else{
              moves.push(i)
              break
            }
          }
          else{
            if(exp){
              moves.push(i)
            }
            break;
          }
          if(i%8==7) break;
        }

      }

      return moves
  
},[])


//



const getAllyourMoves = (board)=>{
  
  let moves = []
  board.forEach((e,i)=>{
    if(e?.type!==current) return null

    if(e?.item[1]=='p' ){
      let poneItem = {id:i,item:e.item};
      let {moves : move,bypass} =  getPone(i,board,current)
      let nmoves=checkKingSafty([...move,bypass],e,i)
      let bypassarray=checkKingSafty([...bypass],e,i)
      if(bypassarray.length){
        poneItem['bypass']=bypass
      }
      poneItem['moves']=nmoves
      moves.push(poneItem)
    }

    if(e?.item[1]=='r' ){
      moves.push({id:i,item:e.item,moves:checkKingSafty(getYmoves(Number(i),board,current),e,i)})
    }

    if(e?.item[1]=='n' ){
     //  
      moves.push({id:i,item:e.item,moves:checkKingSafty(getKnightMoves(i,board,current),e,i)})
    }

    if(e?.item[1]=='b' ){
     //  
      moves.push({id:i,item:e.item,moves:checkKingSafty(getXMoves(i,board,current),e,i)})
    }

    if(e?.item[1]=='q' ){
     //  
      moves.push({id:i,item:e.item,moves:[...checkKingSafty([...getXMoves(i,board,current)],e,i),...checkKingSafty(getYmoves(i,board,current),e,i)]})
    }
    if(e?.item[1]=='k'){
      
        let {moves : movesking , castling}=getKeenPossible(i,board,current,GetAllAdvansairPoosible(board),Traking)
        moves.push({id:i,item:e.item,castling,moves:[...checkKingSafty([...movesking,...castling],e,i)]})
    }})
    
    return moves
}




const getKnightMoves=useCallback((id,board,current,exp=false)=>{

  const moves = [];


  if(id%8<=5 && id>7){
    if(!board[id-6] || board[id-6].type!=current ){
      moves.push(id-6)
    }
    if(board[id-6]?.type==current && exp){
      moves.push(id-6)
    }
  }

  if(id%8<=5 && id<56){
    if(!board[id+10] || board[id+10].type!=current ){
      moves.push(id+10)
    }

    if(board[id+10]?.type==current && exp){
      moves.push(id+10)
    }
  }

  if(id%8<=6 && id<48) {
    if(!board[id+17] || board[id+17].type!=current ){
      moves.push(id+17)
    }

    if(board[id+17]?.type==current && exp){
      moves.push(id+17)
    }

  }

  if(id%8>=1 && id<48) {
    if(!board[id+15] || board[id+15].type!=current ){
      moves.push(id+15)
    }
    if(board[id+15]?.type==current && exp){
      moves.push(id+15)
    }
  }

  if(id%8>=2 && id<48){
    if(!board[id+6] || board[id+6].type!=current ){
      moves.push(id+6)
    }

    if(board[id+6]?.type==current && exp){
      moves.push(id+6)
    }
  }

  if(id%8>=2 && id>7){
    if(!board[id-10] || board[id-10].type!=current ){
      moves.push(id-10)
    }

    if(board[id-10]?.type==current && exp){
      moves.push(id-10)
    }
  }

  if(id%8>=1 && id>15){
    if(!board[id-17] || board[id-17].type!=current ){
      moves.push(id-17)
    }

    if(board[id-17]?.type==current && exp){
      moves.push(id-17)
    }
  }
  if(id%8<=6 && id>15){
    if(!board[id-15] || board[id-15].type!=current ){
      moves.push(id-15)
    }
    if(board[id-15]?.type==current && exp){
      moves.push(id-15)
    }
  }

  return moves

},[])




function checkScore(current){
  const moves =  Yourmoves.filter(e=>e.moves.filter(e=>e).length)
  
  if(moves.length == 0 && Traking[current].length>0){
    if(!KingInDanger){
      setScore(draw);
    }
    else{
      setScore(getWining(current))
    }
  }

}

function getWining(current){
  if(current=='w'){
    return bw
  }
  return ww
}

const timerRef = useRef()

const timing =useCallback(()=>{
 timerRef.current = setInterval(()=>{
    if(timer[current]<=0){
      clearInterval(timerRef.current)
      setScore(current=="w"?bw:ww)
    }
    else{
      setTimer(prev=>({...prev,[current]:prev[current]-1}))
    }
  },1000)
} ,[current,timer])

useEffect(()=>{
  if(start)timing()
  return ()=>{
    return clearInterval(timerRef.current)
  }
},[current,timing])





const handel = useCallback(handelClick,[current,board,possible,getXMoves,getYmoves,getKnightMoves,getPone,selected,dangers])


useEffect(()=>{
  if(to!=null && selected!=null){
    console.log('dzt mn hna')
    console.log(possible)
    if(possible.includes(to)  ){
      if(board[selected].item==current+'p' && (selected>=48 && selected<=55) )return  setTransforming(selected);
      track()
      switchRole()
      playSound(to)
      setBoard(prev=>{
        if(byPass==to-8){
          prev[byPass]=undefined
        }
         
        if(castling.includes(to)){
          prev[to]=prev[selected]
          const rook = to>3?7:0
        //   
          prev[rook ==7 ? to-1 : to+1]=prev[rook]
          prev[rook]=undefined
        //   
        }
        else{
          prev[to]=prev[selected]
        }
        
        prev[selected]=undefined
        let newArray = prev.reverse()
        return [...newArray]
      })
      
    }
    
    clear()
  }
},[possible,to,selected,board,switchRole,byPass,current])

// 

function clear(){
  setSelected(null)
  setPossible([])
  setTo(null)
  setBypass(null)
  setTransforming(null)
  setKastling([])
}


function track(){
  setTraking(ts=>({...ts,[current]:[...ts[current],{item:board[selected]}]}))
}



function playSound(to){

  if(board[to]){
    Eat.current.play()
  }
  else if(castling.includes(to)){
    castle.current.play()
  }
  else{
    Move.current.play()
  }
}


useEffect(()=>{
  setBoard((prev)=>{ 
    let nItems = prev.length>0 ? prev : BoardItems
    const reversed = [...nItems].reverse()
    let nBoard  = [...reversed]
    return nBoard;
  })

},[])
// 
useEffect(()=>{
  checkScore(current)
},[current,KingInDanger])



useLayoutEffect(()=>{
  // 
  if(board.length==0) return ;
    setKingDanger(isInDanger(dangers,board))
},[current,dangers,board,isInDanger,selected])


// get all advansaire possible moves to define the the dangers cells that the king must avoid
let GetAllAdvansairPoosible=useCallback((board,isExper=false)=>{

  let moves = []

  let nb= [...board].reverse()


  let Ncurrent = current == 'w' ? 'b': 'w'

  
  nb.forEach((e,i)=>{
    if(e?.type==current) return null

    if(e?.item[1]=='p' ){
      let {moves : move ,bypass} =   getPone(i,nb,Ncurrent,true)
      moves.push({id:i,item:e.item,moves:[...move,bypass]})
    }

    if(e?.item[1]=='r' ){
      moves.push({id:i,item:e.item,moves:getYmoves(Number(i),nb,Ncurrent,true)})
    }

    if(e?.item[1]=='n' ){
     //  
      moves.push({id:i,item:e.item,moves:getKnightMoves(i,nb,Ncurrent,true)})
    }

    if(e?.item[1]=='b' ){
     //  
      moves.push({id:i,item:e.item,moves:getXMoves(i,nb,Ncurrent,true)})
    }

    if(e?.item[1]=='q' ){
     //  
      moves.push({id:i,item:e.item,moves:[getXMoves(i,nb,Ncurrent,true),getYmoves(i,nb,Ncurrent,true)]})
    }
    if(!isExper){
      if(e?.item[1]=='k'){
        const {moves : moveCastling ,castling}=getKeenPossible(i,nb,Ncurrent,GetAllAdvansairPoosible(nb,true),Traking)
        moves. push({id:i,item:e.item,moves:[...moveCastling,...castling]})
      }
    }
    
  })

 const Qmove =Array.from(new Set(moves.flat(1).map(
  (item)=>{
   let newA =  (item.moves.flat(1)).map(item=>{
      if(item%8>=4)
      {
        item=63-item
        const itemN = item 

        return itemN
      }
    else{
      item=63-item
      const itemN = item 

      return itemN
    }
  })
   

  return newA;

  
  }
  
  )))
 return Qmove
  
  
},[current,getKnightMoves,getPone,getXMoves,getYmoves,getKeenPossible])







useEffect(()=>{
    
  setDangers([...GetAllAdvansairPoosible(board)])
  const y = getAllyourMoves(board)

     setMoves(y)

},[current,GetAllAdvansairPoosible,board])

console.log(selected,to)


//



const getCaslingRook=()=>{
  let rooks = []
  castling.map(i=>{
    const rookIndex = i ?  i > 3 ? 7 : 0 : null;
    //  
    rooks.push(rookIndex)
  })
  return rooks;
}


const Transform=(item)=>{
  switchRole()
  setBoard(prev=>{
    prev[to]=item
    prev[selected]=undefined
    let newArray = prev.reverse()
    return [...newArray];
  })
  clear()
  playSound()
}

  return (
    <div className={`Board ${flip && 'flip' }`} >
      {score && <Score score={score} />}
      {!start && <Start click={setStart} />}
      <audio src={audioMove} ref={Move} className=' ' style={{'display':'none'}} />
      <audio src={EatAudio} ref={Eat} className=' ' style={{'display':'none'}} />
      <audio src={CastleAudio} ref={castle} className=' ' style={{'display':'none'}} />
        {transforming && <Transforming switchItem={Transform} current={current} />}
        {
        // if the user are current role we reverse the array
        index
        ? reversedBoard.map((e, i) => {
              // if we are in the last cell in the reversed board, don't change the color; else, change it
              if (i % 8 !== 0) colorRef.current = !colorRef.current;
              return <Box  castling={getCaslingRook()} KingInDanger={KingInDanger} i={i} isPossible={possible.includes(63-i) || byPass==63-i } handelClick={handel} index={63-i} color={colorRef.current} key={i} role={e?.item} />;
          })
        : board.map((e, i) => {
              // if we are in the last cell in the board, don't change the color; else, change it
              if (i % 8 !== 0) colorRef.current = !colorRef.current;
              return <Box   castling={getCaslingRook()}  KingInDanger={KingInDanger} i={i} isPossible={possible.includes(i) || byPass==i } handelClick={handel} index={i} color={colorRef.current} key={i} role={e?.item} />;
          })}
    </div>
  )
}

export default Board