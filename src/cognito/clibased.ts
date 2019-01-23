import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import cli from "cli-ux";

const storage = require("node-persist");

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

const GetTokenFromInput = async (poolData: any): Promise<string> => {
  const username = await cli.prompt("Username");
  const password = await cli.prompt("Password", { type: "hide" });
  const authenticationData = {
    Username: username,
    Password: password
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: username,
    Pool: userPool
  };
  const cognitoUser = new CognitoUser(userData);

  return new Promise<string>((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result: any) {
        const idToken: string = result.idToken.jwtToken;
        const refreshToken: string = result.refreshToken.token;
        const idTokenTTI: number = +new Date() + 1800000; //now + 1/2 hour

        TokenStorage.add(poolData, {
          idToken,
          idTokenTTI,
          refreshToken,
          username
        }).then(() => {
          resolve(idToken);
        });
      },
      onFailure: function(err) {
        reject(err);
      }
    });
  });
};

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

const getTokenFromCLI = async (data: any): Promise<string> => {
  const poolData = data;

  storage.init({ dir: data.storage ? data.storage : "/var/tmp" });

  return !data.reset
    ? TokenStorage.get(data)
        .then((data: any) => GetTokenFromPersistedCredentials(data, poolData))
        .catch(async () => GetTokenFromInput(data))
    : GetTokenFromInput(data);
};

export { getTokenFromCLI };
