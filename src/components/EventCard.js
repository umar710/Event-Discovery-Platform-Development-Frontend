import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";

const EventCard = ({ event }) => {
  const availableSeats = event.capacity - (event.registrationsCount || 0);
  const isEventFull = availableSeats <= 0;

  return (
    <Link to={`/event/${event._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
        <div className="h-48 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
              {event.name}
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {event.category}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-gray-600 text-sm">
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <span>{format(new Date(event.date), "PPP")}</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="mr-2" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center">
              <FiUsers className="mr-2" />
              <span className={isEventFull ? "text-red-600 font-semibold" : ""}>
                {availableSeats} / {event.capacity} seats available
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span
              className={`inline-block w-full text-center py-2 rounded-lg font-medium ${
                isEventFull
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEventFull ? "Sold Out" : "View Details"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
