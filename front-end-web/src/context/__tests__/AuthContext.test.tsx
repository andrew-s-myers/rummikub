// MUST BE FIRST — so vitest hoists the mock
vi.mock('axios');

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { type User } from '../AuthContext';
import { mockAxiosInstance } from '../../../__mocks__/axios';

describe('AuthContext', () => {
	const fakeUser: User = {
		id: 1,
		name: 'Jane Doe',
		email: 'jane@example.com'
	};

	const token = 'mock-token';

	beforeEach(() => {
		vi.resetAllMocks();
		localStorage.clear();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<AuthProvider>{children}</AuthProvider>
	);

	it('initializes with null user and token', () => {
		const { result } = renderHook(() => useAuth(), { wrapper });
		expect(result.current.user).toBe(null);
		expect(result.current.token).toBe(null);
	});

	it('login sets user and token correctly', async () => {
		// ✅ correct axios shape: { data: { user, token } }
		mockAxiosInstance.post.mockResolvedValueOnce({
			data: {
				user: fakeUser,
				token
			}
		});

		const { result } = renderHook(() => useAuth(), { wrapper });

		await act(() =>
			result.current.login({
				email: 'jane@example.com',
				password: 'password'
			})
		);

		expect(result.current.user).toEqual(fakeUser);
		expect(result.current.token).toBe(token);
		expect(localStorage.getItem('token')).toBe(token);
		expect(mockAxiosInstance.post).toHaveBeenCalledWith('/login', {
			email: 'jane@example.com',
			password: 'password'
		});
	});

	it('logout clears user and token', async () => {
		mockAxiosInstance.post.mockResolvedValue({});

		const { result } = renderHook(() => useAuth(), { wrapper });

		// simulate a login
		mockAxiosInstance.post.mockResolvedValueOnce({
			data: {
				user: fakeUser,
				token
			}
		});

		await act(() =>
			result.current.login({
				email: 'jane@example.com',
				password: 'password'
			})
		);

		await act(() => result.current.logout());

		expect(result.current.user).toBe(null);
		expect(result.current.token).toBe(null);
		expect(localStorage.getItem('token')).toBe(null);
		expect(mockAxiosInstance.post).toHaveBeenCalledWith('/logout');
	});
});
