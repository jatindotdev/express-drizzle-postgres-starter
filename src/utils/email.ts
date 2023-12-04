import { SESClient } from "@aws-sdk/client-ses";
import { AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_ACCESS_KEY } from "./config";

let client: SESClient;

export const getEmailClient = () => {
  if (!client) {
    client = new SESClient({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  return client;
};
