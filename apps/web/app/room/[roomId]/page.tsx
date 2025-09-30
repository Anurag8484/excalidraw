import axios from "axios"
import {BACKEND_URL} from "@repo/backend-common/config"
async function getRoom(slug: string){
    try {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
        return response.data.roomId
    } catch (error) {
        console.log(error);
        return;
    }
}


export default async function Chats({
    params
}:{
    params:{
        slug: string
    }
}){
    const roomId = await getRoom(params.slug);
}