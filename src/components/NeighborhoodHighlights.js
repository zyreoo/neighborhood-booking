import Image from 'next/image';

const highlights = [
  {
    title: 'Local Cafes',
    description: 'Start your day at our charming neighborhood cafes',
    image: '/images/cafe.jpg',
    icon: '☕'
  },
  {
    title: 'Green Spaces',
    description: 'Enjoy our beautiful parks and community gardens',
    image: '/images/park.jpg',
    icon: '🌳'
  },
  {
    title: 'Farmers Markets',
    description: 'Fresh local produce and artisanal goods every weekend',
    image: '/images/market.jpg',
    icon: '🥕'
  }
];

export default function NeighborhoodHighlights() {
  return (
    <section className="neighborhood-highlights">
      <h2>Life in Our Neighborhood</h2>
      <div className="highlights-grid">
        {highlights.map((highlight, index) => (
          <div key={index} className="highlight-card">
            <div className="highlight-image-container">
              <div className="highlight-icon">{highlight.icon}</div>
              <div className="highlight-image-placeholder" 
                style={{
                  backgroundColor: 'var(--soft-cream)',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'var(--house-orange)',
                  borderRadius: 'var(--border-radius) var(--border-radius) 0 0'
                }}
              >
                {highlight.icon}
              </div>
            </div>
            <div className="highlight-content">
              <h3>{highlight.title}</h3>
              <p>{highlight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 