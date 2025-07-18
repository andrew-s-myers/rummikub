import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:5173', // adjust for your front-end dev server
		supportFile: 'cypress/support/e2e.ts',
		setupNodeEvents(on, config) {
			// add tasks if needed
		},
	},
});
