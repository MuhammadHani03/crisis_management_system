import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SEVERITY_COLORS = {
  HIGH: { bg: '#FF3B30', text: '#fff' },
  CRITICAL: { bg: '#8B0000', text: '#fff' },
  MEDIUM: { bg: '#FF9500', text: '#fff' },
  LOW: { bg: '#34C759', text: '#fff' },
  UNKNOWN: { bg: '#636366', text: '#fff' },
};

export default function IncidentCard({ incident, onPress }) {
  const severity = incident.severity?.toUpperCase() || 'UNKNOWN';
  const colors = SEVERITY_COLORS[severity] || SEVERITY_COLORS.UNKNOWN;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.location}>📍 {incident.location}</Text>
          <View style={[styles.badge, { backgroundColor: colors.bg }]}>
            <Text style={[styles.badgeText, { color: colors.text }]}>{severity}</Text>
          </View>
        </View>
        <Text style={styles.crisisType}>{incident.crisis_type || 'Unknown Crisis'}</Text>
      </View>

      <View style={styles.footer}>
        <View style={[styles.statusDot, { backgroundColor: incident.status === 'Active' ? '#FF3B30' : '#34C759' }]} />
        <Text style={styles.statusText}>{incident.status || 'Active'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  header: { marginBottom: 12 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: { color: '#EBEBF5', fontSize: 16, fontWeight: '700' },
  crisisType: { color: '#8E8E93', fontSize: 14 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  footer: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { color: '#8E8E93', fontSize: 13 },
});
