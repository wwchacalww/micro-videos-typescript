import { config as readEnv } from "dotenv";
import { join } from "path";

function makeConfig(envFile) {
  const output = readEnv({ path: envFile });
  return {
    db: {
      host: output.parsed.DB_HOST,
      vendor: output.parsed.DB_VENDOR as any,
      logging: output.parsed.DB_LOGGING === "true",
    },
  };
}

const envTestingFile = join(__dirname, "../../../../.env.testing");
export const configTest = makeConfig(envTestingFile);
