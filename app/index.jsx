import { Redirect } from 'expo-router';

console.log('cargando index')
export default function Index() {
  return <Redirect href="/login" />
}