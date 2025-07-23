import React from "react";

const Navbar = ({ onSelectMethod }) => {
  return (
    <nav className="bg-blue-800 text-sm text-white p-4 flex gap-4 mb-3  font-sans" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
      <button
        className="bg-blue-600 px-4 py-2 rounded hover:bg-red-700"
        onClick={() => onSelectMethod("northwest")}
      >
        Metode North-West Corner
      </button>
      <button
        className="bg-blue-600 px-4 py-2 rounded hover:bg-red-700"
        onClick={() => onSelectMethod("vogel")}
      >
        Metode Vogel
      </button>
      <button
        className="bg-blue-600 px-4 py-2 rounded hover:bg-red-700"
        onClick={() => onSelectMethod("leastCost")}
      >
        Metode Minimum Cost
      </button>
    </nav>
  );
};

export default Navbar;
