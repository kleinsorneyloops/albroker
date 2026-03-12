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
    <div className="bg-white rounded-lg text-neutral-600">
      <div className="px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-neutral-900 mb-1">{property.address}</h3>
            {property.price && (
              <p className="text-2xl font-bold text-primary">
                ${property.price.toLocaleString()}
              </p>
            )}
          </div>
          {property.photo && (
            <img
              src={property.photo}
              alt={property.address}
              className="w-full sm:w-48 h-32 object-cover rounded"
            />
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {spec.label}
              </span>
              <span className="text-lg font-medium text-neutral-900">{spec.value}</span>
            </div>
          ))}
        </div>

        {hasSoldHistory && (
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Last Sale
            </h4>
            <p className="text-neutral-900">
              {property.lastSoldPrice && `$${property.lastSoldPrice.toLocaleString()}`}
              {property.lastSoldDate && ` on ${property.lastSoldDate}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
