import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../../interfaces";
import pets from "../../../../public/pokemons.json";
import prisma from "../../../../prisma/prisma";

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
    // POST pet will draw user a random pet (from pokemons.json) and return the pet
    case "POST":
      try {
        // check if user exists already
        const existingUser = await prisma.user.findFirstOrThrow({
          where: {
            id: id,
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
        try {
          // @ts-ignore
          res.socket.server.io.emit("user", {
            self: `/user/${existingUser.id}`,
            id: existingUser.id,
            ipAddress: existingUser.ipAddress,
            coins: existingUser.coins,
            pets: existingUser.pets.map((pet) => ({
              self: `https://pokemondb.net/pokedex/${pet.toLowerCase()}`,
              name: pet,
            })),
            newPet: `/user/${existingUser.id}/pet`,
          });
        } catch (err) {
          console.log(err);
        }
        // return ok
        return res.status(200).json({
          self: `https://pokemondb.net/pokedex/${randomPet.toLowerCase()}`,
          name: randomPet,
        });
      } catch (err) {
        console.log(err);
        res.status(404).end(`User Not Found`);
      }

    default:
      // Method not allowed
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
