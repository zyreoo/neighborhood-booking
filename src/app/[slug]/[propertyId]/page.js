export default function PropertyPage({ params }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Property Details</h1>
      <p>Location: {params.slug}</p>
      <p>Property ID: {params.propertyId}</p>
      <p>Hi! This is a placeholder for the property details page.</p>
    </div>
  );
} 