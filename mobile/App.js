import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ReportScreen from './screens/ReportScreen';
import TraceScreen from './screens/TraceScreen';
import ResourceScreen from './screens/ResourceScreen';
import IncidentDetailScreen from './screens/IncidentDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS = {
  Home: '⚡',      // Operations Core Matrix
  Report: '📢',    // Telemetry Broadcast
  Traces: '🧠',    // Signal Neural Engine
  Resources: '🛡️', // Fleet / Support Logistics
};

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => <Text style={{ fontSize: 18 }}>{TAB_ICONS[route.name]}</Text>,
        tabBarActiveTintColor: '#FF453A', // Neon Accent Red
        tabBarInactiveTintColor: '#64748B', // Muted Premium Slate
        tabBarStyle: {
          backgroundColor: '#0F1322', 
          borderTopColor: 'rgba(255, 255, 255, 0.06)',
          height: 80,
          paddingBottom: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
        headerStyle: { 
          backgroundColor: '#0B0F19',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255, 255, 255, 0.05)',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700', fontSize: 17, letterSpacing: 0.3 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Urban Crisis Management' }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: 'Submit Report' }}
      />
      <Tab.Screen
        name="Traces"
        component={TraceScreen}
        options={{ title: 'AI Multi-Signal Traces' }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourceScreen}
        options={{ title: 'Resources Matrix' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={HomeTabs} />
      <Stack.Screen
        name="IncidentDetail"
        component={IncidentDetailScreen}
        options={{
          headerShown: true,
          title: 'Incident Record Details',
          headerStyle: { 
            backgroundColor: '#0B0F19',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.05)',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Subtle background ambient glow effect */}
        <View style={styles.ambientGlow} />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#FF453A" style={styles.loadingSpinner} />
          <Text style={styles.loadingTitle}>Initializing Core Systems</Text>
          <Text style={styles.loadingCaption}>Powered by Agentis AI</Text>
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />
      {user ? <AppNavigator /> : <LoginScreen />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0B0F19',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 69, 58, 0.08)',
    top: '35%',
    blurRadius: 100,
  },
  loadingCard: {
    alignItems: 'center',
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  loadingCaption: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
});