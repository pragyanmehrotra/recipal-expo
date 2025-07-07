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
import {
  Container,
  Header,
  Button,
  Text,
  Card,
  Divider,
  Input,
} from "../components";
import { useAuth } from "../hooks/auth";
import { apiClient } from "../api/client";

export default function ProfileScreen() {
  const { user, signOut, updateUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Helper function to truncate long names
  const truncateName = (name, maxLength = 20) => {
    if (!name) return "";
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  };

  // Get display name with fallback
  const getDisplayName = () => {
    const name = user?.name || user?.email || "";
    return truncateName(name, 25); // Allow slightly more characters for display
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  const handleEditName = () => {
    setNewName(user?.name || "");
    setIsEditingName(true);
  };

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
        {/* Profile Header Card */}
        <Card
          padding="large"
          backgroundColor="secondary"
          style={styles.profileHeaderCard}
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
                  {getDisplayName().charAt(0).toUpperCase()}
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
                  {getDisplayName()}
                </Text>
                <TouchableOpacity
                  onPress={handleEditName}
                  style={styles.editButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={26} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
              <Text
                variant="body"
                size="medium"
                color="muted"
                style={styles.email}
              >
                {user?.email}
              </Text>
            </View>
          </View>
        </Card>

        {/* Account Info Section */}
        <Card
          padding="large"
          backgroundColor="secondary"
          style={styles.infoCard}
        >
          <Text
            variant="title"
            size="large"
            color="primary"
            style={styles.sectionTitle}
          >
            Account Information
          </Text>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text
                variant="body"
                size="small"
                color="muted"
                style={styles.infoLabel}
              >
                User ID
              </Text>
              <Text
                variant="body"
                size="medium"
                color="primary"
                style={styles.infoValue}
              >
                {user?.id}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text
                variant="body"
                size="small"
                color="muted"
                style={styles.infoLabel}
              >
                Member Since
              </Text>
              <Text
                variant="body"
                size="medium"
                color="primary"
                style={styles.infoValue}
              >
                {new Date(user?.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Actions Section */}
        <Card
          padding="large"
          backgroundColor="secondary"
          style={styles.actionsCard}
        >
          <Text
            variant="title"
            size="large"
            color="primary"
            style={styles.sectionTitle}
          >
            Account Actions
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <Ionicons name="settings-outline" size={24} color="#FF6B6B" />
              <Text
                variant="body"
                size="medium"
                color="primary"
                style={styles.actionText}
              >
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <Ionicons name="help-circle-outline" size={24} color="#FF6B6B" />
              <Text
                variant="body"
                size="medium"
                color="primary"
                style={styles.actionText}
              >
                Help & Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => {}}
            >
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#FF6B6B"
              />
              <Text
                variant="body"
                size="medium"
                color="primary"
                style={styles.actionText}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutContainer}
          activeOpacity={0.7}
          onPress={handleSignOut}
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
      </ScrollView>

      {/* Name Edit Modal */}
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

  // Profile Header Card
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
  },
  editButton: {
    marginLeft: 8,
    padding: 4,
  },
  email: {
    textAlign: "left",
  },

  // Info Card
  infoCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 16,
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
  },
  infoValue: {
    fontWeight: "500",
  },

  // Actions Card
  actionsCard: {
    marginBottom: 20,
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
  },

  // Sign Out
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
  },

  // Modal styles
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
