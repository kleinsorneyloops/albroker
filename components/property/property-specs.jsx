export function PropertySpecs({ property }) {
  if (!property) return null;

  const specs = [
    { label: 'Price', value: property.price ? `$${property.price.toLocaleString()}` : 'N/A' },
    { label: 'Bedrooms', value: property.beds ?? 'N/A' },
    { label: 'Bathrooms', value: property.baths ?? 'N/A' },
    { label: 'Sq Ft', value: property.sqft ? property.sqft.toLocaleString() : 'N/A' },
    { label: 'Lot Size', value: property.lotSize ? `${property.lotSize.toLocaleString()} sq ft` : 'N/A' },
    { label: 'Year Built', value: property.yearBuilt ?? 'N/A' },
    { label: 'Type', value: property.propertyType ?? 'N/A' },
    { label: 'Stories', value: property.stories ?? 'N/A' },
    { label: 'Garage', value: property.garage ? `${property.garage} car` : 'N/A' },
  ];

  const hasSoldHistory = property.lastSoldDate || property.lastSoldPrice;

  return (
    <div className="card px-6 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="mb-1" style={{ color: 'var(--text)' }}>{property.address}</h3>
          {property.price && (
            <p className="text-2xl font-bold" style={{ color: 'var(--color-rocket)' }}>
              ${property.price.toLocaleString()}
            </p>
          )}
        </div>
        {property.photo && (
          <img
            src={property.photo}
            alt={property.address}
            className="w-full sm:w-48 h-32 object-cover rounded"
            style={{ border: '1.5px solid var(--border)' }}
          />
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {specs.map((spec) => (
          <div key={spec.label} className="panel p-3 flex flex-col">
            <span
              className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {spec.label}
            </span>
            <span className="text-lg font-medium" style={{ color: 'var(--text)' }}>{spec.value}</span>
          </div>
        ))}
      </div>

      {hasSoldHistory && (
        <div className="mt-6 pt-4" style={{ borderTop: '1px solid color-mix(in oklab, var(--border) 20%, transparent)' }}>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            Last Sale
          </p>
          <p style={{ color: 'var(--text)' }}>
            {property.lastSoldPrice && `$${property.lastSoldPrice.toLocaleString()}`}
            {property.lastSoldDate && ` on ${property.lastSoldDate}`}
          </p>
        </div>
      )}
    </div>
  );
}
