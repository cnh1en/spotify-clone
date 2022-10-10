import React from 'react';

const RepeatOne = ({ color, ...props }: any) => {
	return (
		<div className="flex items-center gap-0.5">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6"
				color={color}
				cursor="pointer"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
				/>
			</svg>

			<span className="text-[12px]" style={{ color }}>
				1
			</span>
		</div>
	);
};

export default RepeatOne;
