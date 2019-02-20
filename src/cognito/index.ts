import { getTokenFromCLI } from "./clibased";
import { getTokenFromHostedUI } from "./hosteduibased";

const getToken = (setup: any): Promise<string> =>
  setup.hostedUI ? getTokenFromHostedUI(setup) : getTokenFromCLI(setup);

export { getToken };
