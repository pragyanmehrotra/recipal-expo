import { useRouter } from "expo-router";

// Navigation helper for auth screens
export function useAuthNavigation() {
  const router = useRouter();

  const goToSignIn = () => {
    router.push("/sign-in");
  };

  const goToSignUp = () => {
    router.push("/sign-up");
  };

  const goToVerifyEmail = () => {
    router.push("/verify-email");
  };

  const goToHome = () => {
    router.push("/");
  };

  return {
    goToSignIn,
    goToSignUp,
    goToVerifyEmail,
    goToHome,
  };
}
