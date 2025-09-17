import { Router } from "express";

const userRouter = Router();
import bcrypt from 'bcrypt';
import { Jwt } from "jsonwebtoken";
import {CreateUserSchema, UserLoginSchema} from "@repo/zod/types"



userRouter.post('/signup', async(req, res)=>{
const {username, firstName, lastName, password} = req.body;

if (!username || !firstName || !lastName || !password){
    return res.json({
        message: 'Please fill all the required fields!'
    }).status(500);
};

const parsedData = CreateUserSchema.safeParse(req.body);

if (!parsedData.success){
    return res.json({
        message:"Invalid inputs!"
    }).status(500);
};

const hashedPassword = await bcrypt.hash(password,3);

})


userRouter.post('/signin', async(req,res)=>{
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(500).json({
      message: "Please fill all fields!",
    });
  }
  const parsedData = UserLoginSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res
      .json({
        message: "Invalid inputs!",
      })
      .status(500);
  }

  // Match the password and then make the token and sign the token with user id
})


