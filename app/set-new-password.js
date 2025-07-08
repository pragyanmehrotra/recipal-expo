import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Container, Header, Input, Button, Text } from "../components";
import { useRouter } from "expo-router";

export default function SetNewPasswordScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email.trim() || !code.trim() || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, password }),
        }
      );
      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        setMessage(
          data.message || "Your password has been reset. You can now sign in."
        );
        setTimeout(() => {
          router.replace("/sign-in");
        }, 1500);
      } else {
        Alert.alert("Error", data.error || "Failed to reset password.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", error.message || "Failed to reset password.");
    }
  };

  return (
    <Container padding="large">
      <Header
        title="Set New Password"
        subtitle="Enter the code from your email and your new password"
        titleSize="xxlarge"
        subtitleSize="medium"
        textAlign="center"
        marginTop={0}
        marginBottom={32}
        leftIcon
        onLeftPress={() => router.back()}
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
          placeholder="Reset Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
          maxLength={6}
          style={styles.input}
        />
        <Input
          placeholder="New Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoComplete="new-password"
          style={styles.input}
        />
        <Input
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          autoComplete="new-password"
          style={styles.input}
        />
        <Button
          title={isLoading ? "Resetting..." : "Set New Password"}
          onPress={handleResetPassword}
          disabled={isLoading}
          style={styles.button}
        />
        {!!message && (
          <>
            <Text style={styles.message} color="muted">
              {message}
            </Text>
            <Button
              title="Go to Sign In"
              variant="outline"
              onPress={() => router.replace("/sign-in")}
              style={{ marginTop: 12 }}
            />
          </>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 0,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 20,
  },
  message: {
    marginTop: 0,
    textAlign: "center",
    fontSize: 15,
  },
});
