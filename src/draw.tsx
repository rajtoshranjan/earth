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
  TerraDrawGreatCircleMode,
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
    new TerraDrawGreatCircleMode({ snapping: true }),
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

  // useEffects.
  useEffect(() => {
    if (!map) {
      return;
    }

    map.on("load", () => {
      const terraDraw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({
          map,
          coordinatePrecision: 9,
        }),
        modes: getModes(),
      });

      terraDraw.start();

      setDraw(terraDraw);
    });
  }, [map]);

  // Handlers.
  const addModeChangeHandler = (mode: string) => {
    [
      "select",
      "point",
      "linestring",
      "greatcircle",
      "polygon",
      "freehand",
      "circle",
      "rectangle",
    ].forEach((btnId) => {
      const btn = document.getElementById(btnId) as HTMLButtonElement;
      btn.style.color = "black";
    });

    if (!draw) {
      return;
    }

    draw.setMode(mode);

    const currentSelected = document.getElementById(mode) as HTMLButtonElement;
    currentSelected.style.color = "#80669d";
  };

  return (
    <div style={{ width: "100%", height: "100%", margin: 0 }}>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          zIndex: "1000",
          width: "100%",
          margin: "auto 0",
          display: "flex",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        <button id="select" onClick={() => addModeChangeHandler("select")}>
          Select
        </button>
        <button id="point" onClick={() => addModeChangeHandler("point")}>
          Point
        </button>
        <button
          id="greatcircle"
          onClick={() => addModeChangeHandler("greatcircle")}
        >
          Great Circle
        </button>
        <button
          id="linestring"
          onClick={() => addModeChangeHandler("linestring")}
        >
          LineString
        </button>
        <button id="polygon" onClick={() => addModeChangeHandler("polygon")}>
          Polygon
        </button>
        <button id="freehand" onClick={() => addModeChangeHandler("freehand")}>
          Freehand
        </button>
        <button id="circle" onClick={() => addModeChangeHandler("circle")}>
          Circle
        </button>
        <button
          id="rectangle"
          onClick={() => addModeChangeHandler("rectangle")}
        >
          Rectangle
        </button>

        <button onClick={() => draw?.clear()}>Clear</button>
        <div id="keybind"></div>
      </div>
    </div>
  );
};
