import Koa from "koa";
import { Server } from "http";
import { WebSocketServer } from "ws";
import { resolve } from "path";
import dir from "koa-static";
import inquirer from "inquirer";

import { handleWebcast } from "./api";

inquirer
  .prompt([
    {
      type: "input",
      message: "输入直播房间号",
      name: "roomId",
    },
  ])
  .then(run);
function run({ roomId }: { roomId: string }) {
  roomId = roomId.trim();
  const app = new Koa();
  app.use(dir(resolve(__dirname, "../public")));
  const server = new Server(app.callback());
  const io = new WebSocketServer({ server });
  const sockets = [];
  handleWebcast(roomId, (name, content, html) => {
    // console.log(name, content);
    const data = JSON.stringify({ name, content, html });
    io.clients.forEach((client) => {
      client.send(data);
    });
  });
  io.on("connection", (socket) => {
    sockets.push(socket);
  });
  server.listen(8888, () => {
    console.log(`DEMO: http://localhost:8888`);
    console.log(`等待初始化...`);
  });
}
