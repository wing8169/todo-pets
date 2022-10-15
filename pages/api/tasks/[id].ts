import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { Task } from "../../../interfaces";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const body: Task = req.body;
  const id: string =
    typeof req.query.id === "string"
      ? req.query.id
      : JSON.stringify(req.query.id);

  switch (method) {
    // GET tasks/:id returns a task by its ID
    case "GET":
      try {
        const existingTask = await prisma.task.findFirstOrThrow({
          where: {
            id: id,
          },
        });
        return res.status(200).json(existingTask);
      } catch (err) {
        console.log(err);
        return res.status(404).json({ err: "404 Not Found" });
      }
    // PATCH tasks/:id patches the task fields that are modifiable
    case "PATCH":
      try {
        const existingTask = await prisma.task.findFirstOrThrow({
          where: {
            id: id,
          },
        });
        // task exists, patches selected data only
        existingTask.dueAt = body.dueAt;
        existingTask.title = body.title;
        existingTask.status = body.status;
        existingTask.lastModifiedAt = new Date();
        // if a task is completed and not claimed yet, increase user's coins by 10
        if (existingTask.status && !existingTask.claimed) {
          // set claimed
          existingTask.claimed = true;
          // get user
          const user = await prisma.user.findFirstOrThrow({
            where: {
              ipAddress: existingTask.ipAddress,
            },
          });
          // update user's coins
          user.coins += 10;
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              ipAddress: user.ipAddress,
              coins: user.coins,
              pets: user.pets,
            },
          });
        }
        // update task
        await prisma.task.update({
          where: {
            id: existingTask.id,
          },
          data: {
            ipAddress: existingTask.ipAddress,
            title: existingTask.title,
            status: existingTask.status,
            deleted: existingTask.deleted,
            createdAt: existingTask.createdAt,
            lastModifiedAt: existingTask.lastModifiedAt,
            dueAt: existingTask.dueAt,
            claimed: existingTask.claimed,
          },
        });
        // return updated task
        return res.status(200).json(existingTask);
      } catch (err) {
        console.log(err);
        return res.status(404).json({ err: "404 Not Found" });
      }
    // DELETE tasks/:id deletes task by id (set deleted to true)
    case "DELETE":
      try {
        const existingTask = await prisma.task.findFirstOrThrow({
          where: {
            id: id,
          },
        });
        // task exists, patches selected data only
        existingTask.deleted = true;
        existingTask.lastModifiedAt = new Date();
        // update task
        await prisma.task.update({
          where: {
            id: existingTask.id,
          },
          data: {
            ipAddress: existingTask.ipAddress,
            title: existingTask.title,
            status: existingTask.status,
            deleted: existingTask.deleted,
            createdAt: existingTask.createdAt,
            lastModifiedAt: existingTask.lastModifiedAt,
            dueAt: existingTask.dueAt,
            claimed: existingTask.claimed,
          },
        });
        // return updated task
        return res.status(200).json(existingTask);
      } catch (err) {
        console.log(err);
        return res.status(404).json({ err: "404 Not Found" });
      }
    default:
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
