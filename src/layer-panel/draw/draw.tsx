import React, { useContext, useEffect, useState } from 'react';

import { TerraDraw, TerraDrawMapLibreGLAdapter } from 'terra-draw';
import { GlobalContext } from '../../contexts';

import classNames from 'classnames';
import { Button, IconIdentifier } from '../../components';
import { MODES } from './constants';
import { setupModes } from './helpers';
import { toTitleCase } from '../../utils';

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
        <Button
          key={key}
          active={key === selectedMode}
          iconIdentifier={value.iconIdentifier}
          onClick={() => addModeChangeHandler(key)}
          title={toTitleCase(key)}
          className="rounded-none size-[34px]"
        />
      ))}

      <Button
        iconIdentifier={IconIdentifier.Bin}
        onClick={() => draw?.clear()}
        title="Clear"
        className="rounded-none size-[34px]"
      />
    </div>
  );
};
