import React, { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    location: "",
  });
  const [categories] = useState([
    "Conference",
    "Workshop",
    "Meetup",
    "Concert",
    "Sports",
    "Other",
  ]);

  useEffect(() => {
    fetchEvents();
  }, [filters.search, filters.category, filters.location]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.location) params.append("location", filters.location);

      const apiUrl = `${API_URL}/api/events?${params.toString()}`;
      console.log("🔍 Fetching events from:", apiUrl);

      const response = await axios.get(apiUrl);

      console.log("✅ Events received:", response.data.events?.length || 0);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      console.error("Error details:", error.response?.data || error.message);
      // eslint-disable-next-line no-undef
      toast.error("Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
        <p className="text-gray-600 mt-2">
          Find and register for amazing events near you
        </p>
        <p className="text-sm text-blue-600 mt-1">Connected to: {API_URL}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search events..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiFilter className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No events found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
