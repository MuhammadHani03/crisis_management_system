import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import { api } from '../services/api';

const RESOURCE_ICONS = {
  'Water Rescue Teams': '🚤',
  'Evacuation Boats': '⛵',
  'Sandbags': '🪨',
  'Maintenance Crew': '🔧',
  'Water Shutoff Team': '🚰',
  'Traffic Control': '🚦',
  'Fire Dept': '🚒',
  'Cooling Centers': '❄️',
  'Ambulances': '🚑',
  'Scout Team': '🔍',
};

export default function ResourceScreen() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data.filter(i => i.resources_assigned?.length > 0));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={styles.loadingText}>Loading Resources...</Text>
      </View>
    );
  }

  // Flatten all resources across all incidents
  const allResources = incidents.flatMap(inc =>
    (inc.resources_assigned || []).map(r => ({
      incident: inc.location,
      resource: typeof r === 'object' ? r : { type: r, quantity: 1, destination: inc.location },
    }))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🚒 Deployed Resources</Text>
      <Text style={styles.subheader}>{allResources.length} units deployed across {incidents.length} incidents</Text>

      {allResources.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>💤</Text>
          <Text style={styles.emptyText}>No resources deployed</Text>
        </View>
      ) : (
        <FlatList
          data={allResources}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => {
            const icon = RESOURCE_ICONS[item.resource.type] || '📦';
            return (
              <View style={styles.card}>
                <Text style={styles.icon}>{icon}</Text>
                <View style={styles.info}>
                  <Text style={styles.resourceName}>{item.resource.type}</Text>
                  <Text style={styles.resourceDest}>
                    {item.resource.quantity ? `${item.resource.quantity}x → ` : ''}
                    {item.resource.destination || item.incident}
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>ACTIVE</Text>
                </View>
              </View>
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#FF9500" />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  centered: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#8E8E93', marginTop: 12 },
  header: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subheader: { color: '#8E8E93', fontSize: 13, marginBottom: 20 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#636366', fontSize: 16 },
  card: {
    backgroundColor: '#1C1C1E', borderRadius: 14, padding: 16,
    marginBottom: 10, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#2C2C2E',
  },
  icon: { fontSize: 28, marginRight: 14 },
  info: { flex: 1 },
  resourceName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  resourceDest: { color: '#8E8E93', fontSize: 13, marginTop: 3 },
  badge: { backgroundColor: '#FF950022', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#FF9500' },
  badgeText: { color: '#FF9500', fontSize: 11, fontWeight: '700' },
});
