import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { api } from '../services/api';

const LOCATIONS = ['G-10', 'F-7', 'I-8', 'Downtown', 'Blue Area', 'Rawalpindi'];
const SOURCES   = ['field_report', 'social_media', 'weather_api'];

const SOURCE_META = {
  field_report: { icon: '🧑‍✈️', label: 'Field Report' },
  social_media: { icon: '📲', label: 'Social Media' },
  weather_api:  { icon: '🌦️', label: 'Weather API'  },
};

const TEMPLATES = [
  { icon: '💧', label: 'Pipe Burst (Conflict)', text: 'Water pipe burst near sector entrance. No actual flooding observed. Roads are passable.' },
  { icon: '🌊', label: 'Flood Confirmation',   text: 'Major flooding observed. Vehicles submerged. Residents evacuating. Immediate rescue needed.' },
  { icon: '✅', label: 'False Alarm',          text: 'Situation is under control. False alarm. No emergency response needed.' },
];

export default function ReportScreen() {
  const [location, setLocation] = useState('G-10');
  const [source, setSource]     = useState('field_report');
  const [content, setContent]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Missing Info', 'Please describe the situation.');
      return;
    }
    setLoading(true);
    try {
      await api.submitSignal(source, location, content);
      Alert.alert(
        '✅ Report Submitted',
        'The AI agents are now analyzing your signal. Check the Traces screen to watch the agents work in real time.'
      );
      setContent('');
    } catch {
      Alert.alert('Error', 'Could not submit. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Background Radial Ambiance */}
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FIELD OPERATIONS</Text>
          <Text style={styles.pageTitle}>Submit Report</Text>
          <Text style={styles.pageSubtitle}>
            Your signal will be analyzed by AI agents immediately.
          </Text>
        </View>

        {/* Location */}
        <Text style={styles.label}>📍 Location</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={{ paddingRight: 18 }}
        >
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              onPress={() => setLocation(loc)}
              activeOpacity={0.8}
              style={[styles.chip, location === loc && styles.chipActive]}
            >
              <Text style={[styles.chipText, location === loc && styles.chipTextActive]}>
                {loc}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Source */}
        <Text style={styles.label}>📡 Signal Source</Text>
        <View style={styles.sourceRow}>
          {SOURCES.map((s) => {
            const active = source === s;
            const meta   = SOURCE_META[s];
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setSource(s)}
                activeOpacity={0.8}
                style={[styles.sourceCard, active && styles.sourceCardActive]}
              >
                <Text style={styles.sourceIcon}>{meta.icon}</Text>
                <Text style={[styles.sourceLabel, active && styles.sourceLabelActive]}>
                  {meta.label}
                </Text>
                {active && <View style={styles.sourceActiveDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Report Content */}
        <Text style={styles.label}>📝 Report Details</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the situation in detail…"
          placeholderTextColor={C.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{content.length} characters</Text>

        {/* Quick Templates */}
        <Text style={styles.label}>⚡ Quick Templates</Text>
        <View style={styles.templateList}>
          {TEMPLATES.map((t) => (
            <TouchableOpacity
              key={t.label}
              onPress={() => setContent(t.text)}
              activeOpacity={0.8}
              style={[styles.templateBtn, content === t.text && styles.templateBtnActive]}
            >
              <Text style={styles.templateIcon}>{t.icon}</Text>
              <Text style={[styles.templateLabel, content === t.text && styles.templateLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnLoading]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading
            ? <ActivityIndicator color="#0B0F19" />
            : <Text style={styles.submitText}>🚀   Submit to AI Agents</Text>
          }
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Premium Redesign Design Tokens ───────────────────────────────────────────
const C = {
  bg:           '#0B0F19', // Premium midnight base
  bgCard:       'rgba(19, 26, 46, 0.7)', // Frosted look matching login screen
  accent:       '#FF453A', // Neon emergency coral red
  accentBg:     'rgba(255, 69, 58, 0.08)',
  accentBorder: 'rgba(255, 69, 58, 0.25)',
  textPrimary:  '#FFFFFF',
  textSecondary:'#94A3B8', // High visibility slate grey text
  textMuted:    '#475569', // Dark gray for secondary indicators
  border:       'rgba(255, 255, 255, 0.06)',
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 12,
    paddingBottom: 40,
    position: 'relative',
  },
  topGlow: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 69, 58, 0.05)',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: 20,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(48, 209, 88, 0.04)',
  },

  // Header
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: C.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  pageTitle: {
    color: C.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pageSubtitle: {
    color: C.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },

  // Labels
  label: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 20,
  },

  // Location chips (Capsules style)
  chipsScroll: {
    marginBottom: 4,
  },
  chip: {
    backgroundColor: C.bgCard,
    borderRadius: 24, // High-end rounded capsule appearance
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: {
    backgroundColor: '#131A2E',
    borderColor: C.accent,
  },
  chipText: {
    color: C.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: C.accent,
    fontWeight: '700',
  },

  // Source cards
  sourceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sourceCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  sourceCardActive: {
    backgroundColor: '#131A2E',
    borderColor: C.accent,
  },
  sourceIcon: {
    fontSize: 22,
  },
  sourceLabel: {
    color: C.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  sourceLabelActive: {
    color: C.textPrimary,
  },
  sourceActiveDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },

  // Text area
  textArea: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    padding: 16,
    color: C.textPrimary,
    fontSize: 15,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: C.border,
    minHeight: 130,
  },
  charCount: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 6,
  },

  // Templates
  templateList: {
    gap: 8,
  },
  templateBtn: {
    backgroundColor: C.bgCard,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  templateBtnActive: {
    backgroundColor: '#131A2E',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  templateIcon: {
    fontSize: 18,
  },
  templateLabel: {
    color: C.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  templateLabelActive: {
    color: C.textPrimary,
  },

  // Submit button matching image high contrast login node
  submitBtn: {
    backgroundColor: '#E2E8F0', 
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  submitBtnLoading: {
    opacity: 0.6,
  },
  submitText: {
    color: '#0B0F19',
    fontSize: 15,
    fontWeight: '700',
  },
});