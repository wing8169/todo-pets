import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

// sockets handler initializes socket io server if it does not exist yet
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  if (!res.socket.server.io) {
    console.log("Socket is initializing");
    // @ts-ignore
    const io = new Server(res.socket.server);
    // @ts-ignore
    res.socket.server.io = io;
  }
  res.end();
};

export default handler;
