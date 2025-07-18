import React from 'react';

type ToggleProps = {
	on: boolean;
	toggle: () => void;
};

export const Toggle = ({ on, toggle }: ToggleProps) => {
	return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
};
