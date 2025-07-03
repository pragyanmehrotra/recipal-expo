import React from "react";
import { Container, Text, Header } from "../components";

export default function HomeScreen() {
  return (
    <Container>
      <Header
        title="Welcome to ReciPal!"
        subtitle="Your personal meal planner"
        titleSize="xxlarge"
        subtitleSize="medium"
        marginTop={60}
        marginBottom={40}
      />
      <Text
        variant="body"
        size="large"
        color="muted"
        style={{ textAlign: "center", marginTop: 40 }}
      >
        Use the tabs below to explore recipes, meal plans, grocery lists, and
        your favorites!
      </Text>
    </Container>
  );
}
