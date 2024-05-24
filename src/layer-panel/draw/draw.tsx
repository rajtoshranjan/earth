import React, { useContext, useEffect, useState } from 'react';

import { TerraDraw, TerraDrawMapLibreGLAdapter } from 'terra-draw';
import classNames from 'classnames';
import { GlobalContext } from '../../contexts';

import { Button, IconIdentifier } from '../../components';
import { toTitleCase } from '../../utils';
import { MODES } from './constants';
import { setupModes } from './helpers';

type DrawProps = React.HTMLProps<HTMLDivElement>;

export const Draw: React.FC<DrawProps> = ({ className, ...rest }) => {
  // Context.
  const { map } = useContext(GlobalContext);

  // States.
  const [draw, setDraw] = useState<TerraDraw>();
  const [selectedMode, setSelectedMode] = useState<string>();

  // Constants.
  const customClassNames = classNames(
    'inline-flex flex-col gap-0 rounded-lg overflow-hidden',
    className,
  );

  // useEffects.
  useEffect(() => {
    if (!map) {
      return;
    }

    map.on('load', () => {
      const terraDraw = new TerraDraw({
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
  const modeChangeHandler = (mode: string) => {
    if (!draw) {
      return;
    }

    draw.setMode(mode);
    setSelectedMode(mode);
  };

  return (
    <div className={customClassNames} {...rest}>
      {Object.entries(MODES).map(([key, value]) => (
        <Button
          key={key}
          active={key === selectedMode}
          iconIdentifier={value.iconIdentifier}
          onClick={() => modeChangeHandler(key)}
          title={toTitleCase(key)}
          className="size-[34px] rounded-none"
        />
      ))}

      <Button
        iconIdentifier={IconIdentifier.Bin}
        onClick={() => draw?.clear()}
        title="Clear"
        className="size-[34px] rounded-none"
      />
    </div>
  );
};
