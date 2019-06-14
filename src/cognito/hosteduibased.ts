import * as fs from "fs";
const express = require("express");
const expressWs = require("express-ws");
const opn = require("opn");

const pathToJs = __filename.split("/");
pathToJs.splice(-3, 3);

const getTokenFromHostedUI = (setup: any): Promise<string> =>
  new Promise(resolve => {
    const config = fs.readFileSync(setup.hostedUI).toString();
    const app = express();
    expressWs(app);
    app.use(express.static(pathToJs.join("/") + "/hostedui/dist"));
    app.get("/", (req: any, res: any) =>
      res.send(
        `<!DOCTYPE html><html><head><script>var amplifyCognitoConfig = ${config};var socket = "ws://localhost:3000";</script></head><body><div id="app"></div><script src="./cognitohosteduilauncher.js"></script></body></html>`
      )
    );
    app.ws("/", function(ws: any) {
      ws.on("message", function(msg: any) {
        resolve(msg);
      });
    });
    app.listen(3000);
    opn("http://localhost:3000");
  });

export { getTokenFromHostedUI };
