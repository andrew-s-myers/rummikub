import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate', () => {
	it('formats a date to YYYY-MM-DD', () => {
		const result = formatDate(new Date('2023-01-01'));
		expect(result).toBe('2023-01-01');
	});
});
