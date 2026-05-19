import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import StatusChip from '../components/StatusChip';
import { api } from '../services/api';

export default function IncidentDetailScreen({ route, navigation }) {
  const { incident } = route.params;

  const resources = Array.isArray(incident.resources_assigned)
    ? incident.resources_assigned
    : [];

  const handleConflictDemo = async () => {
    Alert.alert(
      '🚨 Trigger Conflict Resolution',
      'This will inject a field report that conflicts with the current crisis classification. The AI agents will re-analyze and correct the incident.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Trigger Demo',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.simulateConflict();
              Alert.alert('✅ Conflict Triggered', 'AI agents are re-analyzing. Pull down to refresh the home screen to see the updated incident.');
            } catch (e) {
              Alert.alert('Error', 'Failed to trigger scenario. Is the backend running?');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.card}>
        <Text style={styles.location}>📍 {incident.location}</Text>
        <Text style={styles.crisisType}>{incident.crisis_type || 'Unknown'}</Text>
        <View style={styles.chips}>
          <StatusChip label={incident.severity || 'UNKNOWN'} />
          <StatusChip label={incident.status || 'Active'} />
        </View>
      </View>

      {/* Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚒 Assigned Resources</Text>
        {resources.length === 0 ? (
          <Text style={styles.emptyText}>No resources assigned yet.</Text>
        ) : (
          resources.map((r, i) => (
            <View key={i} style={styles.resourceRow}>
              <View style={styles.resourceDot} />
              <Text style={styles.resourceText}>
                {typeof r === 'object' ? `${r.quantity}x ${r.type} → ${r.destination}` : r}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Demo Action */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Demo Controls</Text>
        <Text style={styles.demoHint}>
          Use this button to trigger the AI Conflict Resolution scenario for judges.
        </Text>
        <TouchableOpacity style={styles.conflictBtn} onPress={handleConflictDemo}>
          <Text style={styles.conflictBtnText}>🔄 Trigger Conflict Resolution</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  card: {
    backgroundColor: '#1C1C1E', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#2C2C2E', marginBottom: 16,
  },
  location: { color: '#8E8E93', fontSize: 14, marginBottom: 6 },
  crisisType: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 14 },
  chips: { flexDirection: 'row', gap: 10 },
  section: {
    backgroundColor: '#1C1C1E', borderRadius: 16, padding: 20,
    borderWidth: 1, borderColor: '#2C2C2E', marginBottom: 16,
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  emptyText: { color: '#636366', fontSize: 14 },
  resourceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  resourceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF9500', marginRight: 10 },
  resourceText: { color: '#EBEBF5', fontSize: 14 },
  demoHint: { color: '#8E8E93', fontSize: 13, marginBottom: 16, lineHeight: 20 },
  conflictBtn: {
    backgroundColor: '#FF3B30', borderRadius: 14, padding: 16,
    alignItems: 'center',
  },
  conflictBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
