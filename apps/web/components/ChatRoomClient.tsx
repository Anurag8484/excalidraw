"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../app/hooks/useSocket";

export default function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const { socket, loading } = useSocket();
  const [chats, setChats] = useState(messages);
  const [currentMsg, setMsg] = useState("");
  useEffect(() => {
    if (socket) {
      try {
        socket.send(JSON.stringify({ type: "join", roomId: id }));
      } catch (error) {
        console.log(error);
      }
    } 

  }, [socket, id]);

  useEffect(() => {
    if (socket && !loading) {
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type === "chat") {
            // alert("Chat recieved")
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }

  }, [socket, loading]);

  return (
    <div>
      {chats.map((m) => (
        <div >{m.message}</div>
      ))}
      <br />
      <br />
      <input
        type="text"
        value={currentMsg}
        onChange={(event) => {
          setMsg(event.target.value);
        }}
      />
      <br />
      <br />
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({ type: "chat", roomId: id, message: currentMsg })
          );
        }}
      >
        Send Message
      </button>
    </div>
  );
}
