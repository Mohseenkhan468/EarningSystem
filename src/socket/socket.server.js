import {Server} from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: "*",
  },
});

const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("identify", (userId) => {
    connectedUsers.set(userId, socket._id);
    console.log(`User ${userId} connected with socket Id ${socket._id}`);
  });
  socket.on("disconnect", () => {
   
    for(const[userId,socketId] of connectedUsers.entries()){
        if(socketId===socket.id){
            connectedUsers.delete(userId);
            console.log(`User ${userId} disconnected.`)
            break;
        }
    }
  });
});
const notifyUser=(userId,message)=>{
    const socketId=connectedUsers.get(userId);
    if(socketId){
        io.to(socketId).emit('notification',message)
    }
}
export default notifyUser;