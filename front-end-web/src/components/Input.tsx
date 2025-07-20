import React from 'react';

type InputProps = {
	value: string;
	onChange: (val: string) => void;
};

export const Input = ({ value, onChange }: InputProps) => {
	return (
		<input
			type="text"
			placeholder="Type something"
			value={value}
			onChange={e => onChange(e.target.value)}
		/>
	);
};
