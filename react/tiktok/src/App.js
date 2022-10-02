import logo from './logo.svg';
import './App.css';

import { useState } from 'react'

const lists = []
const RenderListOut = () => {
  return lists.map((value, index)=>{
    return <li key={index}>{value}</li>
  })
}

function App() {
  const [input, setInput] = useState()
  // const [listss, setLists] = useState([])

  // const RenderList = () => {
  //   return listss.map((value, index)=>{
  //     return <li key={index}>{value}</li>
  //   })
  // }

  const handleAdd = (value) => {
    lists.push(value)
    // setLists(prev => {
    //   return [
    //     ...prev,
    //     value
    //   ]
    // })
    setInput('')
  } 

  return (
    <div className="App">
      <input 
        value={input}
        onChange={(e)=>setInput(e.target.value)}
      />
      <button onClick={()=>handleAdd(input)}>Add</button>
      <ul>
        {/* {listss.length > 0 && RenderList()} */}
        <RenderListOut />
      </ul>
    </div>
  );
}

export default App;
