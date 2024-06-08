import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useDebounceValue } from 'usehooks-ts';
import { Marker } from 'maplibre-gl';
import { GlobalContext } from '../contexts';
import { Icon, IconIdentifier } from '../components';
import {
  useSearchLocation,
  FeatureResponse,
  useLocation,
} from '../services/apis';

type SearchProps = React.HTMLProps<HTMLDivElement>;

type SearchItemProps = React.HTMLProps<HTMLDivElement> & {
  feature: FeatureResponse;
  isSelected: boolean;
  isActive: boolean;
};

export const Search: React.FC<SearchProps> = ({ className }) => {
  // Context.
  const { map } = useContext(GlobalContext);

  // Constants.
  const customClassNames = classNames(['relative', 'w-full', className]);
  const url = new URL(window.location.href);

  // State.
  const [debouncedSearchQuery, setQuery] = useDebounceValue<string>('', 300);

  const [selectedLocationId, setSelectedLocationId] = useState<string>();

  // APIs.
  const { data: searchedLocations } = useSearchLocation(debouncedSearchQuery);
  const { data: selectedLocationFeatures } = useLocation(selectedLocationId);

  // useEffects.
  useEffect(() => {
    setSelectedLocationId(url.searchParams.get('location') ?? undefined);
  }, []);

  useEffect(() => {
    if (!selectedLocationFeatures) {
      return;
    }

    // Zoom to location.
    if (selectedLocationFeatures.features[0].bbox) {
      map?.fitBounds(selectedLocationFeatures?.features[0].bbox);
    } else {
      map?.jumpTo({
        center: selectedLocationFeatures.features[0].center,
      });
    }

    // Show searched location on map.
    const layerId = map?.createGeoJSONLayer({
      type: 'geojson',
      // @ts-ignore
      data: selectedLocationFeatures,
      styles: {
        polygonOutlineColor: '#dc2626',
        polygonOutlineWidth: 3,
      },
    });

    // Add Marker in center.
    const marker = new Marker({
      color: '#dc2626',
      anchor: 'center',
      scale: 0.9,
    });
    marker.setLngLat(selectedLocationFeatures.features[0].center);
    map && marker.addTo(map);

    return () => {
      marker.remove();
      if (layerId) {
        map?.deleteLayer(layerId);
      }
    };
  }, [selectedLocationFeatures]);

  // Handlers.
  const onPlaceSelect = (feature: FeatureResponse) => {
    if (!feature.place_name_en) {
      return;
    }

    // Update search param.
    url.searchParams.set('location', feature.id);
    window.history.pushState(null, '', url.toString());

    setSelectedLocationId(feature.id);
  };

  return (
    <div className={customClassNames}>
      <Combobox
        value={searchedLocations?.features.find(
          ({ id }) => id === selectedLocationId,
        )}
        onChange={onPlaceSelect}
      >
        <div className="flex items-center overflow-hidden rounded-lg bg-gray-700">
          <Icon
            identifier={IconIdentifier.Search}
            className="ml-3 size-5 text-gray-400"
          />
          <ComboboxInput
            type="search"
            className="w-full border-none bg-gray-700 py-2 pl-2 pr-3 text-sm leading-5 text-gray-50 outline-none"
            displayValue={(feature?: FeatureResponse) =>
              feature?.place_name_en ?? ''
            }
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search locations"
            autoComplete="off"
          />
        </div>

        <ComboboxOptions className="absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg focus:outline-none">
          {searchedLocations?.features.length === 0 &&
          debouncedSearchQuery !== '' ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-50">
              Nothing found.
            </div>
          ) : (
            searchedLocations?.features.map((feature) => (
              <ComboboxOption key={feature.id} value={feature}>
                {({ selected }) => (
                  <SearchItem
                    feature={feature}
                    isSelected={feature.id === selectedLocationId}
                    isActive={selected}
                  />
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

const SearchItem: React.FC<SearchItemProps> = ({
  feature,
  isSelected,
  isActive,
  className,
  ...rest
}) => {
  // Constants.
  const place = feature.place_name_en?.split(',').map((part) => part.trim());

  const placeName = place && place[0];
  const placeAddress = place?.slice(1).join(', ');

  const customClassNames = classNames(
    'flex items-center px-4 py-2 text-gray-200 hover:text-white select-none',
    className,
    {
      'font-medium': isSelected,
      'font-normal': !isSelected,
      'bg-gray-700': isActive,
    },
  );

  return (
    <div className={customClassNames} {...rest}>
      <div className="w-full">
        <p>{placeName}</p>
        <p className="block truncate text-sm text-gray-400">{placeAddress}</p>
      </div>
      {isSelected && (
        <Icon
          identifier={IconIdentifier.Tick}
          className="ml-auto mr-1 size-4 text-teal-600"
          title="selected"
        />
      )}
    </div>
  );
};
