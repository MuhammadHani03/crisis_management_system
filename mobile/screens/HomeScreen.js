import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Alert, ActivityIndicator, Platform, Animated
} from 'react-native';
import IncidentCard from '../components/IncidentCard';
import { api } from '../services/api';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const MOCK_COORDS = {
  'G-10': { lat: 33.7215, lng: 73.0433 },
  'F-7': { lat: 33.7181, lng: 73.0631 },
  'I-8': { lat: 33.6844, lng: 73.0479 },
  'Downtown': { lat: 33.7294, lng: 73.0931 },
};

// ─── Live Dot with pulse animation ───────────────────────────────────────────
function LiveDot() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 2.2, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.0, duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.liveDotWrapper}>
      <Animated.View style={[styles.liveDotRing, { transform: [{ scale }], opacity }]} />
      <View style={styles.liveDotCore} />
    </View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, color, bg, border, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.statCard,
        { borderColor: active ? color : 'rgba(255, 255, 255, 0.05)' },
        active && styles.statCardActive,
      ]}
    >
      <View style={styles.cardIndicatorRow}>
        <View style={[styles.miniWave, { backgroundColor: color, height: 6 }]} />
        <View style={[styles.miniWave, { backgroundColor: color, height: 12 }]} />
        <View style={[styles.miniWave, { backgroundColor: color, height: 8 }]} />
      </View>
      <Text style={[styles.statNum, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setMenuOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setMenuOpen(false));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch {
      Alert.alert(
        'Connection Error',
        'Cannot reach backend. Make sure server is running and your IP is set correctly in api.js'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const onRefresh = () => { setRefreshing(true); fetchIncidents(); };

  const count = (level) =>
    incidents.filter(i => i.severity?.toUpperCase() === level).length;

  const critical = count('HIGH') + count('CRITICAL');
  const medium = count('MEDIUM');
  const resolved = incidents.filter(i => i.status === 'Resolved').length;

  const filtered =
    filter === 'CRITICAL' ? incidents.filter(i => ['HIGH', 'CRITICAL'].includes(i.severity?.toUpperCase())) :
      filter === 'MEDIUM' ? incidents.filter(i => i.severity?.toUpperCase() === 'MEDIUM') :
        filter === 'RESOLVED' ? incidents.filter(i => i.status === 'Resolved') :
          incidents;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.accent} />
        <Text style={styles.loadingText}>Connecting to Crisis Backend…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ambient background glows directly copied from image look */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.eyebrow}>COMMAND CENTER</Text>
          <Text style={styles.title}>Alerts Feed</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.liveBadge}>
            <LiveDot />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <TouchableOpacity style={styles.menuIconButton} onPress={openMenu} activeOpacity={0.75}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

        </View>
      </View>

      {/* Stat Cards Matrix — Premium Frosted Capsules */}
      <View style={styles.statsGrid}>
        <StatCard
          value={critical}
          label="Critical"
          color={C.accent}
          bg={C.accentBg}
          border={C.accentBorder}
          active={filter === 'CRITICAL'}
          onPress={() => setFilter(f => f === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
        />
        <StatCard
          value={medium}
          label="Medium"
          color={C.warn}
          bg={C.warnBg}
          border={C.warnBorder}
          active={filter === 'MEDIUM'}
          onPress={() => setFilter(f => f === 'MEDIUM' ? 'ALL' : 'MEDIUM')}
        />
        <StatCard
          value={resolved}
          label="Resolved"
          color={C.ok}
          bg={C.okBg}
          border={C.okBorder}
          active={filter === 'RESOLVED'}
          onPress={() => setFilter(f => f === 'RESOLVED' ? 'ALL' : 'RESOLVED')}
        />
        <StatCard
          value={incidents.length}
          label="Total"
          color={C.textPrimary}
          bg={C.subtleBg}
          border={C.subtleBorder}
          active={filter === 'ALL'}
          onPress={() => setFilter('ALL')}
        />
      </View>

      {/* Section Divider Line & Label */}
      <View style={styles.sectionLabelContainer}>
        <Text style={styles.sectionLabel}>
          {filter === 'ALL' ? 'ACTIVE INCIDENTS' : `FILTERED · ${filtered.length} SHOWN`}
        </Text>
        <View style={styles.labelLine} />
      </View>

      {/* Feed Area Container */}
      {filtered.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <View style={[styles.waveStick, { height: 14, backgroundColor: C.warn }]} />
            <View style={[styles.waveStick, { height: 28, backgroundColor: C.warn }]} />
            <View style={[styles.waveStick, { height: 18, backgroundColor: C.ok }]} />
          </View>
          <Text style={styles.emptyTitle}>System Nominal</Text>
          <Text style={styles.emptySubtitle}>No incidents in this category.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              onPress={() => navigation.navigate('IncidentDetail', { incident: item })}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={C.accent}
              titleColor="#94A3B8"
            />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {menuOpen && (
        // ─── Styled Sidebar Menu Markup ───────────────────────────────────────────────
        <View style={styles.overlayContainer} pointerEvents="box-none">
          {/* Darkened blur-effect background overlay layer */}
          <Animated.View style={[styles.overlayBackground, { opacity: overlayAnim }]} />

          {/* Dismiss area wrapper */}
          <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={closeMenu} />

          {/* Translucent Sliding Side Panel Content Container */}
          <Animated.View style={[styles.sidePanel, { transform: [{ translateX: slideAnim }] }]}>

            {/* Panel Brand Identity Section */}
            <View style={styles.sidePanelHeader}>
              <View style={styles.sideLogoBadge}>
                <Text style={styles.sideLogoIcon}>🚨</Text>
              </View>
              <View style={styles.sideTitleGroup}>
                <Text style={styles.sideAppTitle}>Urban Crisis</Text>
                <Text style={styles.sideAppSubtitle}>COMMAND PORTAL</Text>
              </View>
            </View>

            {/* Center Nav Space Placeholder (If you add links later) */}
            <View style={styles.sidePanelBody} />

            {/* Panel Action Footer Section */}
            <View style={styles.sidePanelFooter}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </View>
      )}
    </View>
  );
}

// ─── Premium Image Theme Tokens ───────────────────────────────────────────────
const C = {
  bg: '#0B0F19',
  accent: '#FF453A',
  accentBg: 'rgba(255, 69, 58, 0.06)',
  accentBorder: 'rgba(255, 69, 58, 0.15)',
  warn: '#FF9500',
  warnBg: 'rgba(255, 149, 0, 0.05)',
  warnBorder: 'rgba(255, 149, 0, 0.12)',
  ok: '#30D158',
  okBg: 'rgba(48, 209, 88, 0.05)',
  okBorder: 'rgba(48, 209, 88, 0.12)',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#475569',
  subtleBg: 'rgba(19, 26, 46, 0.6)',
  subtleBorder: 'rgba(255, 255, 255, 0.06)',
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
    top: -80,
    right: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255, 69, 58, 0.06)',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 120,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(48, 209, 88, 0.04)',
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
    marginVertical: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 4,
  },
  headerTitleGroup: {
    flex: 1,
  },
  appHeading: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuIconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#131A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveDotWrapper: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotRing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.accent,
  },
  liveDotCore: {
    width: 6,
    height: 3,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  liveText: {
    color: C.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Stats Grid Refinement
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(19, 26, 46, 0.7)',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    position: 'relative',
  },
  cardIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.6,
  },
  miniWave: {
    width: 2,
    borderRadius: 1,
  },
  statCardActive: {
    backgroundColor: '#131A2E',
    borderWidth: 1.5,
  },
  statNum: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    letterSpacing: 0.2,
  },

  // Section Label Layout
  sectionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSecondary,
    letterSpacing: 0.8,
  },
  labelLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  // Feed Scroll Space
  listContainer: {
    paddingBottom: 32,
  },

  // High-End Empty Feed State
  emptyState: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(19, 26, 46, 0.4)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.subtleBorder,
  },
  emptyIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  waveStick: {
    width: 3,
    borderRadius: 2,
    opacity: 0.8,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  overlayBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  sidePanel: {
    width: 280,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#05070E',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 32,
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  sidePanelHeader: {
    marginBottom: 28,
  },
  sideLogoBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#131A2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 18,
  },
  sideLogoIcon: {
    fontSize: 26,
  },
  sideAppTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  sideAppSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  sidePanelFooter: {
    paddingBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#FF453A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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