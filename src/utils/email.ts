import { SESClient } from '@aws-sdk/client-ses';

let client: SESClient;

export const getEmailClient = () => {
  if (!client) {
    client = new SESClient({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
  }

  return client;
};
