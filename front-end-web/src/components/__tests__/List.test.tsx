import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { List } from '../List';

describe('List', () => {
	it('displays all items passed in', () => {
		const items = ['Apple', 'Banana', 'Carrot'];
		render(<List items={items} />);
		items.forEach(item => {
			expect(screen.getByText(item)).toBeInTheDocument();
		});
	});
});
