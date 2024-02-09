// const http=require("http");
// const express =require("express");
// const path=require("path");
// const {Server} = require ("socket.io")
// const app=express();
// const server =http.createServer(app);
// const io=new Server(server);

// //socketio
// io.on("connection",(socket)=>{
//     console.log("a new user has connected",socket.id);
// })



// //http
// app.use(express.static(path.resolve("./public")));
// app.get("/",(req,res)=>{
//     return res.sendFile("/public/index.html");
// })

// server.listen(9000,()=>console.log("server running at 9000!"))

const express=require("express");
const app=express();
const server = require("http").createServer(app);
const pool=require("./db");
const cors=require("cors");
const io =require ("socket.io")(server,{
    cors:{
    origin:"*"
    }
});

app.use(cors());
app.use(express.json());

io.on("connection",(socket)=>{
    //console.log("socket",socket);

    socket.on("chat",(payload)=>{
        console.log("payload ",payload);
        let setMsg=async()=>{
            try {
                let response= await pool.query("insert into chat (user_id,message) values ($1,$2) returning *",[ payload.userName,payload.message])
                //console.log("database operation result",response.rows[0]);
                let allchat=await pool.query("select * from chat");
                //console.log("all chat",allchat.rows);
                io.emit("chat",allchat.rows);
            } catch (error) {
                console.log(error);
            }
        };setMsg();
       
    })
})
server.listen(5000,()=>{
    console.log("server is on at 5000!");
})