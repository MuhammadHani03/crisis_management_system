import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, RefreshControl, Platform
} from 'react-native';
import { api } from '../services/api';

const RESOURCE_ICONS = {
  'Water Rescue Teams': '🚤',
  'Evacuation Boats':   '⛵',
  'Sandbags':           '🪨',
  'Maintenance Crew':   '🔧',
  'Water Shutoff Team': '🚰',
  'Traffic Control':    '🚦',
  'Fire Dept':          '🚒',
  'Cooling Centers':    '❄️',
  'Ambulances':         '🚑',
  'Scout Team':         '🔍',
};

// ─── Resource Card ────────────────────────────────────────────────────────────
function ResourceCard({ item }) {
  const icon = RESOURCE_ICONS[item.resource.type] || '📦';
  const dest = item.resource.destination || item.incident;
  const qty  = item.resource.quantity;

  return (
    <View style={styles.card}>
      <View style={styles.cardIconWrapper}>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.resourceName}>{item.resource.type}</Text>
        <Text style={styles.resourceDest}>
          {qty ? `${qty}× ` : ''}
          {dest}
        </Text>
      </View>
      <View style={styles.activeBadge}>
        <View style={styles.activeDot} />
        <Text style={styles.activeBadgeText}>ACTIVE</Text>
      </View>
    </View>
  );
}

// ─── Resource Screen ──────────────────────────────────────────────────────────
export default function ResourceScreen() {
  const [incidents, setIncidents]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data.filter(i => i.resources_assigned?.length > 0));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const allResources = incidents.flatMap(inc =>
    (inc.resources_assigned || []).map(r => ({
      incident: inc.location,
      resource: typeof r === 'object' ? r : { type: r, quantity: 1, destination: inc.location },
    }))
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.warn} />
        <Text style={styles.loadingText}>Loading Resources…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Structural Ambient Background Glows */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DISPATCH STATUS</Text>
          <Text style={styles.title}>Resources</Text>
        </View>
        <View style={styles.summaryBadge}>
          <Text style={styles.summaryNum}>{allResources.length}</Text>
          <Text style={styles.summaryLabel}>UNITS</Text>
        </View>
      </View>

      {/* Sub-header */}
      <Text style={styles.subheader}>
        {allResources.length} units deployed across {incidents.length} active incident{incidents.length !== 1 ? 's' : ''}
      </Text>

      {allResources.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <View style={[styles.waveStick, { height: 12 }]} />
            <View style={[styles.waveStick, { height: 22 }]} />
            <View style={[styles.waveStick, { height: 14 }]} />
          </View>
          <Text style={styles.emptyTitle}>All Units Standby</Text>
          <Text style={styles.emptySubtitle}>No resources currently deployed.</Text>
        </View>
      ) : (
        <FlatList
          data={allResources}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => <ResourceCard item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchData(); }}
              tintColor={C.warn}
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg:           '#0B0F19', // Matches signature premium dark tone
  bgCard:       'rgba(19, 26, 46, 0.7)', // Frosted glass layout base
  warn:         '#FF9500', // Tactical amber identifier
  warnBg:       'rgba(255, 149, 0, 0.05)',
  warnBorder:   'rgba(255, 149, 0, 0.2)',
  textPrimary:  '#FFFFFF',
  textSecondary:'#94A3B8', // High clarity slate gray text
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
    backgroundColor: 'rgba(255, 149, 0, 0.04)', // Soft amber flare
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
    marginBottom: 4,
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
  summaryBadge: {
    backgroundColor: '#131A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  summaryNum: {
    color: C.warn,
    fontSize: 14,
    fontWeight: '700',
  },
  summaryLabel: {
    color: C.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subheader: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 20,
  },

  // List Layout
  listContainer: {
    paddingTop: 4,
    paddingBottom: 40,
  },

  // Card Structure Refinements
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    gap: 14,
  },
  cardIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0F1524',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 20,
  },
  cardInfo: {
    flex: 1,
  },
  resourceName: {
    color: C.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  resourceDest: {
    color: C.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },

  // Active Badge (Capsules UI pattern)
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: C.warnBg,
    borderWidth: 1,
    borderColor: C.warnBorder,
    borderRadius: 24, // High rounded look
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.warn,
  },
  activeBadgeText: {
    color: C.warn,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Empty State Vector Refits
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 26, 46, 0.4)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 10,
  },
  emptyIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
    opacity: 0.5,
  },
  waveStick: {
    width: 3,
    backgroundColor: C.textSecondary,
    borderRadius: 2,
  },
  emptyTitle: {
    color: C.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: C.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
});