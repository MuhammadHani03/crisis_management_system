import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      Alert.alert('Auth Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        
        {/* Background Ambient Radial Lights */}
        <View style={styles.topAmbientRed} />
        <View style={styles.centerAmbientTeal} />

        {/* Logo/Identity Section */}
        <View style={styles.logoHeader}>
          <View style={styles.logoBadgeGraphic}>
            <View style={styles.waveformStick1} />
            <View style={styles.waveformStick2} />
            <View style={styles.waveformStick3} />
            <View style={styles.waveformStick4} />
          </View>
          <Text style={styles.logoTitle}>Urban Crisis</Text>
          <Text style={styles.logoTitle}>Management</Text>
          <Text style={styles.logoSubtitle}>AI-powered Multi-Signal Emergency Response</Text>
        </View>

        {/* Premium Translucent Card Container */}
        <View style={styles.formCard}>
          <Text style={styles.loginCardTitle}>{isLogin ? 'Login' : 'Create Account'}</Text>
          
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email or address"
              placeholderTextColor="#475569"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#475569"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleAuth} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#0B0F19" />
            ) : (
              <Text style={styles.btnText}>{isLogin ? 'Login' : 'Create Account'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Continue as Public User</Text>
          </TouchableOpacity>
        </View>

        {/* Switch System Interface */}
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerBrandText}>Powered by Agentis AI</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B0F19' // Absolute Premium Deep Midnight Blue Base
  },
  inner: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 24,
    position: 'relative',
  },
  topAmbientRed: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    zIndex: 0,
  },
  centerAmbientTeal: {
    position: 'absolute',
    bottom: 100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(48, 209, 88, 0.08)',
    zIndex: 0,
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: 28,
    zIndex: 1,
  },
  logoBadgeGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#131A2E',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  waveformStick1: { width: 3, height: 12, backgroundColor: '#FF453A', borderRadius: 2 },
  waveformStick2: { width: 3, height: 24, backgroundColor: '#FF453A', borderRadius: 2 },
  waveformStick3: { width: 3, height: 18, backgroundColor: '#30D158', borderRadius: 2 },
  waveformStick4: { width: 3, height: 10, backgroundColor: '#30D158', borderRadius: 2 },
  logoTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.2,
  },
  logoSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  formCard: { 
    backgroundColor: 'rgba(19, 26, 46, 0.7)', // Frosted look
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1,
  },
  loginCardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: { 
    color: '#94A3B8', 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 6,
    marginTop: 10
  },
  inputWrapper: {
    width: '100%',
    backgroundColor: '#0F1524',
    borderRadius: 12, // Capsule styling matching the reference
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 12,
  },
  input: {
    padding: 14,
    color: '#FFFFFF',
    fontSize: 15,
  },
  btn: {
    backgroundColor: '#E2E8F0', // Sleek soft white capsule button
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  btnText: { 
    color: '#0F1524', 
    fontSize: 15, 
    fontWeight: '700' 
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  forgotText: {
    color: '#38BDF8', // Cyan hyper-link text accent
    fontSize: 13,
    fontWeight: '500',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 10,
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  switchBtn: { 
    alignItems: 'center', 
    marginTop: 24,
    zIndex: 1,
  },
  switchText: { 
    color: '#94A3B8', 
    fontSize: 13,
    fontWeight: '500'
  },
  footerBrandText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 24,
  },
});