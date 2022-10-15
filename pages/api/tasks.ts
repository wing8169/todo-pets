import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Task } from "../../interfaces";

// search query type
class SearchQueryDto {
  sort?: string;
  filters?: string;
  offset?: number;
  limit?: number;
}

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const query: SearchQueryDto = req.query;
  const body: Task = req.body;

  switch (method) {
    // GET tasks will return all tasks
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
      const result = await prisma.task.findMany(prismaQuery);
      res.status(200).json(result);
      break;
    // POST tasks will create a new task, and return the created object
    case "POST":
      try {
        // create a new task
        const task = await prisma.task.create({
          data: {
            ipAddress: body.ipAddress,
            title: body.title,
            status: false,
            deleted: false,
            createdAt: new Date(),
            lastModifiedAt: new Date(),
            dueAt: body.dueAt,
            claimed: false,
          },
        });
        // emit socket event to notify all users on the update
        // TODO: Send to the task owner only
        try {
          // @ts-ignore
          res.socket.server.io.emit("task", task);
        } catch (err) {
          console.log(err);
        }
        // return ok
        return res.status(200).json(task);
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
