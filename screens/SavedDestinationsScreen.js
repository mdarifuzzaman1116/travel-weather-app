import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export default function SavedDestinationsScreen() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDestinations(data || []);
    } catch (error) {
      console.error('Error loading destinations:', error);
      Alert.alert('Error', 'Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const deleteDestination = async (id) => {
    Alert.alert(
      'Delete Destination',
      'Are you sure you want to delete this destination?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('destinations')
                .delete()
                .eq('id', id);

              if (error) throw error;
              loadDestinations();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete destination');
            }
          },
        },
      ]
    );
  };

  const toggleVisited = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('destinations')
        .update({ visited: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      loadDestinations();
    } catch (error) {
      Alert.alert('Error', 'Failed to update destination');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (destinations.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyIcon}>🗺️</Text>
        <Text style={styles.emptyTitle}>No saved destinations yet</Text>
        <Text style={styles.emptyText}>
          Start searching for destinations and save your favorites!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {destinations.map((dest) => (
          <View key={dest.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{dest.country}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteDestination(dest.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardDetails}>
              <Text style={styles.detail}>📅 Month: {dest.month}</Text>
              <Text style={styles.detail}>🌡️ Temperature: {dest.temperature}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.visitedButton,
                dest.visited && styles.visitedButtonActive,
              ]}
              onPress={() => toggleVisited(dest.id, dest.visited)}
            >
              <Text style={styles.visitedButtonText}>
                {dest.visited ? '✓ Visited' : '○ Not Visited'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    padding: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  cardDetails: {
    marginBottom: 15,
  },
  detail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  visitedButton: {
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  visitedButtonActive: {
    backgroundColor: '#10b981',
  },
  visitedButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
});
