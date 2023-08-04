import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import backendURL from "./config";
import Footer from "./Footer";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";

export default function Chat() {
  const [allChatUsers, setAllChatUsers] = useState([]);
  const [allUsersPresent, setAllUsersPresent] = useState([]);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [recieverId, setRecieverId] = useState("");
  const [chatId, setChatId] = useState("");
  const[ currentChat, setCurrentChat] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socket = useRef(io('ws://localhost:5000'))
  let user = JSON.parse(localStorage.getItem("userId"));
  let scroll = useRef(null);

  useEffect(() => {
    ChatUser();
  }, []);

  useEffect(() => {
    socket.current.emit('onlineUsers', user._id);
    socket.current.on('getMessages', data=>{
      setArrivalMessage({
        senderId:data.senderId,
        message:data.message
      })
    })
    return () => {}; // No socket disconnect in this cleanup function
  }, []);

  useEffect(()=>{
    arrivalMessage && currentChat?.members.some((i)=>{return i._id == arrivalMessage.senderId}) && setMessages((pre)=>[...pre,arrivalMessage])
  },[arrivalMessage, currentChat])
  
  useEffect(() => {
    const handleOnlineUsers = (res) => {
      setOnlineUsers(res);
    };
  
    socket.current.on('getOnlineUsers', handleOnlineUsers);
  
    return () => {
      socket.current.off('getOnlineUsers', handleOnlineUsers);
    };
  }, []);

  // Function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (scroll.current) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }
  };

  // Call scrollToBottom whenever the messages array changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log('onlineUsers',onlineUsers)

  const ChatUser = () => {
    return axios
      .get(`${backendURL}/api/get-chat/${user._id}`)
      .then((res) => {
        setAllChatUsers(res.data.chat);
        allUser(res.data.chat);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const allUser = (allChatUser) => {
    return axios
      .get(`${backendURL}/api/get-all-users`)
      .then((res) => {
        let temp = res.data.allUsers.filter((i) => {
          return i._id !== user._id;
        });
        let temp1 = temp.map((v) => {
          if (
            allChatUser?.some(
              (i) => i.members[0]._id === v._id || i.members[1]._id === v._id
            )
          ) {
            return { ...v, allreadyChatExist: true };
          } else {
            return { ...v, allreadyChatExist: false };
          }
        });
        setAllUsersPresent(temp1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMessages = (chatIdd) => {
    return axios
      .get(`${backendURL}/api/get-message/${chatIdd}`)
      .then((res) => {
        setMessages(res.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendMessages = () => {

    socket.current.emit('sendMessages',{
      senderId: user._id,
      recieverId,
      message: textMessage,
    })

    return axios
      .post(`${backendURL}/api/send-message`, {
        senderId: user._id,
        recieverId,
        chatId,
        message: textMessage,
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
        setTextMessage('')
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createChat = (senderId, recieverId) => {
    return axios
      .post(`${backendURL}/api/create-chat`, {
        senderId,
        recieverId,
      })
      .then((res) => {
        ChatUser();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="chatCOntianer">
      <Footer />
      <div style={{ display: "flex" }}>
        <div className="peopleContainer">
          <h2>chat users</h2>
          {allChatUsers?.map((i) => {
            return i.members.map((v) => {
              return (
                <div
                  className="friends_design"
                  style={{ display: v._id == user._id ? "none" : "block" }}
                  onClick={() => {
                    getMessages(i._id);
                    setChatId(i._id);
                    setRecieverId(v._id);
                    setCurrentChat(i)
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderBottom:'1px solid black',
                      paddingBottom:'10px'
                    }}
                  >
                    <img src={"profilepicture.jpg"} />
                    {v.name} {onlineUsers.some((i)=>{return i.userId == v._id})?'online':'offline'}
                  </div>
                </div>
              );
            });
          })}
        </div>
        <div className="messageContainer">
        <div style={{padding:'0rem 1rem', display:'flex', flexDirection:'column', gap:'1rem', height:'85vh', overflow:'auto',scrollBehavior: 'smooth'}} ref={scroll} >
            {messages.map((i)=>{
                return(
                    <div style={i.senderId==user._id?{display:'flex', justifyContent:'end'}:{display:'flex', justifyContent:'start'}} > <div className={i.senderId==user._id?"senderMessage":'recieverMessage'}>{i.message}</div> </div>
                )
            })}
       { chatId && <div style={{position:'sticky', bottom:'0', textAlign:'center', display:'flex', alignItems:'center', gap:'1rem', justifyContent:'center'}}>
        <input value={textMessage} style={{width:'70%', border:'2px solid black'}}  className="inputComment" type="text" onChange={(e)=>{setTextMessage(e.target.value)}} />
        <SendIcon
       
        onClick={() => {
          sendMessages();
        }}
      />
       </div> }
        </div>
        </div>
        <div className="peopleContainer">
          <h2>users</h2>
        {allUsersPresent?.map((i)=>{
            return(
              <div className="friends_design" style={{display:i.allreadyChatExist?'none':'block'}} onClick={()=>{createChat(user._id, i._id)}} >
                <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderBottom:'1px solid black',
                      paddingBottom:'10px'
                    }}
                  >
                    <img src={"profilepicture.jpg"} />
                    {i.name} {onlineUsers.some((k)=>{return k.userId == i._id})?'online':'offline'}
                  </div>
                  
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
