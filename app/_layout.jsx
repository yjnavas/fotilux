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
        animation: 'slide_from_bottom',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'vertical',
      }}
    >
      <Stack.Screen 
        name="(main)/postDetails" 
        options={{ 
          presentation: 'modal', 
          // contentStyle: { backgroundColor: 'rgba(0,0,0,0.7)' }, // Fondo semitransparente
          headerShown: false, // Ocultar header específicamente para el modal
          gestureEnabled: true, // Habilitar gestos
          gestureDirection: 'vertical', // Dirección del gesto para cerrar
          animation: 'fade', // Animación específica
        }}
      />
    </Stack>
  )
}

export default _layout
