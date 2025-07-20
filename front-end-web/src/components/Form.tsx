import React, { useState } from 'react';

type FormProps = {
	onSubmit: (value: string) => void;
};

export const Form = ({ onSubmit }: FormProps) => {
	const [text, setText] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(text);
		setText('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				value={text}
				onChange={e => setText(e.target.value)}
			/>
			<button type="submit">Send</button>
		</form>
	);
};
