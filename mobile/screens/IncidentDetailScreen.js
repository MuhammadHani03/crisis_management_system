import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Background Neon Glow Elements */}
      <View style={styles.topAmbientRed} />
      <View style={styles.centerAmbientTeal} />

      {/* Top Identity Card */}
      <View style={styles.glassCard}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText}>{incident.location}</Text>
        </View>
        <Text style={styles.crisisType}>{incident.crisis_type || 'Unknown'}</Text>
        <View style={styles.chipsContainer}>
          <StatusChip label={incident.severity || 'UNKNOWN'} />
          <StatusChip label={incident.status || 'Active'} />
        </View>
      </View>

      {/* Resources Deployed Section */}
      <View style={styles.glassCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionIcon}>🚒</Text>
          <Text style={styles.sectionTitle}>Assigned Resources</Text>
        </View>
        
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

      {/* Demo Controller Section */}
      <View style={styles.glassCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionIcon}>⚡</Text>
          <Text style={styles.sectionTitle}>Demo Controls</Text>
        </View>
        <Text style={styles.demoHint}>
          Use this button to trigger the AI Conflict Resolution scenario for judges.
        </Text>
        <TouchableOpacity style={styles.conflictBtn} onPress={handleConflictDemo} activeOpacity={0.8}>
          <Text style={styles.conflictBtnText}>🔄 Trigger Conflict Resolution</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B0F19', // Matches the signature dark background
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 12,
    paddingBottom: 60,
    position: 'relative',
  },
  topAmbientRed: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
  },
  centerAmbientTeal: {
    position: 'absolute',
    bottom: 40,
    left: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(48, 209, 88, 0.03)',
  },
  glassCard: {
    backgroundColor: 'rgba(19, 26, 46, 0.7)', // Premium translucent layout look
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationPin: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: { 
    color: '#94A3B8', 
    fontSize: 14, 
    fontWeight: '600',
  },
  crisisType: { 
    color: '#FFFFFF', 
    fontSize: 26, 
    fontWeight: '700', 
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  chipsContainer: { 
    flexDirection: 'row', 
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: '700',
  },
  emptyText: { 
    color: '#475569', 
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 2,
  },
  resourceRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0F1524',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12, // Capsule inner rows
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    marginBottom: 8,
  },
  resourceDot: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#30D158', // Neon signal green
    marginRight: 12,
  },
  resourceText: { 
    color: '#E2E8F0', 
    fontSize: 14,
    fontWeight: '500',
  },
  demoHint: { 
    color: '#64748B', 
    fontSize: 13, 
    marginBottom: 18, 
    lineHeight: 18,
    fontWeight: '500',
  },
  conflictBtn: {
    backgroundColor: '#E2E8F0', // High-contrast clean accent button style from reference
    borderRadius: 24, // High-end rounded capsule 
    padding: 14,
    alignItems: 'center',
  },
  conflictBtnText: { 
    color: '#0B0F19', 
    fontSize: 15, 
    fontWeight: '700',
  },
});