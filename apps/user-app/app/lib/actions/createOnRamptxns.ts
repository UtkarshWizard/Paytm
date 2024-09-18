"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTxns (amount: number , provider: string) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const token = ( Math.random() * 1000 ).toString(); //Ideally the token comes from banks in real world. But for now since theres no bank we generate random.
    if (!userId) {
        return {
          message: "User not logged in."
        }
      }

      try {
        await prisma.onRampTransaction.create({
          data: {
            userId: Number(userId),
            amount: amount * 100,
            status: "Processing",
            startTime: new Date(),
            provider,
            token: token
          }
        });
      } catch (error) {
        console.error("Error creating transaction:", error);
      }

    return {
        message: "Done"
    }
}