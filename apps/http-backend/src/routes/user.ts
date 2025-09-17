import { Router } from "express";
const userRouter = Router();
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';


userRouter.post('/signup', async(req, res)=>{
    const {email, firstName, lastName, password} = req.body;

    if (!email || !firstName || !lastName || !password){
        console.log('Please Fill all the required fields');
        res.json({
            message: 'Fill all the required fields'
        });
    };

    const hashedPassword = await bcrypt.hash(password,3);


    // This is the part where we add the user into the db
})


userRouter.post('/signin', async(req,res)=>{
    const {email, password} = req.body;

    if (!email || !password){
        return res.json({
            message: 'Please fill all the required fields'
        });
    };

    // Compare the hashed password from db and the input password and login the user

    try {
        
    } catch (error) {
        
    }

})


