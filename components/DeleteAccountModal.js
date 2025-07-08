import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text, Button } from "../components";

export default function DeleteAccountModal({
  visible,
  onCancel,
  onDelete,
  loading,
  error,
}) {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState("");

  const handleContinue = () => setStep(2);
  const handleCancel = () => {
    setStep(1);
    setConfirmText("");
    onCancel();
  };
  const handleDelete = () => {
    if (confirmText === "DELETE") {
      onDelete();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Ionicons name="warning-outline" size={32} color="#FF6B6B" />
            <Text style={styles.modalTitle}>Delete Account</Text>
          </View>
          {step === 1 ? (
            <>
              <Text style={styles.modalText}>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.continueButton]}
                  onPress={handleContinue}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalText}>
                Please type <Text style={styles.deleteWord}>DELETE</Text> to
                confirm account deletion.
              </Text>
              <TextInput
                style={styles.input}
                value={confirmText}
                onChangeText={setConfirmText}
                autoCapitalize="characters"
                autoFocus
                placeholder="Type DELETE"
                placeholderTextColor="#888"
                editable={!loading}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.deleteButton,
                    confirmText !== "DELETE" && styles.disabledButton,
                  ]}
                  onPress={handleDelete}
                  activeOpacity={0.7}
                  disabled={loading || confirmText !== "DELETE"}
                >
                  <Text style={styles.deleteText}>
                    {loading ? "Deleting..." : "Delete"}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  deleteWord: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#23232b",
    color: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
    textAlign: "center",
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
  continueButton: {
    backgroundColor: "#FFD700",
  },
  continueText: {
    color: "#23232b",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 14,
  },
});
