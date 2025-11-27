import React from "react";

const PriceTable = ({ data, t }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-600 mt-2">
        No price data found for the given filters.
      </p>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-2">State</th>
            <th className="px-4 py-2">District</th>
            <th className="px-4 py-2">Market</th>
            <th className="px-4 py-2">Commodity</th>
            <th className="px-4 py-2">Min Price</th>
            <th className="px-4 py-2">Max Price</th>
            <th className="px-4 py-2">Modal Price</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 10).map((item, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{item.state}</td>
              <td className="px-4 py-2">{item.district}</td>
              <td className="px-4 py-2">{item.market}</td>
              <td className="px-4 py-2">{item.commodity}</td>
              <td className="px-4 py-2">
                ₹{item.minPrice || item.min_price || 0}
              </td>
              <td className="px-4 py-2">
                ₹{item.maxPrice || item.max_price || 0}
              </td>
              <td className="px-4 py-2">
                ₹{item.modalPrice || item.modal_price || 0}
              </td>
              <td className="px-4 py-2">
                {item.arrivalDate || item.arrival_date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 10 && (
        <p className="text-gray-500 text-sm mt-2">
          Showing 10 of {data.length} results
        </p>
      )}
    </div>
  );
};

export default PriceTable;
