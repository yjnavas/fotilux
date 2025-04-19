import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { LogBox } from 'react-native'

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer', , 'Warning: TRenderEngineProvider'])
const _layout = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');    
  }, [])
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}

export default _layout
