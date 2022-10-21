import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../interfaces";
import prisma from "../../prisma/prisma";

// search query type
class SearchQueryDto {
  sort?: string;
  ipAddress?: string;
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
      try {
        const { sort, ipAddress, offset, limit } = query;

        // populate prisma query
        const prismaQuery: any = {};
        // sorting
        if (!!sort) {
          // parse sort data
          const sortArray = sort.split(",");
          const orderBy = sortArray.map((sorter) => {
            const order = sorter.slice(0, 1) === "-" ? "desc" : "asc";
            return { [sorter.slice(1)]: order };
          });
          prismaQuery["orderBy"] = orderBy;
        }
        // filtering
        if (!!ipAddress) {
          prismaQuery["where"] = {
            ipAddress,
          };
        }
        // pagination
        if (!!offset) {
          prismaQuery["skip"] = Number(offset);
        }
        if (!!limit) {
          prismaQuery["take"] = Number(limit);
        }
        const results = await prisma.user.findMany(prismaQuery);
        // format contents
        const contents = results.map((result) => {
          return {
            self: `/user/${result.id}`,
            id: result.id,
            ipAddress: result.ipAddress,
            coins: result.coins,
            pets: result.pets.map((pet) => ({
              self: `https://pokemondb.net/pokedex/${pet.toLowerCase()}`,
              name: pet,
            })),
            newPet: `/user/${result.id}/pet`,
            newFreePet: `/user/${result.id}/newpet`,
          };
        });

        return res.status(200).json({
          self: "User[]",
          contents,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "Internal Server Error" });
      }
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
        if (!!existingUser)
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
            newFreePet: `/user/${existingUser.id}/newpet`,
          });
        // user does not exist, create a new user
        const user = await prisma.user.create({
          data: {
            ipAddress: body.ipAddress,
            coins: 0,
            pets: [],
          },
        });
        // return ok
        return res.status(201).json({
          self: `/user/${user.id}`,
          id: user.id,
          ipAddress: user.ipAddress,
          coins: 0,
          pets: [],
          newPet: `/user/${user.id}/pet`,
          newFreePet: `/user/${user.id}/newpet`,
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
