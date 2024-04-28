import React, { useContext, useEffect, useState } from "react";

import { TerraDraw, TerraDrawMapLibreGLAdapter } from "terra-draw";
import { GlobalContext } from "../../contexts";
import { ReactSVG } from "react-svg";
import { Icon } from "../../assets/icons";
import classNames from "classnames";
import { setupModes } from "./helpers";
import { MODES } from "./constants";

type DrawProps = React.HTMLProps<HTMLDivElement>;

export const Draw: React.FC<DrawProps> = ({ className, ...rest }) => {
  // Context.
  const { map } = useContext(GlobalContext);

  // States.
  const [draw, setDraw] = useState<TerraDraw>();
  const [selectedMode, setSelectedMode] = useState<string>();

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
        modes: setupModes(),
      });

      terraDraw.start();

      setDraw(terraDraw);
    });
  }, [map]);

  // Handlers.
  const addModeChangeHandler = (mode: string) => {
    if (!draw) {
      return;
    }

    draw.setMode(mode);
    setSelectedMode(mode);
  };

  return (
    <div className={customClassNames} {...rest}>
      {Object.entries(MODES).map(([key, value]) => (
        <button
          key={key}
          onClick={() => addModeChangeHandler(key)}
          className={classNames(
            "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium size-8 bg-gray-900  hover:bg-gray-800 rounded",
            {
              "text-blue-400": key === selectedMode,
              "text-gray-50": key !== selectedMode,
            }
          )}
        >
          <ReactSVG src={value.icon} className="size-4" />
        </button>
      ))}

      <button
        onClick={() => draw?.clear()}
        className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium size-8 bg-gray-900 text-gray-50 hover:bg-gray-800 rounded"
      >
        <ReactSVG src={Icon.Bin} className="size-4" />
        <span className="sr-only">Clear</span>
      </button>
    </div>
  );
};
