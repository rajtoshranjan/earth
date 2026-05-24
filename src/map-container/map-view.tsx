import classNames from 'classnames';
import React, { HTMLProps, useContext, useEffect, useRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { GlobalContext } from '../contexts';
import { useAuthStore } from '../core/auth';
import { Map } from '../core/maplibre';
import { baseStyleSpec } from './constants';
import { setupMapControls } from './helpers';

export const MapView: React.FC<HTMLProps<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  // Refs.
  const mapContainerRef = useRef(null);

  // Context.
  const { setMap, map, activeBasemap } = useContext(GlobalContext);
  const { values: authRecords } = useAuthStore();
  const authRecordsRef = useRef(authRecords);

  useEffect(() => {
    authRecordsRef.current = authRecords;
  }, [authRecords]);

  // Sync basemap layer visibilities
  useEffect(() => {
    if (!map) return;

    const basemapLayerIds = ['satellite', 'standard', 'light', 'dark'];
    basemapLayerIds.forEach((id) => {
      try {
        if (map.getLayer(id)) {
          map.setLayoutProperty(
            id,
            'visibility',
            activeBasemap === id ? 'visible' : 'none',
          );
        }
      } catch (err) {
        console.warn(`Failed to toggle visibility for layer ${id}:`, err);
      }
    });
  }, [map, activeBasemap]);

  // Constants.
  const customClassNames = classNames(
    'w-full h-screen-container bg-gray-600',
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
      hash: true,
      maxPitch: 180,
      rollEnabled: true,
      maxZoom: 24,
      transformRequest: (url) => {
        const authIdMatch = url.match(/[?&]x-earth-auth-id=([^&]+)/);
        if (authIdMatch) {
          const authId = authIdMatch[1];
          // Clean the URL by removing the query param
          const cleanUrl = url
            .replace(new RegExp(`([?&])x-earth-auth-id=${authId}(&|$)`), '$1')
            .replace(/[?&]$/, '');

          const authRecord = authRecordsRef.current[authId];
          const headers: Record<string, string> = {};
          if (authRecord) {
            authRecord.headers.forEach((h) => {
              if (h.key && h.value) {
                headers[h.key] = h.value;
              }
            });
          }
          return { url: cleanUrl, headers };
        }
        return { url };
      },
    });

    setupMapControls(maplibreMap);

    setMap?.(maplibreMap);
  }, []);

  return <div ref={mapContainerRef} className={customClassNames} {...rest} />;
};
