import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare module 'express'{

    interface Request{
        userId ?: string
    }
}


async function gate(req:Request,res:Response,next: NextFunction){

    const token = req.headers.token;

    if(!token){
        return res.json({
            message:'Please proivde token to proceed further!'
        }).status(400)
    }

    const decoded =  jwt.verify(token as string, 'secrect');

    if(typeof decoded === 'object' && decoded !== null && 'id' in decoded){
        req.userId = (decoded as JwtPayload).id as string;
        next();
    }else{
        return res.json({
            message: 'Unauthorized'
        }).status(403)
    }

}