import React, { useContext } from "react";
import { GlobalContext } from "../context";

export const SideNav = () => {
  // Context.
  const { map } = useContext(GlobalContext);

  // Handlers.
  const onLayerToggle = () => {
    const layerId = "satellite";

    const visibility = map?.getLayoutProperty(layerId, "visibility");

    if (visibility === "visible") {
      map?.setLayoutProperty(layerId, "visibility", "none");
    } else {
      map?.setLayoutProperty(layerId, "visibility", "visible");
    }
  };

  return (
    <div className="flex flex-col bg-gray-900 border-r border-gray-700 w-64 p-4 space-y-4 transition-all duration-300 ease-in-out">
      <div className="flex flex-col space-y-2">
        <div className="inline-flex justify-between">
          <h2 className="text-sm font-medium text-gray-400">Layers</h2>
          <button className="inline-flex items-center whitespace-nowrap text-sm font-sm h-5 p-2 justify-start text-gray-400 hover:text-gray-300">
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
              className="h-4 w-4 mr-2"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            Add Layer
          </button>
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <div className="inline-flex space-between space-x-7  items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 px-4 py-2 justify-start text-gray-50 hover:bg-gray-800">
              <svg
                fill="currentColor"
                viewBox="0 0 122.88 122.88"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
              >
                <g>
                  <path d="M5.49,79.09l37.86,37.86C66.37,99.1,36.69,54.35,5.49,79.09L5.49,79.09z M42.39,62.21l18.29,18.29 c1.18,1.18,3.12,1.18,4.3,0l24.2-24.2c6.21-6.21,6.21-16.38,0-22.59v0c-6.21-6.21-16.38-6.21-22.59,0l-24.2,24.2 C41.2,59.09,41.2,61.02,42.39,62.21L42.39,62.21z M24.5,104.83L20.33,109c-1.48,1.48-3.89,1.48-5.38,0c-1.48-1.49-1.48-3.89,0-5.38 l4.17-4.17l-17-17l0.01-0.01c-0.13-0.13-0.25-0.26-0.36-0.4C0.15,80,0.49,77.01,2.54,75.38c13.15-10.43,26.24-10.1,36.28-4.46 c1.85,1.04,3.59,2.26,5.2,3.64l1.99-1.99l-6.99-6.99c-1.52-1.52-2.28-3.52-2.28-5.51c0-1.99,0.76-3.99,2.28-5.51l5.92-5.92 l-5.11-5.11l-3.76,3.76h0c-1.22,1.22-2.83,1.84-4.44,1.84c-1.59,0-3.19-0.61-4.42-1.84l-0.01-0.01l-0.01,0.01h0L3.53,23.62 c-1.22-1.22-1.84-2.83-1.84-4.44c0-1.59,0.62-3.19,1.85-4.43l-0.01-0.01L16.44,1.84l0,0c0.16-0.16,0.33-0.31,0.51-0.44 C18.09,0.47,19.48,0,20.87,0c1.59,0,3.19,0.61,4.42,1.84l0.01,0.01l0.01-0.01l0,0L48.97,25.5v0c1.22,1.22,1.84,2.83,1.84,4.44 c0,1.6-0.61,3.21-1.84,4.44v0l-3.77,3.77l5.11,5.11l12.91-12.91c4.03-4.03,9.35-6.05,14.66-6.05c5.31,0,10.62,2.02,14.66,6.05v0 c4.03,4.03,6.05,9.35,6.05,14.66c0,5.31-2.02,10.62-6.05,14.66L79.63,72.56l5.11,5.11l3.77-3.76c1.22-1.22,2.83-1.84,4.44-1.84 c1.6,0,3.21,0.61,4.44,1.84l23.66,23.66l0,0c1.22,1.22,1.84,2.83,1.84,4.44c0,1.6-0.61,3.21-1.84,4.44l0,0l-12.91,12.91 c-1.22,1.22-2.83,1.84-4.44,1.84c-1.6,0-3.21-0.61-4.44-1.84L75.6,95.69c-1.22-1.22-1.84-2.83-1.84-4.44 c0-1.59,0.61-3.19,1.84-4.42l0.01-0.01l-0.01-0.01l3.76-3.77l-5.11-5.11l-5.92,5.92c-1.52,1.52-3.52,2.28-5.51,2.28 c-1.99,0-3.99-0.76-5.51-2.28l-5.92-5.92l-2.15,2.15c2.47,3.26,4.37,6.93,5.57,10.75c3.27,10.41,1.4,21.91-8.23,29.61 c-1.86,1.73-4.78,1.68-6.59-0.13L24.5,104.83L24.5,104.83z M0.13,106.96c-0.53-1.89,0.57-3.86,2.47-4.39 c1.89-0.53,3.86,0.57,4.39,2.47c1,3.53,2.38,6.2,4.16,7.99c1.6,1.61,3.6,2.53,6.03,2.73c1.96,0.16,3.42,1.88,3.26,3.85 c-0.16,1.96-1.88,3.42-3.85,3.26c-4.17-0.36-7.65-1.98-10.48-4.83C3.45,115.38,1.47,111.67,0.13,106.96L0.13,106.96z" />
                </g>
              </svg>
              Google Satellite
              <div className="flex items-center gap-2 ">
                <button
                  className="text-sm font-medium text-gray-50 hover:text-gray-300"
                  onClick={onLayerToggle}
                >
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
                    className="h-4 w-4"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span className="sr-only">Toggle layer visibility</span>
                </button>
                <button className="text-sm font-medium text-gray-50 hover:text-gray-300">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z"
                      fill="#fff"
                    />
                  </svg>
                  <span className="sr-only">Layer options</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
