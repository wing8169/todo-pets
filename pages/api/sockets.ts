import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // @ts-ignore
  if (!res.socket.server.io) {
    console.log("Socket is initializing");
    // @ts-ignore
    const io = new Server(res.socket.server);
    console.log(io);

    io.on("connection", (socket) => {
      console.log("halo");
      socket.broadcast.emit("a user connected");
      socket.on("hello", (msg) => {
        socket.emit("hello", "world!");
      });
    });

    // @ts-ignore
    res.socket.server.io = io;
  }
  res.end();
};

export default handler;
