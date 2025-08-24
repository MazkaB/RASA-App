import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Guide screens
import GuideDashboardScreen from './screens/guide/GuideDashboardScreen';
import GuideBookingsScreen from './screens/guide/GuideBookingsScreen';
import GuideCalendarScreen from './screens/guide/GuideCalendarScreen';
import GuideMessagesScreen from './screens/guide/GuideMessagesScreen';
import GuideAnalyticsScreen from './screens/guide/GuideAnalyticsScreen';
import GuideProfileScreen from './screens/guide/GuideProfileScreen';

const Tab = createBottomTabNavigator();

export default function GuideApp({ userProfile, onLogout }) {
  return (
    <NavigationContainer independent={true}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Dashboard':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Bookings':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'Calendar':
                iconName = focused ? 'time' : 'time-outline';
                break;
              case 'Messages':
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                break;
              case 'Analytics':
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'ellipse-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2E7D32',
          tabBarInactiveTintColor: '#9aa0a6',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0.5,
            borderTopColor: '#e8eaed',
            paddingBottom: 8,
            paddingTop: 8,
            height: 65,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          }
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={GuideDashboardScreen}
          initialParams={{ userProfile }}
        />
        <Tab.Screen 
          name="Bookings" 
          component={GuideBookingsScreen}
          initialParams={{ userProfile }}
        />
        <Tab.Screen 
          name="Calendar" 
          component={GuideCalendarScreen}
          initialParams={{ userProfile }}
        />
        <Tab.Screen 
          name="Messages" 
          component={GuideMessagesScreen}
          initialParams={{ userProfile }}
        />
        <Tab.Screen 
          name="Analytics" 
          component={GuideAnalyticsScreen}
          initialParams={{ userProfile }}
        />
        <Tab.Screen 
          name="Profile" 
          component={GuideProfileScreen}
          initialParams={{ userProfile, onLogout }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}