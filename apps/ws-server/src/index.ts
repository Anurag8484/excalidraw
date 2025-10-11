import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import {prismaClient} from "@repo/db/prismaClient"
const wss = new WebSocketServer({ port: 8080 });
interface User{
    rooms: string[],
    ws: WebSocket,
    userId: string
}
const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    return (decoded as JwtPayload).userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
      console.log("wrong url")
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = checkUser(token);
  
  if (userId == null) {
        console.log("Null user Id");
      ws.close();
      return;
    }

    users.push({
        userId,
        rooms:[],
        ws
    })
    
  ws.on("message", async function message(data) {
    let parsedData;
    if (typeof data !== "string"){
        parsedData = JSON.parse(data.toString());
    }else{
        parsedData = JSON.parse(data); // It will look like {type: "join-room", roomId: "1"}
    }
    console.log(parsedData)
    if (parsedData.type === "join"){
        const user = users.find(x => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
        console.log("Room Joined");
        

    }

    if (parsedData.type === "chat"){
        const roomId = parsedData.roomId;
        const message = parsedData.message;
        try {
            const chat = await prismaClient.chat.create({
                data:{
                    message,
                    room:{connect:{id:Number(roomId)}},
                    user:{connect:{id:userId}}
                }
            });
        

            users.forEach(user =>{
                if (user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        message: message,
                        roomId: roomId
                    }))
                }
            })
            console.log("Chat sent!");
            return chat.id;
            
        } catch (error) {
            console.log(error)
            return;
        }
    }

    if (parsedData.type === 'update'){

        const msg = JSON.parse(parsedData.message);
        const shape = msg.shape
        const id = shape.id;
        // console.log(`Message ID: ${id}`)
        try {
            await prismaClient.chat.update({
                where:{
                    id
                },
                data:{
                    message:parsedData.message
                }
            });
            console.log("Shape updated")
            return;
        } catch (error) {
            console.log(error);
            return;
        }
    }

    if (parsedData.type === "leave"){
        const user = users.find(x=>x.ws === ws);
        if (!user){
            return null;
        }
        user.rooms = user?.rooms.filter(x=>x === parsedData.room)
        console.log("Room left");
        
    }
});
});
