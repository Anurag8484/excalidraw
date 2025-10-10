import { BACKEND_URL } from "@repo/backend-common/config";
import axios from "axios";


export async function getExistingShapes(roomId: string) {
  try {
    const res = await axios.get(`${BACKEND_URL}/chat/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: { message: string, id: number }) => {
      const messageData = JSON.parse(x.message);
      messageData.shape.id = x.id;
      return messageData.shape;
    });
    return shapes;
  } catch (error) {
    console.log(error);
    return;
  }
}
