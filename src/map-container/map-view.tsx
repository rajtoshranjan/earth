import classNames from 'classnames';
import React, { HTMLProps, useContext, useEffect, useRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { GlobalContext } from '../contexts';
import { Map } from '../core/maplibre';
import { baseStyleSpec } from './constants';
import { setupMapControls } from './helpers';
import { SpaceBackground } from './space-background/space-background';

export const MapView: React.FC<HTMLProps<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  // Refs.
  const mapContainerRef = useRef(null);

  // Context.
  const { setMap } = useContext(GlobalContext);

  // Constants.
  const customClassNames = classNames(
    'w-full h-screen-container bg-transparent relative',
    className,
  );

  const isMediumDevice = useMediaQuery('(max-width: 768px)');

  // useEffects.
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const maplibreMap = new Map({
      container: mapContainerRef.current,
      style: baseStyleSpec,
      center: [78.8718, 21.7679],
      zoom: isMediumDevice ? 1 : 2,
      attributionControl: false,
    });

    setupMapControls(maplibreMap);

    setMap?.(maplibreMap);
  }, []);

  return (
    <>
      <SpaceBackground />
      <div ref={mapContainerRef} className={customClassNames} {...rest} />
    </>
  );
};
