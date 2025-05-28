import React from 'react'
import { Stack } from 'expo-router'
import { LogBox } from 'react-native'
import { AuthProvider } from '../context/AuthContext'

LogBox.ignoreLogs([
  'Warning: TNodeChildrenRenderer',
  'Warning: MemoizedTNodeRenderer',
  'Warning: TRenderEngineProvider',
  'Support for defaultProps will be removed from function components in a future major release'
])
const _layout = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
          animationDuration: 300,
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </AuthProvider>
  )
}

export default _layout
