import { vi } from 'vitest';

export const mockAxiosInstance = {
	post: vi.fn(),
	get: vi.fn(),
	interceptors: {
		request: { use: vi.fn() },
		response: { use: vi.fn() },
	},
};

export default {
	create: vi.fn(() => mockAxiosInstance),
};
