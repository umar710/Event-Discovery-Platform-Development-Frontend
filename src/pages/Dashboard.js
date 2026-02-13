import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiCalendar, FiMapPin, FiClock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [registrations, setRegistrations] = useState({
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const { API_URL } = useAuth();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      console.log("🔍 Fetching user registrations...");
      const response = await axios.get(
        `${API_URL}/api/registrations/my-registrations`
      );
      setRegistrations(response.data);
      console.log("✅ Registrations loaded:", response.data);
    } catch (error) {
      console.error("❌ Error fetching registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      console.log("🔄 Cancelling registration:", eventId);
      await axios.delete(`${API_URL}/api/registrations/${eventId}`);
      toast.success("Registration cancelled");
      fetchRegistrations();
    } catch (error) {
      console.error("❌ Cancel error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to cancel registration"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const RegistrationCard = ({ registration, isUpcoming }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-48 h-48 overflow-hidden">
          <img
            src={registration.event.imageUrl}
            alt={registration.event.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {registration.event.name}
              </h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <FiCalendar className="mr-2" />
                  <span>
                    {format(new Date(registration.event.date), "PPP")}
                  </span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="mr-2" />
                  <span>{registration.event.location}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>
                    Registered on{" "}
                    {format(new Date(registration.registeredAt), "PPP")}
                  </span>
                </div>
              </div>
            </div>
            {isUpcoming && (
              <button
                onClick={() => handleCancelRegistration(registration.event._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Upcoming Events
        </h2>
        {registrations.upcoming.length > 0 ? (
          <div className="space-y-4">
            {registrations.upcoming.map((reg) => (
              <RegistrationCard key={reg._id} registration={reg} isUpcoming />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FiCalendar className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No upcoming events
            </h3>
            <p className="text-gray-500 mb-4">
              You haven't registered for any upcoming events yet
            </p>
            <Link
              to="/events"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>

      {registrations.past.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Past Events
          </h2>
          <div className="space-y-4">
            {registrations.past.map((reg) => (
              <RegistrationCard
                key={reg._id}
                registration={reg}
                isUpcoming={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
