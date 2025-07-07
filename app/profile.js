import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Container, Header, Button, Text, Card, Divider } from "../components";
import { useAuth } from "../hooks/auth";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  if (!user) {
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
            {user?.name || user?.email}
          </Text>
          <Text variant="body" size="medium" color="muted" style={styles.email}>
            {user?.email}
          </Text>
          <Text
            variant="body"
            size="medium"
            color="muted"
            style={styles.detail}
          >
            User ID: {user?.id}
          </Text>
        </Card>
        <Divider margin="large" />
        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            variant="outline"
            size="large"
            onPress={() => {}}
            style={styles.actionButton}
          />
          <Button
            title="Settings"
            variant="outline"
            size="large"
            onPress={() => {}}
            style={styles.actionButton}
          />
        </View>
        <Divider margin="large" />
        <Button
          title="Sign Out"
          variant="primary"
          size="large"
          style={styles.signOutButton}
          onPress={handleSignOut}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  profileCard: { marginBottom: 20 },
  name: { marginBottom: 8, textAlign: "center" },
  email: { marginBottom: 16, textAlign: "center" },
  detail: { marginBottom: 8 },
  actions: { marginBottom: 20 },
  actionButton: { marginBottom: 12 },
  signOutButton: { marginTop: 20 },
});
