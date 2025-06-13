'use client';

import Image from 'next/image';

const sampleProperties = [
  {
    id: 1,
    title: "Atelier (Lower Haight)",
    location: "Lower Haight, San Francisco",
    description: "Modern artist's loft in historic building with abundant natural light and creative atmosphere",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Casa (Mission)",
    location: "Mission District, San Francisco",
    description: "Vibrant home in the heart of the Mission, surrounded by murals and cultural landmarks",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Jiā (Sunset)",
    location: "Sunset District, San Francisco",
    description: "Cozy space with ocean views and easy access to Golden Gate Park",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
  }
];

export default function Home() {
  return (
    <div>
      <header className="header">
        <h1>Neighborhood Homes</h1>
        <p>Find your perfect stay in San Francisco's most charming neighborhoods</p>
      </header>

      <main className="container">
        <div className="properties-grid">
          {sampleProperties.map(property => (
            <div key={property.id} className="property-card">
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="property-content">
                <h2 className="property-title">{property.title}</h2>
                <p className="property-location">{property.location}</p>
                <p className="property-description">{property.description}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="coming-soon">More Coming Soon...</p>
      </main>
    </div>
  );
}
