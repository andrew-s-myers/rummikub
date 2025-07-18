import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
	it('increments and decrements', () => {
		const { result } = renderHook(() => useCounter());
		expect(result.current.count).toBe(0);
		act(() => result.current.increment());
		expect(result.current.count).toBe(1);
		act(() => result.current.decrement());
		expect(result.current.count).toBe(0);
	});
});
