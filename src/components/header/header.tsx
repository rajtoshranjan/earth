import React from "react";
import { Search } from "./search";

export const Header = () => {
  return (
    <header className="sticky z-10 top-0 w-full bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex space-x-4">
        <a className="flex items-center space-x-2" href="#">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-blue-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" x2="22" y1="12" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span className="text-lg font-bold text-gray-50">Earth</span>
        </a>
      </div>

      {/* Right Side */}
      <div className="flex w-3/12 items-center space-x-4">
        {/* Search */}
        <Search />

        <button className="w-8 h-8 border flex shrink-0 overflow-hidden rounded-full ">
          <img
            className="aspect-square h-full w-full"
            src="https://source.unsplash.com/random/200x200?sig=1"
          />
        </button>
      </div>
    </header>
  );
};
