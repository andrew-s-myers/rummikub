import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Input } from '../Input';

describe('Input', () => {
	it('renders and accepts input text', () => {
		let value = '';
		const setValue = (v: string) => (value = v);
		render(<Input value={value} onChange={setValue} />);
		fireEvent.change(screen.getByPlaceholderText('Type something'), {
			target: { value: 'hello' }
		});
		expect(value).toBe('hello');
	});
});
