import { useEffect, useState } from "react";
import {WS_URL} from "@repo/backend-common/config"

export function RoomCanvas({roomId}:{roomId:string}){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(()=>{
        const ws = new WebSocket(WS_URL);

        ws.onopen = () =>{
            setSocket(ws);
            const data = JSON.stringify({
                type:"join",
                roomId
            });
            console.log(data);
            ws.send(data);
        }
    },[])

    if (!socket){
        return <div>
            Connecting to Server...
        </div>
    }
    return <div>
        
    </div>
}