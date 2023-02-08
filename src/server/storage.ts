import { S3Client } from "@aws-sdk/client-s3";
import { env } from "@env/server.mjs";

export const R2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_CLIENT_ID,
    secretAccessKey: env.R2_CLIENT_SECRET,
  },
});
