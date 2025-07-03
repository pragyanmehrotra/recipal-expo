import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import HomeScreen from "../main/HomeScreen";
import SignInScreen from "./SignInScreen";
import SignUpScreen from "./SignUpScreen";
import VerifyEmailScreen from "./VerifyEmailScreen";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AuthWrapper() {
  const auth = useAuth();
  const { isLoaded, isSignedIn, isSignedUp } = auth;

  if (!isLoaded) return <LoadingSpinner message="Loading..." />;
  if (isSignedIn && isSignedUp) return <HomeScreen />;
  if (isSignedUp && !isSignedIn) return <VerifyEmailScreen />;
  return <SignInScreen />;
}
