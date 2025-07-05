import React from "react";
import { View, StyleSheet } from "react-native";
import { useAuth, SignOutButton } from "@clerk/clerk-expo";
import { Container, Header, Button, Text, Card, Divider } from "../components";

export default function ProfileScreen() {
  const { user, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <Container>
        <Text
          variant="body"
          size="large"
          color="muted"
          style={{ textAlign: "center" }}
        >
          Loading...
        </Text>
      </Container>
    );
  }

  return (
    <Container padding="large">
      <Header
        title="Profile"
        subtitle="Manage your account"
        titleSize="xxlarge"
        subtitleSize="medium"
        textAlign="center"
        marginTop={40}
        marginBottom={40}
      />

      <View style={styles.content}>
        <Card
          padding="large"
          backgroundColor="secondary"
          style={styles.profileCard}
        >
          <Text
            variant="title"
            size="large"
            color="primary"
            style={styles.name}
          >
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </Text>

          <Text variant="body" size="medium" color="muted" style={styles.email}>
            {user?.emailAddresses[0]?.emailAddress}
          </Text>

          {user?.firstName && (
            <Text
              variant="body"
              size="medium"
              color="muted"
              style={styles.detail}
            >
              Name: {user.firstName} {user.lastName}
            </Text>
          )}

          <Text
            variant="body"
            size="medium"
            color="muted"
            style={styles.detail}
          >
            Member since: {new Date(user?.createdAt).toLocaleDateString()}
          </Text>
        </Card>

        <Divider margin="large" />

        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            variant="outline"
            size="large"
            onPress={() => {
              // TODO: Implement profile editing
            }}
            style={styles.actionButton}
          />

          <Button
            title="Settings"
            variant="outline"
            size="large"
            onPress={() => {
              // TODO: Implement settings
            }}
            style={styles.actionButton}
          />
        </View>

        <Divider margin="large" />

        <SignOutButton>
          <Button
            title="Sign Out"
            variant="primary"
            size="large"
            style={styles.signOutButton}
          />
        </SignOutButton>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  profileCard: {
    marginBottom: 20,
  },
  name: {
    marginBottom: 8,
    textAlign: "center",
  },
  email: {
    marginBottom: 16,
    textAlign: "center",
  },
  detail: {
    marginBottom: 8,
  },
  actions: {
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 12,
  },
  signOutButton: {
    marginTop: 20,
  },
});
