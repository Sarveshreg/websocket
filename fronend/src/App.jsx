import { useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import io from "socket.io-client"
import {nanoid} from "nanoid"

//do notenv
const socket=io.connect("http://localhost:5000");
let userName=nanoid(2);

function App() {
  const [message, setMessage] = useState("");
  const[chat,setChat]=useState([]);

  useEffect(()=>{
    socket.on("chat",(payload)=>{
      setChat(payload);
    })
  },[])

  const sendChat=(e)=>{
    e.preventDefault();
    socket.emit("chat",{message,userName});
    setMessage("");
  }

  return (
    <>
      <h1>chat app!</h1>
      {chat.map((payload,index)=>{
        return(
          <p key={index}>{payload.message}: <span>{payload.user_id}</span></p>
        )
      })}
      <form onSubmit={sendChat}>
        <input type="text" name="chat"  placeholder='your message' value={message} onChange={(e)=>setMessage(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </>
  )
}

export default App
