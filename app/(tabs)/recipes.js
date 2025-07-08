import React from "react";
import { Container, Header, Placeholder } from "../../components";

export default function RecipesScreen() {
  return (
    <Container>
      <Header
        title="Search Recipes"
        subtitle="Find delicious meals to cook"
        titleSize="xxlarge"
        subtitleSize="medium"
      />

      <Placeholder message="Recipe search coming soon..." />
    </Container>
  );
}
