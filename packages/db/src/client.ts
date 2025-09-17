import {PrismaClient} from "@prisma/client"

const prismaClientSingleton = () =>{
    return new PrismaClient();
}

type PrismClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
    prisma: PrismClientSingleton | undefined
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV!== 'production') globalForPrisma.prisma = prisma;