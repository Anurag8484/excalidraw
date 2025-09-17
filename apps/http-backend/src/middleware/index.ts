import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'

declare module 'express'{
    interface Request{
        id?: string
    }
}

export function gate(req:Request,res:Response,next:NextFunction){

    const token = req.headers.token;

    if (!token){
        return res.json({
            message: "Please provide token"
        }).status(500);
    };

    const decoded = jwt.verify(token as string, JWT_SECRET)

    if (decoded || (typeof decoded === "object" && ("id" in decoded))) {
        req.id = (decoded as JwtPayload).id as string;
        next();
    }else{
        return res.json({
            message: 'Invalid token'
        }).status(403);
    };

}