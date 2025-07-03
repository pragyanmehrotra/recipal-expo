import React from "react";
import { useRouter } from "expo-router";
import { Container, Header, Placeholder, Button } from "../components";

export default function VerifyEmailScreen() {
  const router = useRouter();

  return (
    <Container>
      <Header
        title="Verify Email"
        subtitle="Check your email to continue"
        titleSize="xxlarge"
        subtitleSize="medium"
      />

      <Placeholder message="Email verification coming soon..." />

      <Button
        title="← Back to Home"
        variant="ghost"
        size="medium"
        onPress={() => router.push("/")}
      />
    </Container>
  );
}
