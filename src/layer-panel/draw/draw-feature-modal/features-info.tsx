import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import * as turf from '@turf/turf';
import React from 'react';
import { GeoJSONStoreFeatures } from 'terra-draw';
import { useMediaQuery } from 'usehooks-ts';
import { Icon, IconIdentifier } from '../../../components';
import { MeasurementNode, Units } from './measurement-node';

type FeaturesInfoProps = {
  features: Record<string, GeoJSONStoreFeatures>;
  activeFeature?: GeoJSONStoreFeatures;
};

export const FeaturesInfo: React.FC<FeaturesInfoProps> = ({
  features,
  activeFeature,
}) => {
  // Constants.
  const isMediumDevice = useMediaQuery('(max-width: 768px)');

  const featuresCount = Object.values(features).reduce(
    (previousValue, currentValue) => {
      switch (currentValue.geometry.type) {
        case 'Point':
          return {
            ...previousValue,
            points: previousValue.points + 1,
          };
        case 'LineString':
          return {
            ...previousValue,
            linestrings: previousValue.linestrings + 1,
          };
        case 'Polygon':
          return {
            ...previousValue,
            polygons: previousValue.polygons + 1,
          };
        default:
          return previousValue;
      }
    },
    {
      points: 0,
      linestrings: 0,
      polygons: 0,
    },
  );

  return (
    <>
      <h5 className="m-0 p-0 font-medium text-gray-500">
        Feature Counts (
        {featuresCount.points +
          featuresCount.linestrings +
          featuresCount.polygons}
        )
      </h5>
      <div className="mt-2 grid grid-flow-col grid-cols-3 justify-between gap-2">
        <div className="rounded-md border border-gray-600 bg-gray-700 text-gray-300">
          <p className="flex w-full items-center justify-center gap-1 border-b border-gray-600 py-1 text-sm font-bold tracking-wide">
            <Icon identifier={IconIdentifier.PointMarker} /> Points
          </p>

          <p className="py-1 text-center text-xl font-bold">
            {featuresCount.points}
          </p>
        </div>

        <div className="rounded-md border border-gray-600 bg-gray-700 text-gray-300">
          <p className="flex w-full items-center justify-center gap-1 border-b border-gray-600 py-1 text-sm font-bold tracking-wide">
            <Icon identifier={IconIdentifier.Line} /> Lines
          </p>

          <p className="py-1 text-center text-xl font-bold">
            {featuresCount.linestrings}
          </p>
        </div>

        <div className="rounded-md border border-gray-600 bg-gray-700 text-gray-300">
          <p className="flex w-full items-center justify-center gap-1 border-b border-gray-600 py-1 text-sm font-bold tracking-wide">
            <Icon identifier={IconIdentifier.Polygon} /> Polygon
          </p>

          <p className="py-1 text-center text-xl font-bold">
            {featuresCount.polygons}
          </p>
        </div>
      </div>

      <Disclosure defaultOpen={!isMediumDevice}>
        <DisclosureButton
          as="div"
          className="group mt-5 flex items-center justify-between font-medium text-gray-500"
        >
          <span>Selected Feature Info</span>
          <Icon
            identifier={IconIdentifier.Down}
            className="size-3 group-data-[open]:rotate-180"
          />
        </DisclosureButton>
        <DisclosurePanel>
          {!activeFeature && (
            <p className="text-sm text-gray-600">
              Draw or select a feature to view its info
            </p>
          )}

          {activeFeature?.geometry.type === 'Point' && (
            <>
              <MeasurementNode
                title="Longitude"
                value={activeFeature.geometry.coordinates[0]}
                unit={Units.Degree}
              />
              <MeasurementNode
                title="Latitude"
                value={activeFeature.geometry.coordinates[1]}
                unit={Units.Degree}
              />
            </>
          )}

          {['Polygon', 'LineString'].includes(
            activeFeature?.geometry.type ?? '',
          ) && (
            <MeasurementNode
              title={
                activeFeature?.geometry.type === 'LineString'
                  ? 'Length'
                  : 'Perimeter'
              }
              value={
                activeFeature
                  ? turf
                      .length(activeFeature, {
                        units: 'kilometers',
                      })
                      .toFixed(2)
                  : 'Draw or Select a feature'
              }
              unit={Units.Kilometer}
            />
          )}

          {activeFeature?.geometry.type === 'Polygon' && (
            <MeasurementNode
              title="Area"
              value={(turf.area(activeFeature) / 1000).toFixed(2)}
              unit={Units.Meter}
            />
          )}
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};
