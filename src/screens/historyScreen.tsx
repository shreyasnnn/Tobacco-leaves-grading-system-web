import React, { useEffect, useState } from "react";
import { apiLeaves, LeaveRecord, HistoryFilters } from "@/services/apiLeaves";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button } from "@/components/button";
import NavBar from "@/components/navBar";

// Custom type for date picker
interface SelectionRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

export const HistoryScreen: React.FC = () => {
  const [data, setData] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [filters, setFilters] = useState<HistoryFilters>({});
  const [dateRange, setDateRange] = useState<SelectionRange>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await apiLeaves(filters);
        if (error) setError(error);
        else setData(data ?? []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // Handle calendar change
  const handleDateChange = (ranges: { selection: SelectionRange }) => {
    const selection = ranges.selection;
    setDateRange(selection);

    const formatDateLocal = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const from = formatDateLocal(selection.startDate);
    const to = formatDateLocal(selection.endDate);

    setFilters({ ...filters, from, to });
  };

  const handleResultChange = (result: string) =>
    setFilters({ ...filters, result });

  // Filter data based on search term
  const filteredData = data.filter(item =>
    item.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-[10%]">
    
      <NavBar />
    <div className="max-w-7xl mx-auto mt-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">History</h1>
        <p className="text-gray-600">Review and manage your previous uploads</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Result Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select</label>
            <select
              value={filters.result || ""}
              onChange={(e) => handleResultChange(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Results</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
            </select>
          </div>

          {/* Date Picker Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <button
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:bg-gray-50"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">
                {filters.from && filters.to 
                  ? `${filters.from} to ${filters.to}` 
                  : 'Select dates'
                }
              </span>
            </button>

            {/* Date Picker Dropdown */}
            {isDatePickerOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg border z-50">
                <DateRange
                  ranges={[dateRange]}
                  onChange={handleDateChange}
                  moveRangeOnFirstSelection={false}
                  editableDateInputs={true}
                />
                <div className="p-3 border-t">
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">
          <p>Error: {error.message || JSON.stringify(error)}</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <p>No data available</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-700">
              <div>Thumbnail</div>
              <div>Grade</div>
              <div>Confidence</div>
              <div>Timestamp</div>
              <div>Actions</div>
              <div></div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {paginatedData.map((leave, index) => (
              <div key={leave.user_id + index} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="grid grid-cols-6 gap-4 items-center">
                  {/* Thumbnail */}
                  <div>
                    <img
                      src={leave.image_url}
                      alt={`${leave.result}`}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>

                  {/* Grade */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      leave.result === 'Grade A' ? 'bg-green-100 text-green-800' :
                      leave.result === 'Grade B' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {leave.result}
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="text-sm text-gray-600">
                    {leave.confidence}%
                  </div>

                  {/* Timestamp */}
                  <div className="text-sm text-gray-600">
                    {formatDate(leave.processed_at)}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Details
                    </button>
                    <span className="text-gray-300">|</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Download
                    </button>
                  </div>

                  <div></div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 border-t flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white border-blue-600' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default HistoryScreen;
