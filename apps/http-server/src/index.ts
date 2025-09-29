import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import cors from "cors";
import {
  CreateUserSchema,
  SigninUserSchema,
  CreateRoomSchema,
} from "@repo/zod/types";
import { middleware } from "./middleware";
import { prismaClient } from "@repo/db/prismaClient";
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    return res.status(500).json({
      message: "Invalid inputs",
    });
  }

  try {
    const hashedPassowrd = await bcrypt.hash(parsedData.data.password, 8);
    const user = await prismaClient.user.create({
      data: {
        username: parsedData.data.username,
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
        password: hashedPassowrd,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(411).json({
      message: "User already exists!",
    });
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  const parsedData = SigninUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return res.status(500).json({
      message: "Invalid Inputs!",
    });
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        username: parsedData.data.username,
      },
    });

    const passwordCheck = await bcrypt.compare(
      parsedData.data.password,
      user?.password as string
    );
    if (!passwordCheck) {
      return res.status(403).json({
        message: "Wrong password!",
      });
    }

    const token = jwt.sign(
      {
        userId: user?.id,
      },
      JWT_SECRET
    );
    // Here we send the token to the FE, so that we can place it in the localstorage for further verification.
    res.json({
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({
        message:"Internal server error"
    }).status(500)
  };
});

app.post("/room", middleware, async (req: Request, res: Response) => {

  const parsedData = CreateRoomSchema.safeParse(req.body);

  if(!parsedData.success){
    return res.status(500).json({
      message:"Invalid inputs"
    });
  };

  const userId = req.id;
  console.log(userId)
  console.log(parsedData.data)

  try {
    const room =  await prismaClient.room.create({
      data:{
        slug: parsedData.data.name,
        admin: {connect:{id:String(userId)}}
      }
    });
    return res.status(201).json({
      roomId: room.id
    })
  } catch (error) {
    console.log(error);
    return res.json({
      message:"Internal Server Error"
    }).status(500);
    
  }

});


app.listen(3001);
