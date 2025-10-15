import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
    const { user, signOut } = useAuth();

    const displayName = user?.firstName || user?.lastName
        ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
        : user?.username ?? 'Unknown User';

    return (
        <View style={styles.container}>
            <Text style={styles.nameText}>{displayName}</Text>
            <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
                <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 24,
    },
    nameText: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
        color: '#111827',
        textAlign: 'center',
    },
    signOutButton: {
        backgroundColor: '#111827',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    signOutText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});
