import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const id: string =
    typeof req.query.id === "string"
      ? req.query.id
      : JSON.stringify(req.query.id);

  switch (method) {
    // GET users/:id returns a user by its ID
    case "GET":
      try {
        const existingUser = await prisma.user.findFirstOrThrow({
          where: {
            id: id,
          },
        });
        return res.status(200).json(existingUser);
      } catch (err) {
        console.log(err);
        return res.status(404).json({ err: "404 Not Found" });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
