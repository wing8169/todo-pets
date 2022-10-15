import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;
  switch (method) {
    case "GET":
      // get data
      const result = await prisma.user.findMany();
      res.status(200).json(result);
      break;
    case "POST":
      // id: string;
      // ipAddress?: string;
      // coins?: number;
      // pets?: string[];
      // Create data
      try {
        // Perform type checking
        if ("ipAddress" in body && typeof body.ipAddress === "string") {
          const user = await prisma.user.create({
            data: {
              ipAddress: body.ipAddress,
              coins: 0,
              pets: [],
            },
          });
          console.log(user);
          return res.status(200).json(user);
        }
        throw new Error("number_one or number_two is not a number");
      } catch (err) {
        console.log(err);
        return res.status(403).json({ err: "403 Bad Request" });
      }
    default:
      // Method not allowed
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }

  //   await prisma.$connect();
  //   const result = await prisma.user.findMany();
  //   res.status(200).json(result);
}
