import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FiCalendar, FiMapPin, FiUsers, FiUser } from "react-icons/fi";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, API_URL } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchEvent();
    if (isAuthenticated) {
      checkRegistration();
    }
  }, [id, isAuthenticated]);

  const fetchEvent = async () => {
    try {
      console.log("🔍 Fetching event:", id);
      const response = await axios.get(`${API_URL}/api/events/${id}`);
      setEvent(response.data);
      console.log("✅ Event loaded:", response.data.name);
    } catch (error) {
      console.error("❌ Error fetching event:", error);
      toast.error("Event not found");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/registrations/my-registrations`
      );
      const registered = response.data.upcoming.some(
        (reg) => reg.event._id === id
      );
      setIsRegistered(registered);
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setRegistering(true);
    try {
      console.log("🔄 Registering for event:", id);
      const response = await axios.post(`${API_URL}/api/registrations`, {
        eventId: id,
      });
      console.log("✅ Registration successful:", response.data);
      toast.success("Successfully registered for event!");
      setIsRegistered(true);
      fetchEvent();
    } catch (error) {
      console.error(
        "❌ Registration error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      console.log("🔄 Cancelling registration for event:", id);
      await axios.delete(`${API_URL}/api/registrations/${id}`);
      toast.success("Registration cancelled");
      setIsRegistered(false);
      fetchEvent();
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

  if (!event) return null;

  const availableSeats = event.capacity - (event.registrationsCount || 0);
  const isEventFull = availableSeats <= 0;
  const isPastEvent = new Date(event.date) < new Date();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-96 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.name}
              </h1>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {event.category}
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                {availableSeats} / {event.capacity}
              </p>
              <p className="text-sm text-gray-600">seats available</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-3 text-xl" />
                <span>{format(new Date(event.date), "PPPP")}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiMapPin className="mr-3 text-xl" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUser className="mr-3 text-xl" />
                <span>Organized by {event.organizer}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {!isPastEvent && (
            <div className="border-t pt-8">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  {isRegistered ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-green-600 font-semibold">
                        ✓ You are registered for this event
                      </span>
                      <button
                        onClick={handleCancelRegistration}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                      >
                        Cancel Registration
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={isEventFull || registering}
                      className={`px-8 py-3 rounded-lg font-semibold transition duration-200 ${
                        isEventFull
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {registering
                        ? "Registering..."
                        : isEventFull
                        ? "Event Full"
                        : "Register Now"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Please login to register for this event
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Login to Register
                  </button>
                </div>
              )}
            </div>
          )}

          {isPastEvent && (
            <div className="border-t pt-8 text-center">
              <p className="text-gray-500">This event has already passed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
