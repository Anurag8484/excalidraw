import jwt, { JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET} from "@repo/backend-common/config"
import { NextFunction, Request, Response } from 'express';

declare module 'express'{
    interface Request{
        id?: string
    }
}

export function middleware(req:Request, res:Response, next:NextFunction){

    const token = req.headers["authorization"] ?? "";


    if (!token){
        return res.status(404).json({
            message: "Please provide valid token!"
        });
    };


    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded || (typeof decoded === 'object' && ("id" in decoded))){
        req.id = (decoded as JwtPayload).id as string;
        next();
    }else{
        return res.status(403).json({
            message: "Invalid Token"
        });
    };

};

