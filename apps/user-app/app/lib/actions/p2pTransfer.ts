"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";

export async function p2pTranfer (toNumber: string , amount:number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;

    if (!from) {
        return {
            message: "Error while sending."
        }
    }

    const toUser = await prisma.user.findFirst({
        where: {
            number: toNumber
        }
    });

    if (!toUser) {
        return {
            message: "User not Found."
        }
    }

    await prisma.$transaction(async (txn) => {
        await txn.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`; //This locks the database untill when all the things succesfully passed. Since prisma does not accept lock feature out of box hence we write raw sql commands.
        const fromBalance = await txn.balance.findUnique({
            where: {
                userId: Number(from)
            }
        });

        if (!fromBalance || fromBalance.balance < amount) {
            throw new Error('Insufficient Funds !')
        }

        await txn.balance.update({
            where: {
                userId: Number(from)
            },
            data: {
                balance: {decrement: amount}
            }
        })
        await txn.balance.update({
            where: {
                userId: toUser.id
            },
            data: {
                balance: {increment:amount}
            }
        });

        await txn.p2pTransfer.create({
            data: {
                amount,
                fromUserId: Number(from),
                toUserId: toUser.id,
                timeStamp: new Date()
            }
        })
    });
}