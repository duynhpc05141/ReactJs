import React from 'react';

export const TruncatedContent = ({ content, maxLength }) => {
	const truncatedContent =
		content.length > maxLength
			? content.slice(0, maxLength) + '...'
			: content;

	return (
		<p
			className="mb-4 italic"
			dangerouslySetInnerHTML={{ __html: truncatedContent }}
		/>
	);
};
