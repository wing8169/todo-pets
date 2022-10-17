import type { NextApiRequest, NextApiResponse } from "next";
import { Task } from "../../../interfaces";
import prisma from "../../../prisma/prisma";

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
    // PATCH tasks/:id patches the task fields
    case "PATCH":
      try {
        const existingTask = await prisma.task.findFirstOrThrow({
          where: {
            id: id,
          },
        });
        // task exists, patches selected data only
        if (!!body.dueAt) existingTask.dueAt = body.dueAt;
        if (!!body.title) existingTask.title = body.title;
        existingTask.status = body.status;
        existingTask.lastModifiedAt = new Date();
        // if a task is completed and not claimed yet, increase user's coins by 10
        if (existingTask.status && !existingTask.claimed) {
          // set claimed
          existingTask.claimed = true;
          // get user
          const user = await prisma.user.findFirstOrThrow({
            where: {
              id: existingTask.user,
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
          // emit socket event to notify all users on the update
          try {
            // @ts-ignore
            res.socket.server.io.emit("user", {
              self: `/user/${user.id}`,
              id: user.id,
              ipAddress: user.ipAddress,
              coins: user.coins,
              pets: user.pets.map((pet) => ({
                self: `https://pokemondb.net/pokedex/${pet.toLowerCase()}`,
                name: pet,
              })),
              newPet: `/user/${user.id}/pet`,
            });
          } catch (err) {
            console.log(err);
          }
        }
        // update task
        await prisma.task.update({
          where: {
            id: existingTask.id,
          },
          data: {
            user: existingTask.user,
            title: existingTask.title,
            status: existingTask.status,
            deleted: existingTask.deleted,
            createdAt: existingTask.createdAt,
            lastModifiedAt: existingTask.lastModifiedAt,
            dueAt: existingTask.dueAt,
            claimed: existingTask.claimed,
          },
        });
        // emit socket event to notify all users on the update
        try {
          // @ts-ignore
          res.socket.server.io.emit("task", {
            self: `/task/${existingTask.id}`,
            id: existingTask.id,
            user: `/user/${existingTask.user}`,
            title: existingTask.title,
            status: existingTask.status,
            deleted: existingTask.deleted,
            createdAt: existingTask.createdAt,
            lastModifiedAt: existingTask.lastModifiedAt,
            dueAt: existingTask.dueAt,
            claimed: existingTask.claimed,
          });
        } catch (err) {
          console.log(err);
        }
        // return updated task
        return res.status(200).json({
          self: `/task/${existingTask.id}`,
          id: existingTask.id,
          user: `/user/${existingTask.user}`,
          title: existingTask.title,
          status: existingTask.status,
          deleted: existingTask.deleted,
          createdAt: existingTask.createdAt,
          lastModifiedAt: existingTask.lastModifiedAt,
          dueAt: existingTask.dueAt,
          claimed: existingTask.claimed,
        });
      } catch (err) {
        console.log(err);
        return res.status(404).json({ err: "Task or User Not Found" });
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
            user: existingTask.user,
            title: existingTask.title,
            status: existingTask.status,
            deleted: existingTask.deleted,
            createdAt: existingTask.createdAt,
            lastModifiedAt: existingTask.lastModifiedAt,
            dueAt: existingTask.dueAt,
            claimed: existingTask.claimed,
          },
        });
        // emit socket event to notify all users on the update
        try {
          // @ts-ignore
          res.socket.server.io.emit("task", {
            self: `/task/${existingTask.id}`,
            id: existingTask.id,
            user: `/user/${existingTask.user}`,
            title: existingTask.title,
            status: existingTask.status,
            deleted: existingTask.deleted,
            createdAt: existingTask.createdAt,
            lastModifiedAt: existingTask.lastModifiedAt,
            dueAt: existingTask.dueAt,
            claimed: existingTask.claimed,
          });
        } catch (err) {
          console.log(err);
        }
        // return updated task
        return res.status(200).json({
          self: `/task/${existingTask.id}`,
          id: existingTask.id,
          user: `/user/${existingTask.user}`,
          title: existingTask.title,
          status: existingTask.status,
          deleted: existingTask.deleted,
          createdAt: existingTask.createdAt,
          lastModifiedAt: existingTask.lastModifiedAt,
          dueAt: existingTask.dueAt,
          claimed: existingTask.claimed,
        });
      } catch (err) {
        console.log(err);
        return res.status(404).json({ err: "Task Not Found" });
      }
    default:
      res.setHeader("Allow", ["PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
