import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
  baseUrl: string;
  name: string;
  email: string;
  code: string;
}

export function VerificationEmail({
  baseUrl,
  name,
  email,
  code,
}: VerificationEmailProps) {
  const url = `${baseUrl}/user/verify?email=${email}&code=${code}`;

  return (
    <Html lang="en">
      <Head>
        <title>Verify your email!</title>
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/dmsans/v13/rP2Hp2ywxg089UriCZOIHQ.woff2',
            format: 'woff2',
          }}
        />
      </Head>
      <Preview>Verify your email address</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded mt-[40px] mb-[5px] mx-auto p-[20px] w-[465px]">
            <Section>
              <Heading>Verify your email!</Heading>
              <Text className="text-lg">
                Hello
                {name}
                !,
              </Text>
              <Text className="text-lg">
                Thank you for signing up! Please click the button below to verify your
                email address.
              </Text>
              <Button
                href={url}
                className="bg-black font-bold text-white px-[20px] py-[10px] rounded mt-[10px]"
              >
                Verify
              </Button>
            </Section>
            <Section className="flex justify-center mt-[20px]">
              <Text className="text-gray-600">
                If you did not request this email, please ignore it.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
