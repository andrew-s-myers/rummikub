import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		host: '0.0.0.0',
		port: Number(process.env.VITE_PORT) || 5173,
		hmr: {
			port: 5173,
		},
		// Allow requests from other Docker containers
		cors: {
			origin: true,
			credentials: true,
		},
		// Secure: only allow specific hostnames for container-to-container communication
		allowedHosts: [
			'localhost',
			'127.0.0.1',
			'front-end-web',  // Docker service name (stable across networks)
		],
		strictPort: true,
	},
});
