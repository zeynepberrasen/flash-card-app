import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';
import { initWidgetService } from '../services/widgetService';

export default function RootLayout() {
  useEffect(() => {
    // Initialize home screen widget synchronization & listeners
    const cleanup = initWidgetService();
    return cleanup;
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.card,
          },
          headerTintColor: Colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
            color: Colors.text,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Flashcard App',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="deck/[id]"
          options={{
            title: 'Deck Details',
            headerBackTitle: 'Decks',
          }}
        />
        <Stack.Screen
          name="study/[id]"
          options={{
            title: 'Study Session',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="modal/deck"
          options={{
            presentation: 'modal',
            title: 'Deck',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="modal/card"
          options={{
            presentation: 'modal',
            title: 'Flashcard',
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
    </>
  );
}
