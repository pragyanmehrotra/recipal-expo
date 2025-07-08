import React from "react";
import { Container, Header, Placeholder } from "../../components";

export default function BrowseRecipesScreen() {
  return (
    <Container>
      <Header
        title="Browse Recipes"
        subtitle="Discover and search for delicious meals"
        titleSize="xxlarge"
        subtitleSize="medium"
      />

      <Placeholder message="Recipe search coming soon..." />
    </Container>
  );
}
