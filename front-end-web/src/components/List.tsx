import React from 'react';

type ListProps = {
	items: string[];
};

export const List = ({ items }: ListProps) => {
	return (
		<ul>
			{items.map(item => (
				<li key={item}>{item}</li>
			))}
		</ul>
	);
};
