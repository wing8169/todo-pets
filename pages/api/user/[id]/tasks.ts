import type { NextApiRequest, NextApiResponse } from "next";
import { Task } from "../../../../interfaces";
import prisma from "../../../../prisma/prisma";

// search query type
class SearchQueryDto {
  sort?: string;
  offset?: number;
  limit?: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const query: SearchQueryDto = req.query;
  const body: Task = req.body;
  const id: string =
    typeof req.query.id === "string"
      ? req.query.id
      : JSON.stringify(req.query.id);

  switch (method) {
    // GET tasks will return all tasks by user ID
    case "GET":
      try {
        const { sort, offset, limit } = query;

        // populate prisma query
        const prismaQuery: any = {};
        // sorting
        if (!!sort) {
          // parse sort data
          const sortArray = sort.split(",");
          const orderBy = sortArray.map((sorter) => {
            const order = sorter.slice(0, 1) === "+" ? "asc" : "desc";
            return { [sorter.slice(1)]: order };
          });
          prismaQuery["orderBy"] = orderBy;
        }
        // filtering
        prismaQuery["where"] = {
          user: id,
        };
        // pagination
        if (!!offset) {
          prismaQuery["skip"] = Number(offset);
        }
        if (!!limit) {
          prismaQuery["take"] = Number(limit);
        }
        const results = await prisma.task.findMany(prismaQuery);
        // format contents
        const contents = results.map((result) => {
          return {
            self: `/task/${result.id}`,
            id: result.id,
            user: `/user/${result.user}`,
            title: result.title,
            status: result.status,
            deleted: result.deleted,
            createdAt: result.createdAt,
            lastModifiedAt: result.lastModifiedAt,
            dueAt: result.dueAt,
            claimed: result.claimed,
          };
        });

        return res.status(200).json({
          self: "Task[]",
          contents,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          err: "Internal Server Error",
        });
      }
    // POST tasks will create a new task for a user, and return the created object
    case "POST":
      try {
        // create a new task
        const task = await prisma.task.create({
          data: {
            user: id,
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
        try {
          // @ts-ignore
          res.socket.server.io.emit("task", {
            self: `/task/${task.id}`,
            id: task.id,
            user: `/user/${task.user}`,
            title: task.title,
            status: task.status,
            deleted: task.deleted,
            createdAt: task.createdAt,
            lastModifiedAt: task.lastModifiedAt,
            dueAt: task.dueAt,
            claimed: task.claimed,
          });
        } catch (err) {
          console.log(err);
        }
        // return ok
        return res.status(200).json({
          self: `/task/${task.id}`,
          id: task.id,
          user: `/user/${task.user}`,
          title: task.title,
          status: task.status,
          deleted: task.deleted,
          createdAt: task.createdAt,
          lastModifiedAt: task.lastModifiedAt,
          dueAt: task.dueAt,
          claimed: task.claimed,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "Internal Server Error" });
      }
    default:
      // Method not allowed
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
