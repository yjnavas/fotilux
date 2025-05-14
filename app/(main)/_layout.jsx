import React from 'react';
import { Stack } from 'expo-router';
import ProtectedRoute from '../../components/ProtectedRoute';

const MainLayout = () => {
  return (
    <ProtectedRoute>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      />
    </ProtectedRoute>
  );
};

export default MainLayout;
