import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Container, Text, Header, Button, Input, Divider } from "../components";
import { useAuth } from "../hooks/auth";

export default function SignInScreen({
  onNavigateToSignUp,
  onSignInSuccess,
  onVerificationNeeded,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsLoading(true);

    const result = await signIn(email, password);

    if (!result.success) {
      Alert.alert("Sign In Failed", result.error || "Sign in failed.", [
        {
          text: "OK",
          style: "default",
        },
      ]);
    } else {
      router.replace("/");
      if (onSignInSuccess) {
        onSignInSuccess();
      }
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
        marginTop={36}
        marginBottom={28}
      />
      <View style={styles.form}>
        <Input
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          style={styles.input}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoComplete="password"
          style={[styles.input, styles.passwordInput]}
        />
        <Button
          title={isLoading ? "Signing In..." : "Sign In"}
          onPress={handleSignIn}
          disabled={isLoading}
          style={styles.signInButton}
        />
        <TouchableOpacity
          onPress={() => router.push("/reset-password")}
          style={styles.forgotPasswordLink}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <Divider margin="large" style={styles.divider} />
      <View style={styles.footerSpacer} />
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
  form: { marginBottom: 0 },
  input: {
    marginBottom: 16,
  },
  signInButton: { marginTop: 20, marginBottom: 12 },
  footer: { alignItems: "center" },
  signUpButton: { marginTop: 10 },
  forgotPasswordLink: {
    marginTop: 12,
    marginBottom: 20,
    alignSelf: "center",
  },
  forgotPasswordText: {
    color: "#FF6B6B",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: 0.1,
  },
  passwordInput: {
    marginTop: 0,
  },
  divider: {
    marginTop: 20,
    marginBottom: 0,
  },
  footerSpacer: {
    height: 32,
  },
});
