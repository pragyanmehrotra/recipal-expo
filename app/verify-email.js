import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Container, Text, Header, Button, Input, Divider } from "../components";

export default function VerifyEmailScreen({ onNavigateToSignIn }) {
  const { signUp, isLoaded } = useSignUp();
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
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log("Verification result:", result.status);

      if (result.status === "complete") {
        Alert.alert(
          "Success!",
          "Your email has been verified successfully. You can now sign in.",
          [
            {
              text: "OK",
              onPress: () => {
                if (onNavigateToSignIn) {
                  onNavigateToSignIn();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code", // Use OTP code instead of email link
      });
      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email. Please check your inbox and spam folder.\n\nNote: Development instances have limited email sending (2 per hour)."
      );
    } catch (error) {
      console.error("Resend error:", error);

      // Check if it's a rate limit error
      if (error.errors?.[0]?.code === "rate_limit_exceeded") {
        Alert.alert(
          "Rate Limit Exceeded",
          "You've reached the email sending limit for development instances. Please wait up to 1 hour before trying again, or manually verify your email in the Clerk dashboard."
        );
      } else {
        Alert.alert(
          "Error",
          error.errors?.[0]?.message ||
            "Failed to resend code. Please try again later."
        );
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = () => {
    if (onNavigateToSignIn) {
      onNavigateToSignIn();
    }
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
          We've sent a verification code to your email address. Please enter the
          code below to complete your account setup.
          {"\n\n"}
          <Text variant="body" size="medium" color="muted">
            Note: Development instances have limited email sending (2 per hour).
            If you don't receive the code, check your spam folder or wait before
            resending.
          </Text>
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
            2. Find the verification code (usually 6 digits)
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
