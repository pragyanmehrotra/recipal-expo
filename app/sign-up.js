import React from "react";
import { Container, Text, Header } from "../components";

export default function SignUpScreen() {
  return (
    <Container>
      <Header
        title="Sign Up"
        subtitle="Authentication coming soon"
        titleSize="xxlarge"
        subtitleSize="medium"
      />
      <Text
        variant="body"
        size="medium"
        color="muted"
        style={{ textAlign: "center" }}
      >
        This feature is not yet implemented.
      </Text>
    </Container>
  );
}
