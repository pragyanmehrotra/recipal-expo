import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Input, Button, Card, Text } from "../components";
import { useAuth } from "../hooks/auth";
import { apiClient } from "../api/client";

export default function EditProfileScreen() {
  const { user, updateUser, signOut } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editField, setEditField] = useState(null); // 'name' or 'email'
  const [editValue, setEditValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEdit = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
  };

  const handleSaveField = async () => {
    if (editField === "name") {
      if (!editValue.trim()) {
        Alert.alert("Error", "Name cannot be empty");
        return;
      }
      setIsUpdating(true);
      try {
        const result = await apiClient.put("/api/user/profile", {
          name: editValue.trim(),
        });
        updateUser(result.user);
        Alert.alert("Success", "Name updated successfully!");
        setEditField(null);
      } catch (error) {
        Alert.alert("Error", error.message || "Failed to update name");
      } finally {
        setIsUpdating(false);
      }
    } else if (editField === "email") {
      // Email editing not implemented
      Alert.alert("Coming soon", "Email editing coming soon!");
      setEditField(null);
    }
  };

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
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.cardUnified}>
          <View style={styles.avatarEditContainer}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>
                {user?.name?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase()}
              </Text>
              <TouchableOpacity
                style={styles.avatarEditButtonOverlap}
                onPress={() =>
                  Alert.alert("Coming soon", "Avatar editing coming soon!")
                }
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={22} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Name (large, centered, pen icon) */}
          <View style={styles.centeredRow}>
            <Text style={styles.nameLarge}>{user?.name}</Text>
            <TouchableOpacity
              onPress={() => handleEdit("name", user?.name)}
              style={styles.editIconBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={22} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          {/* Email (smaller, centered, pen icon) */}
          <View style={styles.centeredRow}>
            <Text style={styles.emailText}>{user?.email}</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Coming soon", "Email editing coming soon!")
              }
              style={styles.editIconBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </Card>
        <Card style={[styles.cardUnified, styles.dangerZoneCard]}>
          <Text style={styles.dangerZoneLabel}>Danger Zone</Text>
          <Button
            title={isDeleting ? "Deleting..." : "Delete Account"}
            variant="outline"
            size="large"
            color="error"
            style={styles.deleteButtonNoGlow}
            onPress={() => setShowDeleteModal(true)}
            disabled={isDeleting}
          />
        </Card>
      </ScrollView>

      {/* Edit Field Modal */}
      <Modal
        visible={!!editField}
        transparent
        animationType="fade"
        onRequestClose={() => setEditField(null)}
      >
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editField === "name" ? "Name" : "Email"}
            </Text>
            <Input
              placeholder={editField === "name" ? "Name" : "Email"}
              value={editValue}
              onChangeText={setEditValue}
              style={styles.profileInput}
              autoCapitalize={editField === "name" ? "words" : "none"}
              editable={editField === "name"}
              keyboardType={editField === "email" ? "email-address" : "default"}
              maxLength={editField === "name" ? 30 : undefined}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditField(null)}
                activeOpacity={0.7}
                disabled={isUpdating}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButtonModal]}
                onPress={handleSaveField}
                disabled={isUpdating}
                activeOpacity={0.7}
              >
                <Text style={styles.saveText}>
                  {isUpdating ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning-outline" size={32} color="#FF6B6B" />
              <Text style={styles.modalTitle}>Delete Account</Text>
            </View>
            <Text style={styles.modalText}>
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
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteModalButton]}
                onPress={handleDeleteAccount}
                disabled={isDeleting}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteText}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18181c",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#18181c",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 8,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  cardUnified: {
    backgroundColor: "#23232b",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
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
  avatarEditButton: {
    position: "absolute",
    right: -8,
    bottom: 0,
    backgroundColor: "#23232b",
    borderRadius: 16,
    padding: 4,
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
  saveButton: {
    marginTop: 8,
    marginBottom: 4,
  },
  dangerZoneCard: {
    marginTop: 8,
    marginBottom: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  dangerZoneLabel: {
    color: "#FF6B6B",
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 18,
    letterSpacing: 1,
    opacity: 0.85,
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  deleteButtonNoGlow: {
    borderColor: "#FF6B6B",
    borderWidth: 1.5,
    backgroundColor: "transparent",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 16,
    marginTop: 8,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlayCentered: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
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
    marginBottom: 18,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalText: {
    color: "#ccc",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 15,
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
  deleteModalButton: {
    backgroundColor: "#FF6B6B",
  },
  cancelText: {
    color: "#aaa",
    fontWeight: "500",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  avatarEditButtonOverlap: {
    position: "absolute",
    right: -8,
    bottom: -8,
    backgroundColor: "#23232b",
    borderRadius: 16,
    padding: 4,
    borderWidth: 2,
    borderColor: "#18181c",
    zIndex: 2,
  },
  centeredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4, // Reduced gap
  },
  nameLarge: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    // No marginRight, keep icon close
  },
  emailText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 0,
    // No marginRight, keep icon close
  },
  editIconBtn: {
    marginLeft: 4,
    padding: 4,
    borderRadius: 8,
  },
  saveButtonModal: {
    backgroundColor: "#FF6B6B",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
