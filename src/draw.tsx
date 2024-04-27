import React, { useContext, useEffect, useState } from "react";

import {
  TerraDraw,
  TerraDrawPointMode,
  TerraDrawCircleMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  TerraDrawFreehandMode,
  TerraDrawRectangleMode,
  TerraDrawMapLibreGLAdapter,
  TerraDrawRenderMode,
} from "terra-draw";
import { GlobalContext } from "./context";

const getModes = () => {
  return [
    new TerraDrawSelectMode({
      flags: {
        arbitary: {
          feature: {},
        },
        polygon: {
          feature: {
            draggable: true,
            rotateable: true,
            scaleable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },
        freehand: {
          feature: { draggable: true, coordinates: {} },
        },
        linestring: {
          feature: {
            draggable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },
        circle: {
          feature: {
            draggable: true,
          },
        },
        point: {
          feature: {
            draggable: true,
          },
        },
      },
    }),
    new TerraDrawPointMode(),
    new TerraDrawLineStringMode({
      snapping: true,
      allowSelfIntersections: false,
    }),
    new TerraDrawPolygonMode({
      snapping: true,
      allowSelfIntersections: false,
    }),
    new TerraDrawRectangleMode(),
    new TerraDrawCircleMode(),
    new TerraDrawFreehandMode(),
    new TerraDrawRenderMode({
      modeName: "arbitary",
      styles: {
        polygonFillColor: "#4357AD",
        polygonOutlineColor: "#48A9A6",
        polygonOutlineWidth: 2,
      },
    }),
  ];
};

export const Draw = () => {
  // Context.
  const { map } = useContext(GlobalContext);

  // States.
  const [draw, setDraw] = useState<TerraDraw>();
  const [selectedMode, setSelectedMode] = useState<HTMLButtonElement>();

  // useEffects.
  useEffect(() => {
    if (!map) {
      return;
    }

    map.on("load", () => {
      const terraDraw = new TerraDraw({
        // @ts-ignore
        adapter: new TerraDrawMapLibreGLAdapter({
          map,
        }),
        modes: getModes(),
      });

      terraDraw.start();

      setDraw(terraDraw);
    });
  }, [map]);

  // Handlers.
  const addModeChangeHandler = (mode: string) => {
    if (selectedMode) {
      selectedMode.style.color = "white";
    }

    if (!draw) {
      return;
    }

    draw.setMode(mode);

    const currentSelected = document.getElementById(mode) as HTMLButtonElement;
    currentSelected.style.color = "#80669d";
    setSelectedMode(currentSelected);
  };

  return (
    <div className="absolute top-14 mx-2 mt-2 inline-flex flex-col gap-2">
      <button
        id="select"
        onClick={() => addModeChangeHandler("select")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
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
          <path d="M5 3a2 2 0 0 0-2 2"></path>
          <path d="M19 3a2 2 0 0 1 2 2"></path>
          <path d="M21 19a2 2 0 0 1-2 2"></path>
          <path d="M5 21a2 2 0 0 1-2-2"></path>
          <path d="M9 3h1"></path>
          <path d="M9 21h1"></path>
          <path d="M14 3h1"></path>
          <path d="M14 21h1"></path>
          <path d="M3 9v1"></path>
          <path d="M21 9v1"></path>
          <path d="M3 14v1"></path>
          <path d="M21 14v1"></path>
        </svg>
        <span className="sr-only">Select</span>
      </button>
      <button
        id="point"
        onClick={() => addModeChangeHandler("point")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          fill="currentColor"
          // stroke="currentColor"
          className="h-10 w-10"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M50 37.45c-6.89 0-12.55 5.66-12.55 12.549c0 6.89 5.66 12.55 12.55 12.55c6.655 0 12.112-5.294 12.48-11.862a3.5 3.5 0 0 0 .07-.688a3.5 3.5 0 0 0-.07-.691C62.11 42.74 56.653 37.45 50 37.45zm0 7c3.107 0 5.55 2.442 5.55 5.549s-2.443 5.55-5.55 5.55c-3.107 0-5.55-2.443-5.55-5.55c0-3.107 2.443-5.549 5.55-5.549z"
            //   fill="#000000"
          ></path>
        </svg>
        <span className="sr-only">Draw Point</span>
      </button>

      <button
        id="linestring"
        onClick={() => addModeChangeHandler("linestring")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M21 6h.046l-5.25 9h-.944L10 9.455V7H7v2.926L1.862 18H0v3h3v-2.926L8.138 10h1.01L14 15.545V18h3v-3h-.046l5.25-9H24V3h-3zM8 8h1v1H8zM2 20H1v-1h1zm14-3h-1v-1h1zm7-13v1h-1V4z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>
        <span className="sr-only">Draw Line</span>
      </button>
      <button
        id="polygon"
        onClick={() => addModeChangeHandler("polygon")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <svg
          viewBox="0 0 256 256"
          id="Flat"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M230.63,49.37a32.05,32.05,0,0,0-45.26,0h0a31.85,31.85,0,0,0-5.15,6.76L152,48.43a32,32,0,0,0-54.6-23.06h0a32.05,32.05,0,0,0-5.75,37.41L57.68,93.33a32.06,32.06,0,0,0-40.31,4h0a32,32,0,0,0,42.88,47.4l70,51.36a32,32,0,1,0,52.34-10.76,31.51,31.51,0,0,0-4.78-3.92l27.39-77.59q1.38.12,2.76.12a32,32,0,0,0,22.63-54.61ZM162.76,176.14a31.93,31.93,0,0,0-23,7.09l-70-51.36a32.13,32.13,0,0,0-1.33-26.65l33.94-30.55a32,32,0,0,0,45.46-10.8L176,71.57a31.87,31.87,0,0,0,14.11,27Z" />
        </svg>
        <span className="sr-only">Draw Polygon</span>
      </button>
      <button
        id="freehand"
        onClick={() => addModeChangeHandler("freehand")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <svg
          fill="currentColor"
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 298.129 298.129"
        >
          <g>
            <path
              d="M296.609,231.556l-13.598-20.752c-2.809-4.288-8.563-5.486-12.851-2.677l-75.814,49.676
		c-4.288,2.81-5.486,8.563-2.677,12.851l13.598,20.752c2.81,4.288,8.563,5.486,12.851,2.677l75.814-49.676
		C298.221,241.597,299.419,235.844,296.609,231.556z"
            />
            <path
              d="M207.228,231.115l24.822-16.265c10.019-6.564,16.882-16.638,19.324-28.364c2.31-11.092,0.511-23.079-6.393-33.722
		c-3.546-5.412-33.156-50.602-36.636-55.912c-4.589-7.004-13.987-8.961-20.991-4.372c-4.559,2.987-6.963,8.012-6.831,13.088
		l-2.702-4.123c-4.589-7.003-13.989-8.961-20.991-4.372c-4.559,2.987-6.962,8.012-6.831,13.087l-1.87-2.854
		c-4.59-7.004-13.987-8.961-20.991-4.372c-4.559,2.987-6.963,8.013-6.831,13.089L95.17,77.659
		c-4.589-7.004-13.986-8.96-20.991-4.372c-7.004,4.589-8.961,13.987-4.372,20.991l62.509,95.399l-26.165-8.915
		c-7.934-2.701-16.541,1.536-19.241,9.462c-2.7,7.926,1.536,16.541,9.462,19.241l73.57,25.066c4.893,2.036,10.15,3.106,15.454,3.106
		C192.903,237.637,200.493,235.528,207.228,231.115z"
            />
            <path
              d="M102.915,68.63c3.026,4.619,9.226,5.913,13.845,2.884c4.62-3.026,5.911-9.226,2.884-13.845
		C105.564,36.181,76.63,30.153,55.143,44.233c-21.487,14.079-27.514,43.015-13.436,64.502c1.919,2.93,5.114,4.521,8.374,4.521
		c1.879,0,3.781-0.529,5.471-1.637c4.619-3.026,5.911-9.225,2.884-13.845c-8.034-12.264-4.595-28.777,7.668-36.813
		C78.366,52.928,94.88,56.367,102.915,68.63z"
            />
            <path
              d="M21.301,70.835c3.303-15.859,12.585-29.483,26.135-38.362c13.55-8.879,29.746-11.949,45.607-8.646
		c15.859,3.303,29.483,12.585,38.362,26.135c3.027,4.619,9.225,5.913,13.845,2.884c4.62-3.026,5.911-9.226,2.884-13.845
		C136.327,20.982,118.211,8.639,97.121,4.247c-21.088-4.393-42.627-0.31-60.646,11.497C18.456,27.551,6.113,45.667,1.721,66.757
		c-4.392,21.09-0.309,42.628,11.497,60.646c1.92,2.93,5.114,4.521,8.374,4.521c1.879,0,3.781-0.529,5.471-1.637
		c4.62-3.027,5.911-9.226,2.884-13.845C21.067,102.891,17.997,86.694,21.301,70.835z"
            />
          </g>
        </svg>

        <span className="sr-only">Freehand Drawing</span>
      </button>
      <button
        id="circle"
        onClick={() => addModeChangeHandler("circle")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
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
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
        <span className="sr-only">Draw Circle</span>
      </button>
      <button
        id="rectangle"
        onClick={() => addModeChangeHandler("rectangle")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
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
          <rect width="12" height="20" x="6" y="2" rx="2"></rect>
        </svg>
        <span className="sr-only">Draw Rectangle</span>
      </button>

      <button
        onClick={() => draw?.clear()}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-10 w-10 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
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
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
        <span className="sr-only">Clear</span>
      </button>
      <div id="keybind"></div>
    </div>
  );
};
