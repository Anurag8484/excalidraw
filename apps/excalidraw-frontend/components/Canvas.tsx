'use client'
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";

export type Tool = "circle" | "rect" | "pencil";
export function Canvas({
    roomId,socket
}:{
    roomId: string;
    socket: WebSocket;
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<Tool>("circle");
     useEffect(()=>{

        const canvas = canvasRef.current
        if (!canvas){
            return;
        }
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        initDraw(canvas, roomId, socket)
     }, [canvasRef]);

     return <div className="bg-black flex text-red-500">
        <canvas className="" ref={canvasRef} width={1500} height={1000}>asdasd</canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
     </div>
}


function Topbar({selectedTool, setSelectedTool}:{selectedTool:Tool, setSelectedTool:(s:Tool)=>void}){
    return (
        <div className="fixed  flex gap-2 w-fit p-2 left-0 right-0 text-red-200">
            <Icon icon={<RectangleHorizontal />} onClick={()=>{setSelectedTool("rect")}} activated={selectedTool === "rect"} />
            <Icon icon={<Circle />} onClick={()=>{setSelectedTool("circle")}} activated={selectedTool === "circle"} />
            <Icon icon={<Pencil />} onClick={()=>{setSelectedTool("pencil")}} activated={selectedTool === "pencil"} />
        </div>
    )
}