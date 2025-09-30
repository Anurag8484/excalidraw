import { BACKEND_URL } from "@repo/backend-common/config";
import axios from "axios";

async function getChats(roomId:string){
    try {
        const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`)
        return response.data.messages
    } catch (error) {
        console.log(error);
        return;
    }
}


export default async function ChatRoom({roomId}:{roomId:string}){
    const chats = await getChats(roomId);
}