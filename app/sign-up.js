import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Container, Text, Header, Button, Input, Divider } from "../components";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        // Navigation will be handled by AuthGate in _layout.js
      } else {
        // Handle email verification
        Alert.alert(
          "Check Your Email",
          "We've sent you a verification email. Please check your inbox and click the verification link."
        );
        router.push("/verify-email");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", error.errors?.[0]?.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

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
        title="Create Account"
        subtitle="Join ReciPal to start planning your meals"
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
          placeholder="Password (min 8 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoComplete="new-password"
        />

        <Input
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          autoComplete="new-password"
        />

        <Button
          title={isLoading ? "Creating Account..." : "Create Account"}
          onPress={handleSignUp}
          disabled={isLoading}
          style={styles.signUpButton}
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
          Already have an account?
        </Text>
        <Button
          title="Sign In"
          variant="ghost"
          size="medium"
          onPress={handleSignIn}
          style={styles.signInButton}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 20,
  },
  signUpButton: {
    marginTop: 20,
  },
  footer: {
    alignItems: "center",
  },
  signInButton: {
    marginTop: 10,
  },
});
