import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  RefreshControl, ActivityIndicator, Platform
} from 'react-native';
import { api } from '../services/api';

const STEP_ICONS = {
  signal_fusion:        '🔀',
  credibility_check:    '🔍',
  crisis_classification:'🧠',
  severity_assessment:  '⚠️',
  resource_allocation:  '🚒',
  simulation:           '🔮',
  notification:         '📢',
};

const confidenceColor = (c) => {
  if (c >= 0.8) return { color: C.ok,   bg: 'rgba(48, 209, 88, 0.06)',  border: 'rgba(48, 209, 88, 0.2)' };
  if (c >= 0.5) return { color: C.warn,  bg: 'rgba(255, 149, 0, 0.05)', border: 'rgba(255, 149, 0, 0.15)' };
  return             { color: C.accent, bg: 'rgba(255, 69, 58, 0.06)',  border: 'rgba(255, 69, 58, 0.2)' };
};

// ─── Trace Card ───────────────────────────────────────────────────────────────
function TraceCard({ item }) {
  const icon     = STEP_ICONS[item.step] || '🤖';
  const conf     = confidenceColor(item.confidence);
  const time     = new Date(item.timestamp).toLocaleTimeString();
  const stepName = item.step?.replace(/_/g, ' ').toUpperCase();

  return (
    <View style={styles.traceCard}>

      {/* Card header */}
      <View style={styles.traceHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.traceIcon}>{icon}</Text>
        </View>
        <View style={styles.traceInfo}>
          <Text style={styles.traceStep}>{stepName}</Text>
          <Text style={styles.traceTime}>{time}</Text>
        </View>
        <View style={[styles.confBadge, { backgroundColor: conf.bg, borderColor: conf.border }]}>
          <Text style={[styles.confText, { color: conf.color }]}>
            {(item.confidence * 100).toFixed(0)}% CONFIDENCE
          </Text>
        </View>
      </View>

      {/* Reasoning */}
      {item.reasoning ? (
        <View style={styles.reasoningBox}>
          <Text style={styles.reasoningLabel}>💭 REASONING</Text>
          <Text style={styles.reasoningText}>{item.reasoning}</Text>
        </View>
      ) : null}

      {/* Decision */}
      {item.decision ? (
        <View style={[styles.decisionBox, { backgroundColor: conf.bg, borderColor: conf.border }]}>
          <Text style={[styles.decisionLabel, { color: conf.color }]}>✅ DECISION</Text>
          <Text style={[styles.decisionText, { color: conf.color }]}>{item.decision}</Text>
        </View>
      ) : null}

    </View>
  );
}

// ─── Trace Screen ─────────────────────────────────────────────────────────────
export default function TraceScreen() {
  const [traces, setTraces]       = useState([]);
  const [loading, setLoading]     = useState(true);
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
        <ActivityIndicator size="large" color={C.accent} />
        <Text style={styles.loadingText}>Loading Agent Traces…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dynamic Structural Ambient Glow Backdrops */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>LIVE PIPELINE</Text>
          <Text style={styles.title}>Agent Traces</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{traces.length} logs</Text>
        </View>
      </View>

      <FlatList
        data={traces}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TraceCard item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchTraces(); }}
            tintColor={C.accent}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           '#0B0F19', // Premium midnight base canvas
  bgCard:       'rgba(19, 26, 46, 0.7)', // Frosted glass layout frame
  bgDeep:       '#0F1524', // Internal capsule panels
  accent:       '#FF453A', // Neon emergency red signal
  warn:         '#FF9500', // Beacon amber signal
  ok:           '#30D158', // Neon wave audio green
  textPrimary:  '#FFFFFF',
  textSecondary:'#94A3B8', // Slate grey labels
  textMuted:    '#475569',
  border:       'rgba(255, 255, 255, 0.06)',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 20,
    position: 'relative',
  },
  topGlow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 69, 58, 0.04)',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 60,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(48, 209, 88, 0.03)',
  },
  centered: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: C.textSecondary,
    marginTop: 14,
    fontSize: 14,
    fontWeight: '500',
  },

  // Header Layout
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: '#131A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countText: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  // List Layout
  listContainer: {
    paddingTop: 4,
    paddingBottom: 40,
  },

  // Trace Card Frame
  traceCard: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  traceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0F1524',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  traceIcon: {
    fontSize: 16,
  },
  traceInfo: {
    flex: 1,
  },
  traceStep: {
    color: C.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  traceTime: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  confBadge: {
    borderRadius: 24, // High rounded premium look
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  confText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Reasoning Container
  reasoningBox: {
    backgroundColor: C.bgDeep,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  reasoningLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  reasoningText: {
    color: C.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Decision Container
  decisionBox: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  decisionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  decisionText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    opacity: 0.95,
  },
});