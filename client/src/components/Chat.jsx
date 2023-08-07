import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import backendURL from "./config";
import Footer from "./Footer";
import SendIcon from "@mui/icons-material/Send";
// import { io } from "socket.io-client";
import {socket} from './SocketCode';
import moment from "moment";

export default function Chat() {
  const [allChatUsers, setAllChatUsers] = useState([]);
  const [allUsersPresent, setAllUsersPresent] = useState([]);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [recieverId, setRecieverId] = useState("");
  const [chatId, setChatId] = useState("");
  const [chatName, setChatName] = useState("");
  const[ currentChat, setCurrentChat] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([]);
  const[notification, setNotifications] = useState([]);
  // const socket = useRef(io('ws://localhost:5000'))
  let user = JSON.parse(localStorage.getItem("userId"));
  let scroll = useRef(null);

  useEffect(() => {
    ChatUser();
  }, []);

  useEffect(() => {
    socket.emit('onlineUsers', user._id);
    socket.on('getMessages', data=>{
      setArrivalMessage({
        senderId:data.senderId,
        message:data.message,
        date:data.date,
        chatId:data.chatId
      })
    })
    return () => {socket.off('getMessages')}; // No socket disconnect in this cleanup function
  }, []);

  useEffect(()=>{
    arrivalMessage && (currentChat?.members.some((i)=>{return i._id == arrivalMessage.senderId}) && setMessages((pre)=>[...pre,arrivalMessage]))
    arrivalMessage && updateCreatedAt()
  },[arrivalMessage, currentChat])

  useEffect(()=>{
    arrivalMessage && !currentChat?.members.some((i)=>{return i._id == arrivalMessage.senderId}) &&  setNotifications((pre)=>[...pre,arrivalMessage]) 
    arrivalMessage && updateCreatedAt()
  },[arrivalMessage])

  useEffect(()=>{
     arrivalMessage && !currentChat?.members.some((i)=>{return i._id == arrivalMessage.senderId}) && updateUnreadCound()
  },[notification])

  const updateUnreadCound = async(flag,id) =>{
    try{
      const unread = {}

      if(flag && id){
        unread[id._id] = 0
      }
      else{
        allChatUsers.map((i)=>{  
          if(notification.filter((l)=>{return l.chatId == i._id })){
                return unread[i._id] = notification.filter((l)=>{return l.chatId == i._id }).length
          }
        })
      }

      const response = await axios.post(`${backendURL}/api/update-unread-count`,{
        senderId: flag && id ? flag : arrivalMessage.senderId,
        recieverId:user._id,
        unread,
        chatId: flag && id ? chatId : arrivalMessage.chatId,
      })

    }catch(error){
      console.log('error in updatedUnreadCount',error)
    }
  }

  const updateCreatedAt = () => {
    setAllChatUsers((prevAllChatUsers) => {
      return prevAllChatUsers.map((chat) => {
        const updatedMembers = chat.members.map((member) => {
          if (member._id === arrivalMessage.senderId) {
            return { ...member, updatedAt: arrivalMessage.date, lastMessage:arrivalMessage.message };
          }
          return member;
        });
  
        return {
          ...chat,
          members: updatedMembers,
          updatedAt:
            chat.members.some((member) => member._id === arrivalMessage.senderId)
              ? arrivalMessage.date
              : chat.updatedAt,
          lastMessage:chat.members.some((member) => member._id === arrivalMessage.senderId)
          ? arrivalMessage.message
          : chat.lastMessage,
        };
      });
    });
  };
    
  useEffect(() => {
    const handleOnlineUsers = (res) => {
      setOnlineUsers(res);
    };
  
    socket.on('getOnlineUsers', handleOnlineUsers);
  
    return () => {
      socket.off('getOnlineUsers', handleOnlineUsers);
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

    socket.emit('sendMessages',{
      senderId: user._id,
      recieverId,
      message: textMessage,
      chatId
    })

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

    setAllChatUsers((prevAllChatUsers) => {
      return prevAllChatUsers.map((chat) => {
        const updatedMembers = chat.members.map((member) => {
          if (member._id === recieverId ) {
            return { ...member, updatedAt: new Date(), lastMessage:textMessage };
          }
          return member;
        });
  
        return {
          ...chat,
          members: updatedMembers,
          updatedAt:
            chat.members.some((member) => member._id === recieverId)
              ? new Date()
              : chat.updatedAt,
          lastMessage:chat.members.some((member) => member._id === recieverId)
          ? textMessage
          : chat.lastMessage,
        };
      });
    });

    return axios
      .post(`${backendURL}/api/send-message`, {
        senderId: user._id,
        recieverId,
        chatId,
        message: textMessage,
      })
      .then((res) => {

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

  const a = (id) =>{
    let temp = [...notification]
    let k = temp.filter((l)=>{return l.senderId !==id })
    setNotifications(k)

  }

  return (
    <div className="chatCOntianer">
      <Footer />
      <div style={{ display: "flex" }}>
        <div className="peopleContainer">
          <h2>chat users</h2>
          {allChatUsers?.sort((a,b)=> new Date(b.updatedAt) - new Date(a.updatedAt) ).map((i) => {
            return i.members.map((v) => {
              return (
                <div
                  className="friends_design"
                  style={{ display: v._id == user._id ? "none" : "block" }}
                  onClick={() => {
                    getMessages(i._id);
                    setChatId(i._id);
                    setRecieverId(v._id);
                    setCurrentChat(i);
                    a(v._id);
                    setChatName(v.name);
                    updateUnreadCound(v._id,i)
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
                    <div style={{position:"relative"}}><img src={"profilepicture.jpg"} />{onlineUsers.some((i)=>{return i.userId == v._id})? <div style={{height:'10px', width:'10px', borderRadius:"50%", background:"lightgreen", position:'absolute', bottom:"4px", right:'7px' }}></div>:''}</div>          
                  <div className="unread"> <div>{v.name} <div style={{width:'5rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:"300"}}>{i.lastMessage} <div>{moment(i.updatedAt).format('DD/MM/YYYY')== moment().format('DD/MM/YYYY')?moment(i.updatedAt).format('h:mm a'):moment(i.updatedAt).format('DD/MM/YYYY')}</div> </div> </div> {notification.filter((l)=>{return l.senderId == v._id }).length>0 ? <div  className="unreadCount">{notification.filter((l)=>{return l.senderId == v._id }).length}</div>:i.unreadCount.split('-')[0]==v._id && i.unreadCount.split('-')[1]} </div>  
                  </div>
                </div>
              );
            });
          })}
        </div>
        <div className="messageContainer">
          <h2 style={{marginTop:'0'}}>{chatName}</h2>
        <div style={{padding:'0rem 1rem', display:'flex', flexDirection:'column', gap:'1rem', height:'85vh', overflow:'auto',scrollBehavior: 'smooth'}} ref={scroll} >
            {messages.map((i)=>{
                return(
                    <div style={i.senderId==user._id?{display:'flex', justifyContent:'end'}:{display:'flex', justifyContent:'start'}} > <div className={i.senderId==user._id?"senderMessage":'recieverMessage'}>{i.message}</div> </div>
                )
            })}
       { chatId && <div style={{position:'sticky', bottom:'10px', background:"white", textAlign:'center', display:'flex', alignItems:'center', gap:'1rem', justifyContent:'center'}}>
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
