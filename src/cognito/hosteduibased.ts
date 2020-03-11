import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import * as fs from "fs";
const express = require("express");
const expressWs = require("express-ws");
const opn = require("opn");

const storage = require("node-persist");

const pathToJs = __filename.split("/");
pathToJs.splice(-3, 3);

interface Tokens {
  idToken: string;
  refreshToken: string;
  idTokenTTI: number;
  username: string;
}

const TokenStorage = {
  get: async (poolData: any): Promise<string> => {
    return await storage.getItem(`${poolData.UserPoolId}.${poolData.ClientId}`);
  },
  add: async (poolData: any, tokens: Tokens) => {
    return await storage.setItem(
      `${poolData.UserPoolId}.${poolData.ClientId}`,
      JSON.stringify(tokens)
    );
  }
};

const GetTokenAuthFlow = (setup: any): Promise<string> =>
  new Promise(resolve => {
    const config = fs.readFileSync(setup.hostedUI).toString();
    const poolData = {
      UserPoolId: JSON.parse(config).userPoolId,
      ClientId: JSON.parse(config).userPoolWebClientId
    };
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

        const idToken: string = JSON.parse(msg).idToken;
        const refreshToken: string = JSON.parse(msg).refreshToken;
        const idTokenTTI: number = +new Date() + 1800000; //now + 1/2 hour
        const username: string = JSON.parse(msg).username;

        TokenStorage.add(poolData, {
          idToken,
          idTokenTTI,
          refreshToken,
          username
        }).then(() => {
          resolve(idToken);
        });

      });
    });
    app.listen(3000);
    opn("http://localhost:3000");
  });

const RefreshToken = (token: string): any => ({
  token,
  getToken: () => token
});

const GetTokenFromPersistedCredentials = (data: string, poolData: any) =>
  new Promise<string>((resolve, reject) => {
    const tokens: Tokens = JSON.parse(data);
    const now: number = +new Date();
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: tokens.username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    if (now > tokens.idTokenTTI) {
      cognitoUser.refreshSession(
        RefreshToken(tokens.refreshToken),
        (err, result) => {
          if (err) {
            reject("Error");
          } else {
            const idToken: string = result.idToken.jwtToken;
            const refreshToken: string = result.refreshToken.token;
            const idTokenTTI: number = +new Date() + 1800000; //now + 1/2 hour

            TokenStorage.add(poolData, {
              idToken,
              idTokenTTI,
              refreshToken,
              username: tokens.username
            }).then(() => {
              resolve(idToken);
            });
          }
        }
      );
    } else {
      resolve(tokens.idToken);
    }
  });

const getTokenFromHostedUI = async (data: any): Promise<string> => {
  const config = fs.readFileSync(data.hostedUI).toString();
  const poolData = {
    UserPoolId: JSON.parse(config).userPoolId,
    ClientId: JSON.parse(config).userPoolWebClientId
  };

  await storage.init({ dir: data.storage ? data.storage : "/var/tmp" });

  return !data.reset
    ? TokenStorage.get(poolData)
        .then((data: any) => GetTokenFromPersistedCredentials(data, poolData))
        .catch(async () => GetTokenAuthFlow(data))
    : GetTokenAuthFlow(data);
};

export { getTokenFromHostedUI };