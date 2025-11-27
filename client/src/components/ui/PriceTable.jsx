import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PriceTable = ({ data, t }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!data || data.length === 0) {
    return (
      <p className="text-gray-600 mt-2">
        No price data found for the given filters.
      </p>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
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
            {currentData.map((item, idx) => (
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
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-gray-600 text-sm">
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of{" "}
            {data.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <FaChevronLeft size={12} />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <span key={idx} className="px-2 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === page
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceTable;
