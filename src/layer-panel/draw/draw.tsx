import React, { useContext, useEffect, useState } from 'react';

import classNames from 'classnames';
import { TerraDraw, TerraDrawMapLibreGLAdapter } from 'terra-draw';

import { GlobalContext } from '../../contexts';

import { Button } from '../../components';
import { toTitleCase } from '../../utils';
import { MODES } from './constants';
import { DrawFeatureModal } from './draw-feature-modal';
import { setupModes } from './helpers';
import { Modes } from './types';

type DrawProps = React.HTMLProps<HTMLDivElement>;

export const Draw: React.FC<DrawProps> = ({ className, ...rest }) => {
  // Context.
  const { map } = useContext(GlobalContext);

  // States.
  const [draw, setDraw] = useState<TerraDraw>();
  const [selectedMode, setSelectedMode] = useState<Modes>();

  // Constants.
  const customClassNames = classNames(
    'inline-flex flex-col gap-0 rounded-lg overflow-hidden',
    className,
  );

  // useEffects.
  useEffect(() => {
    let terraDraw: TerraDraw | undefined;

    const loadTerraDraw = () => {
      terraDraw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({
          map,
        }),
        modes: setupModes(),
      });

      setDraw(terraDraw);
    };

    map?.on('load', loadTerraDraw);

    return () => {
      terraDraw?.stop();

      map?.off('load', loadTerraDraw);
    };
  }, [map]);

  // Handlers.
  const changeMode = (mode: Modes) => {
    if (!draw) {
      return;
    }

    if (!draw.enabled) {
      draw.start();
    }

    draw.setMode(mode);
    setSelectedMode(mode);
  };

  const onModalClose = () => {
    setSelectedMode(undefined);
    draw?.stop();
  };

  return (
    <div className={customClassNames} {...rest}>
      {Object.entries(MODES).map(([key, value]) => (
        <Button
          key={key}
          active={key === selectedMode}
          iconIdentifier={value.iconIdentifier}
          onClick={() => changeMode(key as Modes)}
          title={toTitleCase(key)}
          className="size-[34px] rounded-none"
        />
      ))}

      {/* Feature details modal */}
      {draw && (
        <DrawFeatureModal
          show={!!selectedMode}
          onClose={onModalClose}
          draw={draw}
          changeMode={changeMode}
        />
      )}
    </div>
  );
};
