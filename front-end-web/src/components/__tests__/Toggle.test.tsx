import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { Toggle } from '../Toggle';

const TestWrapper = () => {
	const [on, setOn] = useState(false);
	return <Toggle on={on} toggle={() => setOn(prev => !prev)} />;
};

describe('Toggle', () => {
	it('toggles label on click', () => {
		render(<TestWrapper />);
		const btn = screen.getByRole('button');
		expect(btn).toHaveTextContent('OFF');
		fireEvent.click(btn);
		expect(btn).toHaveTextContent('ON');
	});
});
