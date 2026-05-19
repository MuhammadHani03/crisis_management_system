import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  Active: '#FF3B30',
  Resolved: '#34C759',
  Investigating: '#FF9500',
  HIGH: '#FF3B30',
  CRITICAL: '#8B0000',
  MEDIUM: '#FF9500',
  LOW: '#34C759',
};

export default function StatusChip({ label }) {
  const color = COLORS[label] || '#636366';
  return (
    <View style={[styles.chip, { backgroundColor: color + '25', borderColor: color }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
});
