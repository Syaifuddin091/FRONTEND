import React, { useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal } from 'react-native-paper';
import API_URL from '@/config/config';

type UserProfile = {
    username: string;
    email: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator animating={true} />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                {profile ? (
                    <ThemedView style={styles.card}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder for avatar
                            style={styles.avatar}
                        />
                        <ThemedText style={styles.title}>Profile</ThemedText>
                        <ThemedText style={styles.label}>Username:</ThemedText>
                        <ThemedText style={styles.value}>{profile.username}</ThemedText>
                        <ThemedText style={styles.label}>Email:</ThemedText>
                        <ThemedText style={styles.value}>{profile.email}</ThemedText>
                        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                            Log Out
                        </Button>
                    </ThemedView>
                ) : (
                    <ThemedText>No profile data available</ThemedText>
                )}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Logout</Dialog.Title>
                        <Dialog.Content>
                            <ThemedText>Are you sure you want to logout?</ThemedText>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                            <Button onPress={confirmLogout}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f4f8', // Light background color
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 28 ,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 12,
        color: '#555',
    },
    value: {
        fontSize: 18,
        color: '#777',
        marginBottom: 12,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#0352fc', // Red color for logout button
    },
});

export default ProfileScreen;