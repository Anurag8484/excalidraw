
import axios from "axios"
import {BACKEND_URL} from "@repo/backend-common/config"
import ChatRoom from "../../../components/ChatRoom";
async function getRoom(slug: string){
    try {
        const response = await axios.get(`${BACKEND_URL}/room/${slug}`)
        return response.data.room.id
    } catch (error) {
        console.log(error);
        return;
    }
}


export default async function ({
    params
}:{
    params:{
        slug: string
    }
}){
    const roomId = await getRoom(await (params).slug);

    return <div>
        <ChatRoom roomId={roomId}></ChatRoom>
    </div>
}