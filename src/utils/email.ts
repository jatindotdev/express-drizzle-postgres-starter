import process from 'node:process';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { render } from '@react-email/render';
import { VerificationEmail } from '@/templates/verification-email';

let client: SESClient;

export function getEmailClient() {
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
}

export async function sendVerificationEmail(baseUrl: string, name: string, email: string, code: string) {
  try {
    const client = getEmailClient();
    const { FROM_NAME, FROM_EMAIL } = process.env;

    const emailHtml = render(VerificationEmail({ baseUrl, name, email, code }));

    const params = {
      Source: `${FROM_NAME} <${FROM_EMAIL}>`,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Verify your email!',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailHtml,
          },
        },
      },
    };

    const command = new SendEmailCommand(params);

    const res = await client.send(command);
    return res.$metadata.httpStatusCode;
  }
  catch (_err) {
    return 500;
  }
}
