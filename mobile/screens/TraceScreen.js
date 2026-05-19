import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { api } from '../services/api';

const STEP_ICONS = {
  signal_fusion: '🔀',
  credibility_check: '🔍',
  crisis_classification: '🧠',
  severity_assessment: '⚠️',
  resource_allocation: '🚒',
  simulation: '🔮',
  notification: '📢',
};

const CONFIDENCE_COLOR = (c) => {
  if (c >= 0.8) return '#34C759';
  if (c >= 0.5) return '#FF9500';
  return '#FF3B30';
};

export default function TraceScreen() {
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTraces = useCallback(async () => {
    try {
      const data = await api.getTraces();
      setTraces(data);
    } catch (e) {
      console.error('Traces fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTraces();
    const interval = setInterval(fetchTraces, 10000);
    return () => clearInterval(interval);
  }, [fetchTraces]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading Agent Traces...</Text>
      </View>
    );
  }

  const renderTrace = ({ item, index }) => {
    const icon = STEP_ICONS[item.step] || '🤖';
    const confColor = CONFIDENCE_COLOR(item.confidence);
    const time = new Date(item.timestamp).toLocaleTimeString();

    return (
      <View style={styles.traceCard}>
        <View style={styles.traceHeader}>
          <Text style={styles.traceIcon}>{icon}</Text>
          <View style={styles.traceInfo}>
            <Text style={styles.traceStep}>{item.step?.replace(/_/g, ' ').toUpperCase()}</Text>
            <Text style={styles.traceTime}>{time}</Text>
          </View>
          <View style={[styles.confBadge, { backgroundColor: confColor + '22', borderColor: confColor }]}>
            <Text style={[styles.confText, { color: confColor }]}>
              {(item.confidence * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        {item.reasoning ? (
          <View style={styles.reasoningBox}>
            <Text style={styles.reasoningLabel}>💭 Reasoning</Text>
            <Text style={styles.reasoningText}>{item.reasoning}</Text>
          </View>
        ) : null}

        {item.decision ? (
          <View style={styles.decisionBox}>
            <Text style={styles.decisionLabel}>✅ Decision</Text>
            <Text style={styles.decisionText}>{item.decision}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>🧠 AI Agent Traces</Text>
        <Text style={styles.count}>{traces.length} logs</Text>
      </View>
      <FlatList
        data={traces}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTrace}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTraces(); }} tintColor="#FF3B30" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  centered: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#8E8E93', marginTop: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { color: '#fff', fontSize: 20, fontWeight: '800' },
  count: { color: '#8E8E93', fontSize: 13 },
  traceCard: {
    backgroundColor: '#1C1C1E', borderRadius: 14, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#2C2C2E',
  },
  traceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  traceIcon: { fontSize: 24, marginRight: 12 },
  traceInfo: { flex: 1 },
  traceStep: { color: '#fff', fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  traceTime: { color: '#636366', fontSize: 11, marginTop: 2 },
  confBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  confText: { fontSize: 12, fontWeight: '700' },
  reasoningBox: { backgroundColor: '#0A0A0A', borderRadius: 10, padding: 12, marginBottom: 8 },
  reasoningLabel: { color: '#636366', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  reasoningText: { color: '#EBEBF5', fontSize: 13, lineHeight: 20 },
  decisionBox: { backgroundColor: '#0A2218', borderRadius: 10, padding: 12 },
  decisionLabel: { color: '#34C759', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  decisionText: { color: '#34C759', fontSize: 13, lineHeight: 20 },
});
