import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/register`, { username, password, email });
      router.replace("/auth/LoginScreen");
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "An error occurred";
      setDialogMessage(errorMessage);
      setDialogVisible(true);
    }
  };

  return (
    <PaperProvider>
      <LinearGradient colors={["#FF416C", "#FF4B2B"]} style={styles.gradient}>
        <ThemedView style={styles.container}>
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>Join us and get started</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="person" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Portal>
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
              <Dialog.Title>Registration Failed</Dialog.Title>
              <Dialog.Content>
                <Text>{dialogMessage}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setDialogVisible(false)}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </ThemedView>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    width: "100%",
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#FF4B2B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
