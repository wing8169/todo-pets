import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { User } from "../../interfaces";

const prisma = new PrismaClient();

// search query type
class SearchQueryDto {
  sort?: string;
  filters?: string;
  offset?: number;
  limit?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const query: SearchQueryDto = req.query;
  const body: User = req.body;

  switch (method) {
    // GET users will return all users
    case "GET":
      const { sort, filters, offset, limit } = query;

      // populate prisma query
      const prismaQuery: any = {};
      // sorting
      if (!!sort) {
        prismaQuery["orderBy"] = JSON.parse(sort);
      }
      // filtering
      if (!!filters) {
        prismaQuery["where"] = JSON.parse(filters);
      }
      // pagination
      if (!!offset) {
        prismaQuery["skip"] = offset;
      }
      if (!!limit) {
        prismaQuery["take"] = limit;
      }
      const result = await prisma.user.findMany(prismaQuery);
      return res.status(200).json(result);
    // POST users will return the user by its ip address (create a new user if the ip address is a new one)
    case "POST":
      try {
        // check if user exists already, if yes, return the user object
        const existingUser = await prisma.user.findFirst({
          where: {
            ipAddress: body.ipAddress,
          },
        });
        // user exists, return ok
        if (!!existingUser) return res.status(200).json(existingUser);
        // user does not exist, create a new user
        const user = await prisma.user.create({
          data: {
            ipAddress: body.ipAddress,
            coins: 0,
            pets: [],
          },
        });
        // emit socket event to notify all users on the update
        // TODO: Send to the user only
        try {
          // @ts-ignore
          res.socket.server.io.emit("user", user);
        } catch (err) {
          console.log(err);
        }
        // return ok
        return res.status(200).json(user);
      } catch (err) {
        console.log(err);
        return res.status(403).json({ err: "403 Bad Request" });
      }
    default:
      // Method not allowed
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
