import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Form } from '../Form';

describe('Form', () => {
	it('submits typed input', () => {
		const onSubmit = vi.fn();
		render(<Form onSubmit={onSubmit} />);
		fireEvent.change(screen.getByRole('textbox'), {
			target: { value: 'test123' }
		});
		fireEvent.click(screen.getByText('Send'));
		expect(onSubmit).toHaveBeenCalledWith('test123');
	});
});
