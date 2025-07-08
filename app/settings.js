import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Container, Header, Button, Text, Card, Input } from "../components";
import { useAuth } from "../hooks/auth";
import { apiClient } from "../api/client";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
  const { user, signOut, updateUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBuyingPremium, setIsBuyingPremium] = useState(false);
  const [isCancellingPremium, setIsCancellingPremium] = useState(false);
  const router = useRouter();

  // Edit Name
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setIsUpdating(true);
    try {
      const result = await apiClient.put("/api/user/profile", {
        name: newName.trim(),
      });
      updateUser(result.user);
      Alert.alert("Success", "Name updated successfully!");
      setIsEditingName(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update name");
    } finally {
      setIsUpdating(false);
    }
  };

  // Premium stubs
  const handleBuyPremium = async () => {
    setIsBuyingPremium(true);
    setTimeout(() => {
      Alert.alert("Premium Purchased", "You are now a premium member!");
      // updateUser({ ...user, premium: true }); // Uncomment when backend ready
      setIsBuyingPremium(false);
    }, 1200);
  };
  const handleCancelPremium = async () => {
    setIsCancellingPremium(true);
    setTimeout(() => {
      Alert.alert(
        "Premium Cancelled",
        "Your premium membership has been cancelled."
      );
      // updateUser({ ...user, premium: false }); // Uncomment when backend ready
      setIsCancellingPremium(false);
    }, 1200);
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

  return (
    <Container padding="large">
      <Header
        title="Settings"
        leftIcon={<Ionicons name="arrow-back" size={28} color="#FF6B6B" />}
        onLeftPress={() => router.back()}
        titleSize="xxlarge"
        style={{ marginBottom: 24 }}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Edit Name */}
        <Card
          padding="large"
          backgroundColor="secondary"
          style={styles.sectionCard}
        >
          <Text
            variant="title"
            size="large"
            color="primary"
            style={styles.sectionTitle}
          >
            Edit Name
          </Text>
          <View style={styles.rowBetween}>
            <Text variant="body" size="medium" color="muted">
              {user?.name || user?.email}
            </Text>
            <Button
              title="Edit"
              variant="outline"
              size="small"
              onPress={() => setIsEditingName(true)}
              style={styles.editBtn}
            />
          </View>
        </Card>

        {/* Premium Section */}
        <Card
          padding="large"
          backgroundColor="secondary"
          style={styles.sectionCard}
        >
          <Text
            variant="title"
            size="large"
            color="primary"
            style={styles.sectionTitle}
          >
            Premium Membership
          </Text>
          {user?.premium ? (
            <View style={styles.premiumStatusRow}>
              <Text style={styles.premiumBadge}>Premium Member</Text>
              <Button
                title={isCancellingPremium ? "Cancelling..." : "Cancel Premium"}
                variant="outline"
                size="medium"
                color="error"
                style={styles.premiumButton}
                onPress={handleCancelPremium}
                disabled={isCancellingPremium}
              />
            </View>
          ) : (
            <Button
              title={isBuyingPremium ? "Upgrading..." : "Upgrade to Premium"}
              variant="solid"
              size="large"
              color="primary"
              style={styles.premiumButton}
              onPress={handleBuyPremium}
              disabled={isBuyingPremium}
            />
          )}
        </Card>

        {/* Danger Zone - Delete Account */}
        <Card
          padding="large"
          backgroundColor="secondary"
          style={styles.sectionCard}
        >
          <Text
            variant="title"
            size="large"
            color="error"
            style={styles.sectionTitle}
          >
            Danger Zone
          </Text>
          <Button
            title="Delete Account"
            variant="outline"
            size="medium"
            color="error"
            style={styles.deleteButton}
            onPress={() => setShowDeleteModal(true)}
          />
        </Card>
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={isEditingName}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsEditingName(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons
                name="person-circle-outline"
                size={32}
                color="#FF6B6B"
              />
              <Text
                variant="title"
                size="large"
                color="primary"
                style={styles.modalTitle}
              >
                Edit Your Name
              </Text>
            </View>
            <Input
              placeholder="Enter your full name"
              value={newName}
              onChangeText={setNewName}
              autoCapitalize="words"
              autoComplete="name"
              maxLength={30}
              style={styles.nameInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditingName(false)}
                activeOpacity={0.7}
              >
                <Text variant="body" size="medium" color="muted">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateName}
                disabled={isUpdating}
                activeOpacity={0.7}
              >
                <Text
                  variant="body"
                  size="medium"
                  color="primary"
                  style={{ fontWeight: "600" }}
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={32} color="#FF6B6B" />
              <Text
                variant="title"
                size="large"
                color="primary"
                style={styles.modalTitle}
              >
                Delete Account
              </Text>
            </View>
            <Text
              variant="body"
              size="medium"
              color="muted"
              style={{ textAlign: "center", marginBottom: 24 }}
            >
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
                disabled={isDeleting}
              >
                <Text variant="body" size="medium" color="muted">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                activeOpacity={0.7}
              >
                <Text
                  variant="body"
                  size="medium"
                  color="primary"
                  style={{ fontWeight: "600" }}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 40,
  },
  sectionCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  editBtn: {
    minWidth: 80,
    alignSelf: "center",
  },
  premiumStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  premiumBadge: {
    backgroundColor: "#FF6B6B",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    marginRight: 12,
  },
  premiumButton: {
    minWidth: 140,
    alignSelf: "center",
  },
  deleteButton: {
    borderColor: "#FF6B6B",
    marginTop: 4,
    width: 180,
    alignSelf: "center",
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
});
