import React, { useState, useEffect } from "react";
import axios from "axios";
import backendURL from "./config";
import Footer from './Footer'

export default function Chat() {
  const [allChatUsers, setAllChatUsers] = useState([])
  const [allUsersPresent, setAllUsersPresent] = useState([])
  const [messages, setMessages] = useState([])
  const[textMessage, setTextMessage] = useState('')
  const [recieverId,setRecieverId] = useState('')
  const [chatId,setChatId] = useState('')
  let user = JSON.parse(localStorage.getItem("userId"));
  useEffect(()=>{
   ChatUser();
  },[])

    const ChatUser = () => {
        return axios
          .get(`${backendURL}/api/get-chat/${user._id}`)
          .then((res) => {
            setAllChatUsers(res.data.chat)
            allUser(res.data.chat)
          })
          .catch((error) => {
            
            console.log(error);
          });
      };

      const allUser = (allChatUser) => {
        return axios
          .get(`${backendURL}/api/get-all-users`)
          .then((res) => {
            
           
            let temp = res.data.allUsers.filter((i)=>{ return i._id !==user._id });
            console.log(allChatUser)
            let temp1 = temp.map((v) => {
              if (allChatUser?.some((i) => i.members[0]._id === v._id || i.members[1]._id === v._id)) {
                return { ...v, allreadyChatExist: true };
              } else {
                return { ...v, allreadyChatExist: false };
              }
            });
            setAllUsersPresent(temp1)
          })
          .catch((error) => {
            
            console.log(error);
          });
      };

       console.log(allChatUsers)

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

      const createChat = (senderId,recieverId) => {
        return axios
          .post(`${backendURL}/api/create-chat`,{
            senderId,recieverId
          })
          .then((res) => {
            ChatUser()
          })
          .catch((error) => {
            
            console.log(error);
          });
      };

      console.log(allUsersPresent)
    
  return (
    <div>
        <Footer/>
        <div style={{background:'pink'}}>
          <h1>chat users</h1>
          {allUsersPresent?.map((i)=>{
            return(
              <div style={{display:i.allreadyChatExist?'none':'block'}} onClick={()=>{createChat(user._id, i._id)}} >{i.name}</div>
            )
          })}
        </div>
        <div style={{background:'aqua'}}>
            {allChatUsers?.map((i)=>{
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
                    <div style={{background:i.senderId==user._id?'pink':'blue'}}>{i.message}</div>
                )
            })}
        </div>
        {<input type="text" onChange={(e)=>{setTextMessage(e.target.value)}} />}
        <button onClick={()=>{sendMessages()}} >send</button>
    </div>
  )
}
