const { Server } = require("socket.io");

const io = new Server({ cors:'https://blog-frontend-ly3i.onrender.com' });

let onlineUsers = []

io.on("connection", (socket) => {

  socket.on('onlineUsers',(userId)=>{
    !onlineUsers.some((user)=> user.userId == userId) && onlineUsers.push({
        userId, socketId : socket.id
    });
    io.emit('getOnlineUsers',onlineUsers)
})

socket.on("disconnect",()=>{
  onlineUsers = onlineUsers.filter((user)=> user.socketId!==socket.id)
    io.emit('getOnlineUsers',onlineUsers)
})

socket.on('sendMessages',({senderId,recieverId,message,chatId})=>{
  const user = onlineUsers.find((user) => { return user.userId == recieverId} );
  if(user){
    io.to(user.socketId).emit('getMessages',{
      senderId,message, date:new Date(),chatId
    })
  }
})

});

io.listen(5000);