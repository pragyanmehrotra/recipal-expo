import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Container, Text, Header, Button, Input, Divider } from "../components";
import { useAuth } from "../hooks/auth";

export default function VerifyEmailScreen({
  onNavigateToSignIn,
  onVerificationSuccess,
}) {
  const { user, verifyEmail, resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setIsVerifying(true);

    try {
      const result = await verifyEmail(user?.email, verificationCode);

      if (result.success) {
        Alert.alert(
          "Success!",
          "Your email has been verified successfully. You can now use the app.",
          [
            {
              text: "OK",
              onPress: () => {
                if (onVerificationSuccess) {
                  onVerificationSuccess();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      Alert.alert(
        "Error",
        error.message || "Verification failed. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      const result = await resendVerification(user?.email);

      if (result.success) {
        Alert.alert(
          "Code Sent",
          "A new verification code has been sent to your email. Please check your inbox and spam folder."
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to resend code. Please try again later."
        );
      }
    } catch (error) {
      console.error("Resend error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to resend code. Please try again later."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    if (onNavigateToSignIn) {
      onNavigateToSignIn();
    }
  };

  if (!user?.email) {
    return (
      <Container>
        <Text
          variant="body"
          size="large"
          color="muted"
          style={{ textAlign: "center" }}
        >
          No email found. Please sign up first.
        </Text>
      </Container>
    );
  }

  return (
    <Container padding="large">
      <Header
        title="Verify Your Email"
        subtitle="Enter the verification code sent to your email"
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
          We've sent a verification code to{" "}
          <Text
            variant="body"
            size="large"
            color="secondary"
            style={{ fontWeight: "600" }}
          >
            {user.email}
          </Text>
          . Please enter the code below to complete your account setup.
        </Text>

        <View style={styles.verificationForm}>
          <Input
            placeholder="Enter verification code (e.g., 123456)"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            autoCapitalize="none"
            maxLength={6}
            style={styles.codeInput}
          />

          <Button
            title={isVerifying ? "Verifying..." : "Verify Code"}
            onPress={handleVerifyCode}
            disabled={isVerifying || !verificationCode.trim()}
            style={styles.verifyButton}
          />
        </View>

        <View style={styles.steps}>
          <Text variant="body" size="medium" color="muted" style={styles.step}>
            1. Check your email inbox (and spam folder)
          </Text>
          <Text variant="body" size="medium" color="muted" style={styles.step}>
            2. Find the verification code (6 digits)
          </Text>
          <Text variant="body" size="medium" color="muted" style={styles.step}>
            3. Enter the code above and tap "Verify Code"
          </Text>
        </View>

        <Button
          title={isResending ? "Resending..." : "Resend Code"}
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
  verificationForm: {
    marginBottom: 30,
  },
  codeInput: {
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 20,
  },
  verifyButton: {
    marginBottom: 20,
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
