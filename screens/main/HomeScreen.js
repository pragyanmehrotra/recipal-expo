import React from "react";
import { ActivityIndicator } from "react-native";
import { useAuth, SignOutButton } from "@clerk/clerk-expo";
import { YStack, XStack, Text, Button, Card, H1, H2, Separator } from "tamagui";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" space="$4">
      {/* Header */}
      <YStack space="$2" marginTop="$6">
        <H1 color="$color" textAlign="center">
          Welcome to ReciPal!
        </H1>
        <Text fontSize="$5" color="$color" textAlign="center" opacity={0.8}>
          Your personal meal planner
        </Text>
      </YStack>

      {/* Welcome Message */}
      <Card
        backgroundColor="$color2"
        padding="$4"
        borderRadius="$4"
        borderColor="$borderColor"
        borderWidth={1}
      >
        <Text fontSize="$5" color="$color" textAlign="center" fontWeight="600">
          Hello, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
        </Text>
      </Card>

      {/* Menu Items */}
      <YStack space="$3" flex={1}>
        <Button
          backgroundColor="$primary"
          color="$color12"
          fontSize="$5"
          fontWeight="600"
          padding="$4"
          borderRadius="$4"
          pressStyle={{ backgroundColor: "$primary", opacity: 0.8 }}
        >
          🔍 Search Recipes
        </Button>

        <Button
          backgroundColor="$secondary"
          color="$color12"
          fontSize="$5"
          fontWeight="600"
          padding="$4"
          borderRadius="$4"
          pressStyle={{ backgroundColor: "$secondary", opacity: 0.8 }}
        >
          📅 My Meal Plans
        </Button>

        <Button
          backgroundColor="$accent"
          color="$color12"
          fontSize="$5"
          fontWeight="600"
          padding="$4"
          borderRadius="$4"
          pressStyle={{ backgroundColor: "$accent", opacity: 0.8 }}
        >
          🛒 Grocery Lists
        </Button>

        <Button
          backgroundColor="$color4"
          color="$color12"
          fontSize="$5"
          fontWeight="600"
          padding="$4"
          borderRadius="$4"
          pressStyle={{ backgroundColor: "$color4", opacity: 0.8 }}
        >
          ❤️ Favorites
        </Button>
      </YStack>

      {/* Footer */}
      <YStack space="$3">
        <Separator backgroundColor="$borderColor" />
        <SignOutButton>
          <Button
            backgroundColor="$color3"
            color="$color"
            fontSize="$4"
            fontWeight="500"
            padding="$3"
            borderRadius="$4"
            pressStyle={{ backgroundColor: "$color4" }}
          >
            Sign Out
          </Button>
        </SignOutButton>
      </YStack>
    </YStack>
  );
}
