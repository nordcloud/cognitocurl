import { getTokenFromCLI } from "./clibased";

const getToken = ({ ...setup }: any): Promise<string> => getTokenFromCLI(setup);

export { getToken };
