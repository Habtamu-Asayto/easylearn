import React from "react";
import { Twitter, Linkedin, Mail } from "react-feather";

function Instructor({ instructor }) {
  return (
    <div className="max-w-sm bg-white rounded border border-gray-200 transition-shadow duration-300">
      {/* Profile Picture */}
      <div className="relative w-full h-48">
        <img
          src={instructor.profilePicture || "/default-avatar.png"}
          alt={instructor.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">{instructor.name}</h2>
        <p className="text-sm text-gray-500 mb-3">
          {instructor.title || "Instructor"}
        </p>
        <p className="text-gray-700 text-sm">{instructor.bio}</p>

        {/* Social Links */}
        <div className="flex space-x-4 mt-4">
          {instructor.twitter && (
            <a
              href={instructor.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600 transition"
            >
              <Twitter size={20} />
            </a>
          )}
          {instructor.linkedin && (
            <a
              href={instructor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 transition"
            >
              <Linkedin size={20} />
            </a>
          )}
          {instructor.email && (
            <a
              href={`mailto:${instructor.email}`}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              <Mail size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Instructor;
