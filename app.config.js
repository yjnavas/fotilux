import { createProxyMiddleware } from 'http-proxy-middleware';

export default ({ config }) => {
  const originalConfig = { ...config };

  return {
    ...originalConfig,
    web: {
      ...originalConfig.web,
      bundler: 'metro',
      // Configuración para el proxy en desarrollo web
      devServer: {
        proxy: {
          // Proxy todas las solicitudes que comiencen con /api a localhost:8000
          '/users': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false,
          },
        },
      },
    },
  };
};
