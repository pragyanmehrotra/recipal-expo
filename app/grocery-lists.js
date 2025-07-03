import React from "react";
import { Container, Header, Placeholder } from "../components";

export default function GroceryListsScreen() {
  return (
    <Container>
      <Header
        title="Grocery Lists"
        subtitle="Manage your shopping lists"
        titleSize="xxlarge"
        subtitleSize="medium"
      />

      <Placeholder message="Grocery lists coming soon..." />
    </Container>
  );
}
