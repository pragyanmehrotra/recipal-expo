import React from "react";
import { Container, Header, Button } from "../components";

export default function ProfileScreen() {
  return (
    <Container>
      <Header
        title="Profile"
        subtitle="Manage your account"
        titleSize="xxlarge"
        subtitleSize="medium"
      />
      <Button
        title="Log Out"
        variant="primary"
        size="large"
        style={{ marginTop: 40 }}
        onPress={() => {}}
      />
    </Container>
  );
}
