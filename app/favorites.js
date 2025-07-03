import React from "react";
import { Container, Header, Placeholder } from "../components";

export default function FavoritesScreen() {
  return (
    <Container>
      <Header
        title="Favorites"
        subtitle="Your saved recipes"
        titleSize="xxlarge"
        subtitleSize="medium"
      />

      <Placeholder message="Favorites coming soon..." />
    </Container>
  );
}
