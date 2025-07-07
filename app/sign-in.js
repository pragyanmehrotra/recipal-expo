import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Container, Text, Header, Button, Input, Divider } from "../components";
import { useAuth } from "../hooks/auth";

export default function SignInScreen({ onNavigateToSignUp, onSignInSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsLoading(true);

    const result = await signIn(email, password);

    if (!result.success) {
      Alert.alert("Error", result.error || "Sign in failed");
    } else if (onSignInSuccess) {
      onSignInSuccess();
    }

    setIsLoading(false);
  };

  return (
    <Container padding="large">
      <Header
        title="Welcome Back"
        subtitle="Sign in to your account"
        titleSize="xxlarge"
        subtitleSize="medium"
        textAlign="center"
        marginTop={40}
        marginBottom={40}
      />
      <View style={styles.form}>
        <Input
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoComplete="password"
        />
        <Button
          title={isLoading ? "Signing In..." : "Sign In"}
          onPress={handleSignIn}
          disabled={isLoading}
          style={styles.signInButton}
        />
      </View>
      <Divider margin="large" />
      <View style={styles.footer}>
        <Text
          variant="body"
          size="medium"
          color="muted"
          style={{ textAlign: "center" }}
        >
          Don't have an account?
        </Text>
        <Button
          title="Create Account"
          variant="ghost"
          size="medium"
          onPress={onNavigateToSignUp}
          style={styles.signUpButton}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: { marginBottom: 20 },
  signInButton: { marginTop: 20 },
  footer: { alignItems: "center" },
  signUpButton: { marginTop: 10 },
});
