import { defineConfig } from 'vitest/config';

export default defineConfig({
	server: {
		host: '0.0.0.0',
		port: 51999,
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/tests/setup.ts', // optional
		open: false, // don't auto-launch browser
	},
});
