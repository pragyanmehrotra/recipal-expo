import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Container, Text, Header, Button, Input, Divider } from "../components";
import { useAuth } from "../hooks/auth";

export default function SignUpScreen({
  onNavigateToSignIn,
  onSignUpSuccess,
  onVerificationNeeded,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in email and password fields");
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

    const result = await signUp(email, password, name || "");

    if (!result.success) {
      Alert.alert("Error", result.error || "Sign up failed");
    } else if (result.needsVerification) {
      // Show success message and navigate to verification
      Alert.alert(
        "Account Created!",
        result.message || "Please check your email for verification code.",
        [
          {
            text: "OK",
            onPress: () => {
              if (onVerificationNeeded) {
                onVerificationNeeded();
              }
            },
          },
        ]
      );
    } else if (onSignUpSuccess) {
      onSignUpSuccess();
    }

    setIsLoading(false);
  };

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
          placeholder="Full name (optional)"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoComplete="name"
        />
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
          onPress={onNavigateToSignIn}
          style={styles.signInButton}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: { marginBottom: 20 },
  signUpButton: { marginTop: 20 },
  footer: { alignItems: "center" },
  signInButton: { marginTop: 10 },
});
