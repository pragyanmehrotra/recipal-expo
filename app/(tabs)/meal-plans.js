import React from "react";
import { Container, Header, Placeholder } from "../../components";

export default function MealPlansScreen() {
  return (
    <Container>
      <Header
        title="My Meal Plans"
        subtitle="Plan your weekly meals"
        titleSize="xxlarge"
        subtitleSize="medium"
      />

      <Placeholder message="Meal planning coming soon..." />
    </Container>
  );
}
