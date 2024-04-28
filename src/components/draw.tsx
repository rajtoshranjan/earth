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
import { GlobalContext } from "../contexts";
import { ReactSVG } from "react-svg";
import { Icon } from "../assets/icons";
import classNames from "classnames";

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

type DrawProps = React.HTMLProps<HTMLDivElement>;

export const Draw: React.FC<DrawProps> = ({ className, ...rest }) => {
  // Context.
  const { map } = useContext(GlobalContext);

  // States.
  const [draw, setDraw] = useState<TerraDraw>();
  const [selectedMode, setSelectedMode] = useState<HTMLButtonElement>();

  // Constants.
  const customClassNames = classNames("inline-flex flex-col gap-2", className);

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
    <div className={customClassNames} {...rest}>
      <button
        id="select"
        onClick={() => addModeChangeHandler("select")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.Select} className="h-4 w-4" />
        <span className="sr-only">Select</span>
      </button>
      <button
        id="point"
        onClick={() => addModeChangeHandler("point")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.PointMarker} className="h-4 w-4" />
        <span className="sr-only">Draw Point</span>
      </button>

      <button
        id="linestring"
        onClick={() => addModeChangeHandler("linestring")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.Line} className="h-4 w-4" />
        <span className="sr-only">Draw Line</span>
      </button>
      <button
        id="polygon"
        onClick={() => addModeChangeHandler("polygon")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.Polygon} className="h-4 w-4" />
        <span className="sr-only">Draw Polygon</span>
      </button>
      <button
        id="freehand"
        onClick={() => addModeChangeHandler("freehand")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.Freehand} className="h-4 w-4" />
        <span className="sr-only">Freehand Drawing</span>
      </button>
      <button
        id="circle"
        onClick={() => addModeChangeHandler("circle")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.Circle} className="h-4 w-4" />
        <span className="sr-only">Draw Circle</span>
      </button>
      <button
        id="rectangle"
        onClick={() => addModeChangeHandler("rectangle")}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.Rectangle} className="h-4 w-4" />
        <span className="sr-only">Draw Rectangle</span>
      </button>

      <button
        onClick={() => draw?.clear()}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input h-8 w-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded-full"
      >
        <ReactSVG src={Icon.Bin} className="h-4 w-4" />
        <span className="sr-only">Clear</span>
      </button>
      <div id="keybind"></div>
    </div>
  );
};
