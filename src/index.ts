import { Command, flags } from "@oclif/command";
import { getToken } from "./cognito";
import { exec } from "child_process";
import fetch from "node-fetch";

declare var global: any;
global.fetch = fetch;

class cognitocurl extends Command {
  static description = "describe the command here";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help(),
    userpool: flags.string({ description: "Congito User Pool ID" }),
    cognitoclient: flags.string({ description: "Cognito Client App ID" }),
    reset: flags.boolean({ description: "Reset Cognito credentials" }),
    hostedui: flags.string({
      description:
        "Point to json with hosted ui config. If set, hosted ui will be launched."
    }),
    storage: flags.string({
      description: "Persistent storage catalogue. Defaults to '/var/tmp'. "
    }),
    header: flags.string({
      description:
        "Name HTTP header with authorization token. Defaults to 'Authorization'"
    }),
    run: flags.string({
      description: "Command to be runned and  sign with -H Autorization token"
    }),
    token: flags.boolean({
      description: "Token to stdout instead of running a curl command"
    }),
    username: flags.string({ description: "Congito User name" }),
    password: flags.string({ description: "Congito User password" }),
  };

  static strict = false;

  async run() {
    const { flags } = this.parse(cognitocurl);

    const cognitoSetup = {
      UserPoolId: flags.userpool,
      ClientId: flags.cognitoclient,
      reset: flags.reset,
      storage: flags.storage,
      Username: flags.username,
      Password: flags.password
    };

    const { run: command, header = "Authorization", hostedui, token } = flags;

    try {
      const cognitoToken: string = hostedui
        ? await getToken({
           hostedUI: hostedui,
           reset: flags.reset, // Tokens locally persisted will not be considered, but idToken persisted on browser localStorage may still be valid.
           storage: flags.storage
         })
        : await getToken(cognitoSetup);
      if (token) {
        this.log(cognitoToken);
        process.exit(0);
      } else {
        const signedCommand = `${command} -H '${header}: ${cognitoToken}' -s`;
        exec(signedCommand, (err, stdout, stderr) => {
          this.log(stdout, stderr);
          process.exit();
        });
      }
    } catch (error) {
      this.log(error);
      return true;
    }
  }
}

export = cognitocurl;
