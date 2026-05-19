import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Alert, ActivityIndicator
} from 'react-native';
import IncidentCard from '../components/IncidentCard';
import { api } from '../services/api';

// Static mock locations for incidents (since we don't have real GPS)
const MOCK_COORDS = {
  'G-10': { lat: 33.7215, lng: 73.0433 },
  'F-7': { lat: 33.7181, lng: 73.0631 },
  'I-8': { lat: 33.6844, lng: 73.0479 },
  'Downtown': { lat: 33.7294, lng: 73.0931 },
};

export default function HomeScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (e) {
      Alert.alert('Connection Error', 'Cannot reach backend. Make sure server is running and your IP is set correctly in api.js');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    // Poll every 10 seconds for real-time updates
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchIncidents();
  };

  const getSeverityCount = (level) =>
    incidents.filter(i => i.severity?.toUpperCase() === level).length;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Connecting to Crisis Backend...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Summary Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: '#FF3B30' }]}>
          <Text style={[styles.statNum, { color: '#FF3B30' }]}>{getSeverityCount('HIGH') + getSeverityCount('CRITICAL')}</Text>
          <Text style={styles.statLabel}>Critical</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#FF9500' }]}>
          <Text style={[styles.statNum, { color: '#FF9500' }]}>{getSeverityCount('MEDIUM')}</Text>
          <Text style={styles.statLabel}>Medium</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#34C759' }]}>
          <Text style={[styles.statNum, { color: '#34C759' }]}>{incidents.filter(i => i.status === 'Resolved').length}</Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
        <View style={[styles.statCard, { borderColor: '#636366' }]}>
          <Text style={[styles.statNum, { color: '#EBEBF5' }]}>{incidents.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Incidents</Text>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {incidents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>✅</Text>
          <Text style={styles.emptyTitle}>All Clear</Text>
          <Text style={styles.emptySubtitle}>No active incidents detected</Text>
        </View>
      ) : (
        <FlatList
          data={incidents}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF3B30" />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  centered: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#8E8E93', marginTop: 12, fontSize: 14 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#1C1C1E', borderRadius: 12,
    padding: 12, alignItems: 'center', borderWidth: 1,
  },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#8E8E93', fontSize: 11, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF3B30' },
  liveText: { color: '#FF3B30', fontSize: 11, fontWeight: '700' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  emptySubtitle: { color: '#8E8E93', fontSize: 14, marginTop: 6 },
});
