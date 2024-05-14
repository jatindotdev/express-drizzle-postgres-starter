import {
  Body,
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

interface UserVerifiedProps {
  status: 'verified' | 'invalid';
  message: string;
  error?: string;
}

export function UserVerified({ status, message, error }: UserVerifiedProps) {
  if (!error)
    error = 'Unknown error';

  return (
    <Html lang="en">
      <Head>
        <title>
          {status === 'verified'
            ? 'Email verified!'
            : status === 'invalid'
              ? error
              : 'Unknown error'}
        </title>
        <Font
          fontFamily="DM Sans"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/dmsans/v13/rP2Hp2ywxg089UriCZOIHQ.woff2',
            format: 'woff2',
          }}
        />
      </Head>
      <Preview>
        {status === 'verified'
          ? 'Email verified!'
          : status === 'invalid'
            ? error
            : 'Unknown error'}
      </Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container
            className="border border-solid border-[#eaeaea] rounded mt-[40px] mb-[5px] mx-auto p-[20px] w-[465px] rounded-lg"
          >
            <Section>
              <Heading>
                {status === 'verified'
                  ? 'Email verified!'
                  : status === 'invalid'
                    ? error
                    : 'Unknown error'}
              </Heading>
              <Text className="text-lg">{message}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
