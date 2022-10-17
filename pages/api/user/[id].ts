import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

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
        // format response
        return res.status(200).json({
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
        return res.status(404).json({ err: "User Not Found" });
      }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
