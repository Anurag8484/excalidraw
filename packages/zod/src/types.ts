import { z } from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(4).max(20),
    firstName: z.string().min(4).max(20),
    lastName: z.string().min(4).max(20),
    password: z.string().min(3).max(20)
});


export const UserLoginSchema = z.object({
    username: z.string().min(4).max(20),
    password: z.string().min(3).max(20)
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})