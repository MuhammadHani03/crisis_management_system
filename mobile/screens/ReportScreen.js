import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { api } from '../services/api';

const LOCATIONS = ['G-10', 'F-7', 'I-8', 'Downtown', 'Blue Area', 'Rawalpindi'];
const SOURCES = ['field_report', 'social_media', 'weather_api'];

export default function ReportScreen() {
  const [location, setLocation] = useState('G-10');
  const [source, setSource] = useState('field_report');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Missing Info', 'Please describe the situation.');
      return;
    }
    setLoading(true);
    try {
      await api.submitSignal(source, location, content);
      Alert.alert('✅ Report Submitted', 'The AI agents are now analyzing your signal. Check the Traces screen to watch the agents work in real time.');
      setContent('');
    } catch (e) {
      Alert.alert('Error', 'Could not submit. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#000' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.pageTitle}>Submit Field Report</Text>
        <Text style={styles.pageSubtitle}>Your report will be analyzed by the AI agents immediately.</Text>

        {/* Location Selector */}
        <Text style={styles.label}>📍 Location</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[styles.chip, location === loc && styles.chipActive]}
              onPress={() => setLocation(loc)}
            >
              <Text style={[styles.chipText, location === loc && styles.chipTextActive]}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Source Selector */}
        <Text style={styles.label}>📡 Signal Source</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          {SOURCES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, source === s && styles.chipActive]}
              onPress={() => setSource(s)}
            >
              <Text style={[styles.chipText, source === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Report Content */}
        <Text style={styles.label}>📝 Report Details</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe the situation (e.g., 'Water pipe burst on main street, no flooding detected.')"
          placeholderTextColor="#636366"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        {/* Quick Fill Buttons */}
        <Text style={styles.label}>⚡ Quick Templates</Text>
        <TouchableOpacity style={styles.templateBtn} onPress={() => setContent('Water pipe burst near sector entrance. No actual flooding observed. Roads are passable.')}>
          <Text style={styles.templateText}>💧 Pipe Burst (Conflict Report)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.templateBtn} onPress={() => setContent('Major flooding observed. Vehicles submerged. Residents evacuating. Immediate rescue needed.')}>
          <Text style={styles.templateText}>🌊 Flood Confirmation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.templateBtn} onPress={() => setContent('Situation is under control. False alarm. No emergency response needed.')}>
          <Text style={styles.templateText}>✅ False Alarm Report</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>🚀 Submit to AI Agents</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 60 },
  pageTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  pageSubtitle: { color: '#8E8E93', fontSize: 14, marginBottom: 24, lineHeight: 20 },
  label: { color: '#EBEBF5', fontSize: 14, fontWeight: '600', marginBottom: 10, marginTop: 16 },
  chipsScroll: { marginBottom: 4 },
  chip: {
    backgroundColor: '#1C1C1E', borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 8, marginRight: 8, borderWidth: 1, borderColor: '#2C2C2E',
  },
  chipActive: { backgroundColor: '#FF3B30', borderColor: '#FF3B30' },
  chipText: { color: '#8E8E93', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  textArea: {
    backgroundColor: '#1C1C1E', borderRadius: 14, padding: 16,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2C2C2E',
    minHeight: 140,
  },
  templateBtn: {
    backgroundColor: '#1C1C1E', borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: '#2C2C2E',
  },
  templateText: { color: '#EBEBF5', fontSize: 14 },
  submitBtn: {
    backgroundColor: '#FF3B30', borderRadius: 14, padding: 18,
    alignItems: 'center', marginTop: 20,
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
