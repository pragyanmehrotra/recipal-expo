import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Container, Header, Input, Button, Text } from "../components";
import { useRouter } from "expo-router";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRequestReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      setIsLoading(false);
      if (response.ok) {
        setMessage(data.message);
      } else {
        Alert.alert("Error", data.error || "Failed to send reset code.");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error", error.message || "Failed to send reset code.");
    }
  };

  return (
    <Container padding="large">
      <Header
        title="Reset Password"
        subtitle="Enter your email to receive a reset code"
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
        <Button
          title={isLoading ? "Sending..." : "Send Reset Code"}
          onPress={handleRequestReset}
          disabled={isLoading}
          style={styles.button}
        />
        {!!message && (
          <>
            <Text style={styles.message} color="muted">
              {message}
            </Text>
            <Button
              title="Enter Reset Code"
              variant="outline"
              onPress={() => router.push("/set-new-password")}
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 24,
  },
  input: {
    marginBottom: 24,
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
