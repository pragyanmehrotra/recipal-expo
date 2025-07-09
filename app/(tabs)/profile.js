import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Container,
  Header,
  Button,
  Text,
  Card,
  Input,
  Divider,
} from "../../components";
import { useAuth } from "../../hooks/auth";
import { apiClient } from "../../api/client";

function ProfileHeader({ name, email, createdAt, onPress }) {
  return (
    <TouchableOpacity
      style={styles.profileHeaderCardButton}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text
              variant="title"
              size="xxlarge"
              color="primary"
              style={styles.avatarText}
            >
              {name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.nameContainer}>
          <View style={styles.nameRow}>
            <Text
              variant="title"
              size="xxlarge"
              color="primary"
              style={styles.name}
              numberOfLines={1}
            >
              {name || email}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#FF6B6B"
              style={styles.chevronIcon}
            />
          </View>
          <Text variant="body" size="medium" color="muted" style={styles.email}>
            {email}
          </Text>
          {createdAt && (
            <Text style={styles.memberSince}>
              Member Since {new Date(createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DangerZone({ onDelete, loading }) {
  return (
    <View style={styles.dangerZoneContainer}>
      <Text style={styles.dangerZoneLabel}>Danger Zone</Text>
      <Button
        title={loading ? "Deleting..." : "Delete Account"}
        variant="solid"
        size="large"
        color="error"
        style={styles.dangerButton}
        onPress={onDelete}
        disabled={loading}
      />
    </View>
  );
}

function SignOutButton({ onSignOut }) {
  return (
    <TouchableOpacity
      style={styles.signOutContainer}
      activeOpacity={0.7}
      onPress={onSignOut}
    >
      <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
      <Text
        variant="body"
        size="medium"
        color="primary"
        style={styles.signOutText}
      >
        Sign Out
      </Text>
    </TouchableOpacity>
  );
}

function AccountSection({
  onManageSubscriptions,
  onPaymentHistory,
  onNotifications,
}) {
  return (
    <Card
      padding="large"
      backgroundColor="secondary"
      style={styles.accountCard}
    >
      <Text style={styles.accountSectionTitle}>Account</Text>
      <View style={styles.accountActionButtons}>
        <TouchableOpacity
          style={styles.accountActionButton}
          activeOpacity={0.7}
          onPress={onManageSubscriptions}
        >
          <Ionicons name="card-outline" size={24} color="#FF6B6B" />
          <Text style={styles.accountActionText}>Manage Subscriptions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.accountActionButton}
          activeOpacity={0.7}
          onPress={onPaymentHistory}
        >
          <Ionicons name="receipt-outline" size={24} color="#FF6B6B" />
          <Text style={styles.accountActionText}>Payment History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.accountActionButton}
          activeOpacity={0.7}
          onPress={onNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color="#FF6B6B" />
          <Text style={styles.accountActionText}>Notifications</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBuyingPremium, setIsBuyingPremium] = useState(false);
  const [isCancellingPremium, setIsCancellingPremium] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showManageSubscriptionModal, setShowManageSubscriptionModal] =
    useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState("");

  // Stripe Price ID for $2.99/mo
  const STRIPE_PRICE_ID = "price_1Rj3X3CRoKVskGG5hmBIJ4Ow";
  const APP_URL = "http://localhost:8081"; // Change to your deployed app URL if needed
  const SUCCESS_URL = `${APP_URL}/profile`;
  const CANCEL_URL = `${APP_URL}/profile`;

  // Premium stubs
  const handleBuyPremium = async () => {
    setSubscriptionLoading(true);
    setSubscriptionError("");
    try {
      const res = await apiClient.post("/api/payments/checkout", {
        customerEmail: user.email,
        priceId: STRIPE_PRICE_ID,
        successUrl: SUCCESS_URL,
        cancelUrl: CANCEL_URL,
      });
      if (res.url) {
        // Redirect to Stripe Checkout
        Linking.openURL(res.url);
      } else {
        setSubscriptionError("Failed to get Stripe checkout URL.");
      }
    } catch (err) {
      setSubscriptionError(err.message || "Failed to start checkout.");
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // For MVP, cancel just shows a message
  const handleCancelPremium = () => {
    Alert.alert(
      "Contact Support",
      "To cancel your subscription, please email recipal.meal.planner@gmail.com. Self-service cancellation is coming soon!"
    );
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete("/api/user/profile");
      Alert.alert("Account Deleted", "Your account has been deleted.");
      await signOut();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) {
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={user?.name}
          email={user?.email}
          createdAt={user?.created_at}
          onPress={() => router.push("/edit-profile")}
        />
        <AccountSection
          onManageSubscriptions={() => setShowManageSubscriptionModal(true)}
          onPaymentHistory={() => {}}
          onNotifications={() => {}}
          cardStyle={styles.cardUnified}
        />
        <Card padding="large" style={[styles.actionsCard, styles.cardUnified]}>
          <Text
            variant="title"
            size="large"
            color="primary"
            style={styles.sectionTitle}
          >
            Help & Support
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => setShowFaqModal(true)}
            >
              <Ionicons name="help-buoy-outline" size={24} color="#FF6B6B" />
              <Text style={styles.actionText}>Frequently Asked Questions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => setShowContactModal(true)}
            >
              <Ionicons name="mail-outline" size={24} color="#FF6B6B" />
              <Text style={styles.actionText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => setShowTermsModal(true)}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#FF6B6B"
              />
              <Text style={styles.actionText}>Terms and Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => setShowPrivacyModal(true)}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#FF6B6B"
              />
              <Text style={styles.actionText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </Card>
        <SignOutButton onSignOut={signOut} />
      </ScrollView>
      {/* FAQ Modal */}
      <Modal visible={showFaqModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text
                variant="title"
                size="large"
                color="accent"
                style={{ marginBottom: 16 }}
              >
                Frequently Asked Questions
              </Text>
              <Text
                style={{ color: "#fff", marginBottom: 12, fontWeight: "bold" }}
              >
                Q: How do I add a new recipe?
              </Text>
              <Text style={{ color: "#fff", marginBottom: 16 }}>
                A: Tap the "+ Add Recipe" button in the meal plan or browse tab,
                then follow the prompts to add a recipe by URL or search.
              </Text>
              <Text
                style={{ color: "#fff", marginBottom: 12, fontWeight: "bold" }}
              >
                Q: Can I edit or delete my recipes?
              </Text>
              <Text style={{ color: "#fff", marginBottom: 16 }}>
                A: Yes! Go to your profile or meal plan, tap on a recipe, and
                look for edit or delete options.
              </Text>
              <Text
                style={{ color: "#fff", marginBottom: 12, fontWeight: "bold" }}
              >
                Q: How do I contact support?
              </Text>
              <Text style={{ color: "#fff", marginBottom: 16 }}>
                A: Use the "Contact Us" button on the profile page to email us
                directly.
              </Text>
              <Text
                style={{ color: "#fff", marginBottom: 12, fontWeight: "bold" }}
              >
                Q: Is my data private?
              </Text>
              <Text style={{ color: "#fff", marginBottom: 24 }}>
                A: Yes, your data is private and never shared with third
                parties. See our Privacy Policy for more details.
              </Text>
              <Button title="Close" onPress={() => setShowFaqModal(false)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Terms and Conditions Modal */}
      <Modal visible={showTermsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text
                variant="title"
                size="large"
                color="accent"
                style={{ marginBottom: 16 }}
              >
                Terms and Conditions
              </Text>
              <Text style={{ color: "#fff", marginBottom: 24 }}>
                Welcome to Recipal! By using our app, you agree to use it for
                personal, non-commercial purposes only. You are responsible for
                your own account security. We do not guarantee the accuracy of
                recipe data. We reserve the right to update these terms at any
                time. Continued use of the app means you accept any changes.
              </Text>
              <Button title="Close" onPress={() => setShowTermsModal(false)} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Privacy Policy Modal */}
      <Modal visible={showPrivacyModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text
                variant="title"
                size="large"
                color="accent"
                style={{ marginBottom: 16 }}
              >
                Privacy Policy
              </Text>
              <Text style={{ color: "#fff", marginBottom: 24 }}>
                We value your privacy. Recipal only collects information
                necessary to provide our services. We do not share your personal
                data with third parties. You can request deletion of your
                account and data at any time. For questions, contact us at
                recipal.meal.planner@gmail.com.
              </Text>
              <Button
                title="Close"
                onPress={() => setShowPrivacyModal(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Contact Us Modal */}
      <Modal visible={showContactModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text
                variant="title"
                size="large"
                color="accent"
                style={{ marginBottom: 16 }}
              >
                Contact Us
              </Text>
              <Text style={{ color: "#fff", marginBottom: 16 }}>
                For support, feedback, or questions, please email us at:
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString("recipal.meal.planner@gmail.com");
                  Alert.alert("Copied!", "Email address copied to clipboard.");
                }}
                style={{ marginBottom: 24 }}
              >
                <Text
                  style={{ color: "#4ECDC4", fontWeight: "bold", fontSize: 16 }}
                >
                  recipal.meal.planner@gmail.com
                </Text>
                <Text style={{ color: "#aaa", fontSize: 12 }}>
                  (Tap to copy)
                </Text>
              </TouchableOpacity>
              <Button
                title="Close"
                onPress={() => setShowContactModal(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Manage Subscription Modal */}
      <Modal
        visible={showManageSubscriptionModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text
                variant="title"
                size="large"
                color="accent"
                style={{ marginBottom: 16 }}
              >
                Manage Subscription
              </Text>
              {user.premium ? (
                <>
                  <Text style={{ color: "#fff", marginBottom: 16 }}>
                    You are a{" "}
                    <Text style={{ color: "#4ECDC4", fontWeight: "bold" }}>
                      Premium
                    </Text>{" "}
                    member! Thank you for supporting Recipal.
                  </Text>
                  <Button
                    title={
                      subscriptionLoading
                        ? "Processing..."
                        : "Cancel Subscription"
                    }
                    onPress={handleCancelPremium}
                    disabled={subscriptionLoading}
                    style={{ marginBottom: 16 }}
                  />
                </>
              ) : (
                <>
                  <Text style={{ color: "#fff", marginBottom: 16 }}>
                    Upgrade to{" "}
                    <Text style={{ color: "#4ECDC4", fontWeight: "bold" }}>
                      Premium
                    </Text>{" "}
                    for just $2.99/month and unlock all features!
                  </Text>
                  <Button
                    title={
                      subscriptionLoading
                        ? "Redirecting..."
                        : "Buy Premium ($2.99/mo)"
                    }
                    onPress={handleBuyPremium}
                    disabled={subscriptionLoading}
                    style={{ marginBottom: 16 }}
                  />
                  {subscriptionError ? (
                    <Text style={{ color: "#FF6B6B", marginBottom: 8 }}>
                      {subscriptionError}
                    </Text>
                  ) : null}
                </>
              )}
              <Button
                title="Close"
                onPress={() => setShowManageSubscriptionModal(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    marginBottom: 20,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  nameContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    textAlign: "left",
    color: "#fff",
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
  },
  email: {
    textAlign: "left",
    color: "#ccc",
  },
  memberSince: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  infoCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    color: "#fff",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    marginBottom: 4,
    color: "#aaa",
  },
  infoValue: {
    fontWeight: "500",
    color: "#fff",
  },
  dangerZoneContainer: {
    marginTop: 32,
    alignItems: "center",
    paddingBottom: 32,
    width: "100%",
  },
  dangerZoneLabel: {
    color: "#FF6B6B",
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 18,
    opacity: 0.85,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  dangerButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 16,
    marginTop: 4,
    alignSelf: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  accountCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#23232b",
  },
  accountSectionTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  accountActionButtons: {
    gap: 16,
  },
  accountActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 107, 0.08)",
    marginBottom: 0,
  },
  accountActionText: {
    marginLeft: 12,
    fontWeight: "500",
    color: "#fff",
    fontSize: 16,
  },
  actionsCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#23232b",
  },
  actionButtons: {
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  actionText: {
    marginLeft: 12,
    fontWeight: "500",
    color: "#fff",
  },
  signOutContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderWidth: 2,
    borderColor: "#FF6B6B",
    marginTop: 12,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  signOutText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    marginTop: 8,
    textAlign: "center",
  },
  nameInput: {
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 16,
    marginTop: 4,
    alignSelf: "center",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonNoGlow: {
    borderColor: "#FF6B6B",
    borderWidth: 1.5,
    backgroundColor: "transparent",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 16,
    marginTop: 16,
    alignSelf: "center",
  },
  profileHeaderCardButton: {
    backgroundColor: "#23232b",
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  chevronIcon: {
    marginLeft: 8,
  },
  profileModalContent: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    alignItems: "center",
  },
  profileModalTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 18,
  },
  avatarEditContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  avatarLargeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 36,
  },
  avatarEditIcon: {
    position: "absolute",
    right: -8,
    bottom: 0,
    backgroundColor: "#23232b",
    borderRadius: 16,
    padding: 4,
  },
  avatarEditLabel: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 16,
  },
  profileInput: {
    width: "100%",
    marginBottom: 12,
  },
  emailEditLabel: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  cardUnified: {
    backgroundColor: "#23232b",
    borderRadius: 12,
  },
  sectionCard: {
    marginBottom: 20,
    backgroundColor: "#23232b",
    borderRadius: 12,
  },
  modalCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
});
