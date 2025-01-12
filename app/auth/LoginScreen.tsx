import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      const { token } = response.data.data;
      await AsyncStorage.setItem("token", token);
      setDialogMessage("Login successful!");
      setIsSuccess(true);
      setDialogVisible(true);
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || "An error occurred";
      setDialogMessage(errorMessage);
      setIsSuccess(false);
      setDialogVisible(true);
    }
  };

  const handleDialogDismiss = () => {
    setDialogVisible(false);
    if (isSuccess) {
      router.replace("/(tabs)");
    }
  };

  return (
    <PaperProvider>
      <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.gradient}>
        <ThemedView style={styles.container}>
          <Image source={require("../../assets/images/icon.png")} style={styles.logo} />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Log in to continue</Text>
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
            <MaterialIcons name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/auth/RegisterScreen")}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
          <Portal>
            <Dialog visible={dialogVisible} onDismiss={handleDialogDismiss}>
              <Dialog.Title>{isSuccess ? "Success" : "Login Failed"}</Dialog.Title>
              <Dialog.Content>
                <Text>{dialogMessage}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={handleDialogDismiss}>OK</Button>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    resizeMode: "contain",
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
    color: "#ddd",
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
  loginButton: {
    width: "100%",
    height: 48,
    backgroundColor: "#0352fc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
