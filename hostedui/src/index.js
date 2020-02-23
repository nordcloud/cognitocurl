import Amplify, { Auth, Hub, Logger } from "aws-amplify";

const jsonConfig = window.amplifyCognitoConfig;
const socketUrl = window.socket;

const oauth = {
  domain: jsonConfig.domain,
  scope: ["email"],
  redirectSignIn: jsonConfig.redirectSignIn,
  redirectSignOut: jsonConfig.redirectSignOut,
  responseType: "code",
  options: {
    AdvancedSecurityDataCollectionFlag: true
  }
};

export const amplifyConfig = {
  Auth: {
    identityPoolId: jsonConfig.identityPoolId,
    region: jsonConfig.region,
    userPoolId: jsonConfig.userPoolId,
    userPoolWebClientId: jsonConfig.userPoolWebClientId,
    mandatorySignIn: true,
    oauth: oauth
  }
};

Auth.configure(amplifyConfig);

const { domain, redirectSignIn, redirectSignOut, responseType } = oauth;

const sendToSocket = message => {
  const socketConnection = new WebSocket(socketUrl, "echo-protocol");
  socketConnection.onopen = function(event) {
    socketConnection.send(message);
    socketConnection.close();
    window.close();
  };
};

const OAuthSignIn = () =>
  window.location.assign(
    "https://" +
      domain +
      "/oauth2/authorize?redirect_uri=" +
      redirectSignIn +
      "&response_type=" +
      responseType +
      "&client_id=" +
      jsonConfig.userPoolWebClientId +
      "&identity_provider=Google"
  );

const checkCurrentUser = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const hasAuthCode = urlParams.get("code");

  Auth.currentSession()
    .then(e => {
      const tokens = {
          idToken: e.getIdToken().jwtToken,
          refreshToken: e.refreshToken.token,
          username: e.getAccessToken().payload.username
      };
      sendToSocket(JSON.stringify(tokens));
    })
    .catch(e => {
      if (hasAuthCode) {
        const alex = new Logger("Alexander_the_auth_watcher");
        alex.onHubCapsule = capsule => {
          switch (capsule.payload.event) {
            case "signIn":
              checkCurrentUser();
              break;
            case "configured":
              alex.error("the Auth module is configured");
              break;
            default:
              break;
          }
        };
        Hub.listen("auth", alex);
      } else {
        OAuthSignIn();
      }
    });
};

checkCurrentUser();
