import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Container, Text, Header, Button, Divider } from "../components";

export default function VerifyEmailScreen() {
  const { signUp, isLoaded } = useSignUp();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      await signUp.prepareEmailAddressVerification();
      Alert.alert(
        "Email Sent",
        "Verification email has been resent. Please check your inbox."
      );
    } catch (error) {
      console.error("Resend error:", error);
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || "Failed to resend email"
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
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
        title="Verify Your Email"
        subtitle="Check your inbox for a verification link"
        titleSize="xxlarge"
        subtitleSize="medium"
        textAlign="center"
        marginTop={40}
        marginBottom={40}
      />

      <View style={styles.content}>
        <Text
          variant="body"
          size="large"
          color="primary"
          style={[styles.instruction, { textAlign: "center" }]}
        >
          We've sent a verification email to your inbox. Please click the
          verification link to complete your account setup.
        </Text>

        <View style={styles.steps}>
          <Text variant="body" size="medium" color="muted" style={styles.step}>
            1. Check your email inbox (and spam folder)
          </Text>
          <Text variant="body" size="medium" color="muted" style={styles.step}>
            2. Click the verification link in the email
          </Text>
          <Text variant="body" size="medium" color="muted" style={styles.step}>
            3. Return to the app and sign in
          </Text>
        </View>

        <Button
          title={isResending ? "Resending..." : "Resend Email"}
          variant="outline"
          size="large"
          onPress={handleResendEmail}
          disabled={isResending}
          style={styles.resendButton}
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
          Already verified your email?
        </Text>
        <Button
          title="Back to Sign In"
          variant="ghost"
          size="medium"
          onPress={handleBackToSignIn}
          style={styles.signInButton}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
  },
  instruction: {
    marginBottom: 30,
    lineHeight: 24,
  },
  steps: {
    marginBottom: 40,
  },
  step: {
    marginBottom: 10,
    paddingLeft: 20,
  },
  resendButton: {
    marginBottom: 20,
  },
  footer: {
    alignItems: "center",
  },
  signInButton: {
    marginTop: 10,
  },
});
