import React, { useState, useEffect } from "react";
import axios from "axios";
import backendURL from "./config";
import Footer from './Footer'

export default function Chat() {
  const [allChatUsers, setAllChatUsers] = useState([])
  const [messages, setMessages] = useState([])
  const[textMessage, setTextMessage] = useState('')
  const [recieverId,setRecieverId] = useState('')
  const [chatId,setChatId] = useState('')
  let user = JSON.parse(localStorage.getItem("userId"));
  useEffect(()=>{
   ChatUser()
  },[])
    const ChatUser = () => {
        return axios
          .get(`${backendURL}/api/get-chat/${user._id}`)
          .then((res) => {
            setAllChatUsers(res.data.chat)
          })
          .catch((error) => {
            
            console.log(error);
          });
      };

    const getMessages = (chatIdd) => {
        return axios
          .get(`${backendURL}/api/get-message/${chatIdd}`)
          .then((res) => {
            setMessages(res.data.message)
          })
          .catch((error) => {
            
            console.log(error);
          });
      };

    const sendMessages = () => {
        return axios
          .post(`${backendURL}/api/send-message`,{
            senderId:user._id,
            recieverId,chatId,message:textMessage
          })
          .then((res) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                  senderId: user._id,
                  recieverId,
                  chatId,
                  message: textMessage,
                },
              ]);
          })
          .catch((error) => {
            
            console.log(error);
          });
      };
    
  return (
    <div>
        <Footer/>
        <div>
            {allChatUsers.map((i)=>{
                return(
                    i.members.map((v)=>{
                        return(
                            <div style={{display:v._id==user._id?'none':'block'}} onClick={()=>{getMessages(i._id); setChatId(i._id); setRecieverId(v._id)}} >{v.name}</div>
                        )
                    })
                )
            })}
        </div>
        <div>
            {messages.map((i)=>{
                return(
                    <div>{i.message}</div>
                )
            })}
        </div>
        <input type="text" onChange={(e)=>{setTextMessage(e.target.value)}} />
        <button onClick={()=>{sendMessages()}} >send</button>
    </div>
  )
}
