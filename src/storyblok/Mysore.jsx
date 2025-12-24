import { storyblokEditable, renderRichText } from '@storyblok/react';

export default function Mysore({ blok }) {
	// Convert rich text body to HTML
	const bodyHTML = blok.body ? renderRichText(blok.body) : null;

	return (
		<main {...storyblokEditable(blok)} style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
			{/* Show main image if it exists */}
			{blok.main_image?.filename && (
				<div style={{ marginBottom: '30px' }}>
					<img 
						src={blok.main_image.filename} 
						alt={blok.main_image.alt || blok.name}
						style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
					/>
				</div>
			)}

			{/* Show title if it exists */}
			{blok.name && (
				<h1 style={{ marginBottom: '20px', fontSize: '2.5rem' }}>{blok.name}</h1>
			)}

			{/* Show introduction text if it exists */}
			{blok.introduction && (
				<p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '30px', color: '#666' }}>
					{blok.introduction}
				</p>
			)}

			{/* Show main content body if it exists */}
			{bodyHTML && (
				<div 
					style={{ lineHeight: '1.8', fontSize: '1.1rem' }}
					dangerouslySetInnerHTML={{ __html: bodyHTML }}
				/>
			)}
		</main>
	);
}
