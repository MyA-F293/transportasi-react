import React from "react";

const Navbar = ({ onSelectMethod }) => {
  return (
    <nav className="bg-blue-800 text-sm text-white p-2 md:p-4 mb-3 font-sans" style={{ fontFamily: "'Century Gothic', sans-serif" }}>
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-4">
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
          onClick={() => onSelectMethod("northwest")}
        >
          Metode North-West Corner
        </button>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
          onClick={() => onSelectMethod("vogel")}
        >
          Metode Vogel
        </button>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-red-700 transition-colors"
          onClick={() => onSelectMethod("leastCost")}
        >
          Metode Minimum Cost
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-wrap gap-2">
        <button
          className="bg-blue-600 px-2 py-2 rounded hover:bg-red-700 transition-colors text-xs flex-1 min-w-0"
          onClick={() => onSelectMethod("northwest")}
        >
          North-West Corner
        </button>
        <button
          className="bg-blue-600 px-2 py-2 rounded hover:bg-red-700 transition-colors text-xs flex-1 min-w-0"
          onClick={() => onSelectMethod("vogel")}
        >
          Vogel
        </button>
        <button
          className="bg-blue-600 px-2 py-2 rounded hover:bg-red-700 transition-colors text-xs flex-1 min-w-0"
          onClick={() => onSelectMethod("leastCost")}
        >
          Minimum Cost
        </button>
      </div>
    </nav>
  );
};

export default Navbar;