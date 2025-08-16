import React, { useEffect, useState } from "react";
import { apiLeaves, LeaveRecord, HistoryFilters } from "@/services/apiLeaves";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import NavBar from "@/components/navBar";
import { grades } from "../dataController/index";
import { Button } from "@/components/button";

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

  const handleDateChange = (ranges: { selection: SelectionRange }) => {
    const selection = ranges.selection;
    setDateRange(selection);

    const formatDateLocal = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const from = formatDateLocal(selection.startDate);
    const to = formatDateLocal(selection.endDate);

    setFilters({ ...filters, from, to });
  };

  const handleResultChange = (result: string) =>
    setFilters({ ...filters, result });

  const filteredData = data.filter((item) =>
    item.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Grade A":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Grade B":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Grade C":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Prediction History
          </h1>
          <p className="text-lg text-green-600">
            Review and manage your previous leaf analyses
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by grade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Grade Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Grade
              </label>
              <select
                value={filters.result || ""}
                onChange={(e) => handleResultChange(e.target.value)}
                className="w-full md:w-48 border border-gray-300 px-3 py-2.5 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-all"
              >
                <option value="">All Grades</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <Button
                onClick={() => setIsDatePickerOpen((s) => !s)}
                className="flex items-center gap-2 border border-gray-300 px-3 py-2.5 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-s text-gray-400">
                  {filters.from && filters.to
                    ? `${filters.from} to ${filters.to}`
                    : "Select dates"}
                </span>
              </Button>

              {isDatePickerOpen && (
                <div className="absolute right-0 z-10 mt-1 bg-white shadow-xl rounded-lg border border-gray-200">
                  <DateRange
                    ranges={[dateRange]}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    editableDateInputs={true}
                    className="border-0"
                  />
                  <div className="p-3 border-t flex justify-end">
                    <Button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Error loading data
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {error.message || "Please try again later"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Retry
              </Button>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No results found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="col-span-2 text-sm font-medium text-green-700">
                    Image
                  </div>
                  <div className="col-span-2 text-sm font-medium text-green-700">
                    Grade
                  </div>
                  <div className="col-span-2 text-sm font-medium text-green-700">
                    Confidence
                  </div>
                  <div className="col-span-4 text-sm font-medium text-green-700">
                    Date Analyzed
                  </div>
                  <div className="col-span-2 text-sm font-medium text-green-700">
                    Actions
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {paginatedData.map((leave, index) => (
                    <div
                      key={leave.user_id + index}
                      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Image */}
                      <div className="col-span-2 flex items-center">
                        <img
                          src={leave.image_url}
                          alt={`${leave.result}`}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      </div>

                      {/* Grade - Using the color utility */}
                      <div className="col-span-2 flex items-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${leave.color?.full}`}
                        >
                          {leave.result}
                        </span>
                      </div>

                      {/* Confidence */}
                      <div className="col-span-2 flex items-center">
                        <div className="w-full">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">
                              {leave.confidence}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${leave.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-4 flex items-center text-sm text-gray-700">
                        {formatDate(leave.processed_at)}
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center gap-3">
                        <button className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                          Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3 p-4">
                {paginatedData.map((leave, index) => (
                  <div
                    key={leave.user_id + index}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <img
                        src={leave.image_url}
                        alt={leave.result}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(
                              leave.result
                            )}`}
                          >
                            {leave.result}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(leave.processed_at)}
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">
                              Confidence
                            </span>
                            <span className="font-medium text-emerald-600">
                              {leave.confidence}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${leave.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            Details
                          </button>
                          <button className="flex-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredData.length)}
                </span>{" "}
                of <span className="font-medium">{filteredData.length}</span>{" "}
                results
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-lg ${
                          currentPage === pageNum
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="px-3 py-1 text-sm">...</span>
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryScreen;
