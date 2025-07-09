import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAT_STORAGE_KEY = "@ai_chats";

function getChatTitle(messages) {
  const firstUser = messages.find((m) => m.role === "user");
  return firstUser?.text?.slice(0, 32) || "New Chat";
}

export default function AIChatScreen() {
  const [chats, setChats] = useState([]); // [{id, title, messages, updatedAt}]
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChats, setShowChats] = useState(false);
  const [error, setError] = useState("");
  const flatListRef = useRef();

  // Load chats from storage
  useEffect(() => {
    AsyncStorage.getItem(CHAT_STORAGE_KEY).then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        setChats(parsed);
        if (parsed.length > 0) {
          setCurrentChatId(parsed[0].id);
          setMessages(parsed[0].messages);
        } else {
          startNewChat();
        }
      } else {
        startNewChat();
      }
    });
  }, []);

  // Save chats to storage
  useEffect(() => {
    AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  function startNewChat() {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          role: "ai",
          text: "Hi! I'm your AI recipe helper. Ask me anything about recipes!",
        },
      ],
      updatedAt: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages(newChat.messages);
  }

  function selectChat(id) {
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages);
      setShowChats(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;
    setError("");
    const userMessage = { role: "user", text: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    // Call backend for AI response
    try {
      const res = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001"
        }/api/ai/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updatedMessages }),
        }
      );
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const aiMessage = { role: "ai", text: data.ai || "[No response]" };
      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      // Update chat in chats list
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: newMessages,
                updatedAt: Date.now(),
                title: getChatTitle(newMessages),
              }
            : c
        )
      );
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      setError(err.message || "Failed to get AI response");
      setLoading(false);
    }
  }

  function handleNewChat() {
    startNewChat();
    setShowChats(false);
  }

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.role === "user" ? styles.userRow : styles.aiRow,
      ]}
    >
      <View
        style={[
          styles.bubble,
          item.role === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Chat history modal */}
      <Modal
        visible={showChats}
        animationType="slide"
        onRequestClose={() => setShowChats(false)}
      >
        <SafeAreaView style={styles.chatsModal}>
          <View style={styles.chatsHeader}>
            <Text style={styles.chatsTitle}>Past Chats</Text>
            <TouchableOpacity onPress={() => setShowChats(false)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.chatItem,
                  item.id === currentChatId && styles.chatItemActive,
                ]}
                onPress={() => selectChat(item.id)}
              >
                <Text style={styles.chatItemTitle}>{item.title}</Text>
                <Text style={styles.chatItemDate}>
                  {new Date(item.updatedAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.newChatBtn}
                onPress={handleNewChat}
              >
                <Ionicons name="add-circle-outline" size={22} color="#4ECDC4" />
                <Text style={styles.newChatText}>New Chat</Text>
              </TouchableOpacity>
            }
          />
        </SafeAreaView>
      </Modal>
      {/* Main chat area */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => setShowChats(true)}
          style={styles.menuBtn}
        >
          <Ionicons name="chatbubbles-outline" size={26} color="#4ECDC4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Recipe Helper</Text>
        <View style={{ width: 32 }} />
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.chatArea}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#4ECDC4" />
          <Text style={styles.loadingText}>AI is typing...</Text>
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={sendMessage}
          disabled={loading || !input.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={loading || !input.trim() ? "#888" : "#4ECDC4"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
  },
  chatArea: {
    padding: 16,
    paddingBottom: 32,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  aiRow: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  userBubble: {
    backgroundColor: "#4ECDC4",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#232323",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#232323",
    backgroundColor: "#1a1a1a",
  },
  input: {
    flex: 1,
    backgroundColor: "#232323",
    color: "#fff",
    fontSize: 16,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendBtn: {
    padding: 8,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    marginBottom: 8,
  },
  loadingText: {
    color: "#aaa",
    marginLeft: 8,
    fontSize: 15,
  },
  errorText: {
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 8,
    fontSize: 15,
  },
  // Chat history modal styles
  chatsModal: {
    flex: 1,
    backgroundColor: "#181818",
    paddingTop: 24,
  },
  chatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  chatsTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#232323",
  },
  chatItemActive: {
    backgroundColor: "#232323",
  },
  chatItemTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  chatItemDate: {
    color: "#aaa",
    fontSize: 13,
    marginTop: 2,
  },
  newChatBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "center",
  },
  newChatText: {
    color: "#4ECDC4",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "500",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#181818",
  },
  menuBtn: {
    padding: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
});
