import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../interfaces";
import pets from "../../public/pokemons.json";
import prisma from "../../prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const body: User = req.body;

  switch (method) {
    // POST wish will draw user a random pet (from pokemons.json)
    case "POST":
      // check if user exists already
      const existingUser = await prisma.user.findFirstOrThrow({
        where: {
          ipAddress: body.ipAddress,
        },
      });
      // check if user has enough coins
      if (existingUser.coins < 5)
        return res.status(400).end("You do not have sufficient coins!");
      // draw a random pet
      const petNames = Object.keys(pets);
      const randomPet = petNames[Math.floor(Math.random() * petNames.length)];
      // add the pet into user pets
      existingUser.coins -= 5;
      existingUser.pets.push(randomPet);
      existingUser.pets = existingUser.pets.sort();
      // update the user
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          ipAddress: existingUser.ipAddress,
          coins: existingUser.coins,
          pets: existingUser.pets,
        },
      });
      // emit socket event to notify all users on the update
      // TODO: Send to the user only
      try {
        // @ts-ignore
        res.socket.server.io.emit("user", existingUser);
      } catch (err) {
        console.log(err);
      }
      // return ok
      return res.status(200).json({ pet: randomPet });
    default:
      // Method not allowed
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
