import classNames from 'classnames';
import React, { useContext, useEffect, useState, useRef } from 'react';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { Marker } from 'maplibre-gl';
import { useDebounceValue } from 'usehooks-ts';
import { Icon, IconIdentifier, Spinner } from '../components';
import { GlobalContext } from '../contexts';
import {
  FeatureResponse,
  useLocation,
  useSearchLocation,
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
  const url = new URL(window.location.href);

  // State.
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [debouncedSearchQuery, setQuery] = useDebounceValue<string>('', 300);
  const [selectedLocationId, setSelectedLocationId] = useState<string>();

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);

  // APIs.
  const { data: searchedLocations, isLoading: isLoadingLocations } =
    useSearchLocation(debouncedSearchQuery);
  const { data: selectedLocationFeatures } = useLocation(selectedLocationId);

  // useEffects.
  useEffect(() => {
    setSelectedLocationId(url.searchParams.get('location') ?? undefined);
  }, []);

  useEffect(() => {
    if (!selectedLocationFeatures) {
      return;
    }

    setSelectedLocationId(selectedLocationFeatures.features[0].id);

    // Zoom to location.
    if (selectedLocationFeatures.features[0].bbox) {
      map?.fitBounds(selectedLocationFeatures?.features[0].bbox, {
        padding: 50,
      });
    } else {
      map?.jumpTo({
        center: selectedLocationFeatures.features[0].center,
      });
    }

    // Show searched location on map.
    const layerId = map?.createGeoJSONLayer({
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
    if (map) {
      marker.addTo(map);
    }

    return () => {
      marker.remove();
      if (layerId) {
        map?.deleteLayer(layerId);
      }
    };
  }, [selectedLocationFeatures]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handlers.
  const onPlaceSelect = (feature: FeatureResponse) => {
    if (!feature.place_name_en) {
      return;
    }

    // Update search param.
    url.searchParams.set('location', feature.id);
    window.history.pushState(null, '', url.toString());

    setSelectedLocationId(feature.id);
    setIsOpen(false); // Close after selection
  };

  const handleToggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Focus input when opening
      setTimeout(() => {
        const input = document.querySelector(
          'input[type="search"]',
        ) as HTMLInputElement;
        input?.focus();
      }, 100);
    }
  };

  // Get selected location name for button display
  const selectedLocation =
    searchedLocations?.features.find(({ id }) => id === selectedLocationId) ||
    selectedLocationFeatures?.features[0];
  const selectedLocationName =
    selectedLocation?.place_name_en?.split(',')[0] || 'Search';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Search Button */}
      <button
        onClick={handleToggleSearch}
        className={classNames(
          'inline-flex items-center gap-2 rounded-md border border-gray-700/50 bg-gray-900/90 p-1.5 text-sm/6 font-semibold text-gray-50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-800/90 focus:outline-none',
          className,
          {
            '!bg-gray-800/90 ring-2 ring-blue-500/30': isOpen,
          },
        )}
      >
        <Icon identifier={IconIdentifier.Search} className="size-4" />
        <span className="max-w-32 truncate text-sm">
          {selectedLocationName}
        </span>
      </button>

      {/* Search Dropdown */}
      <div
        className={classNames(
          'absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] transition-all duration-200',
          {
            'pointer-events-none scale-95 opacity-0': !isOpen,
            'scale-100 opacity-100': isOpen,
          },
        )}
      >
        <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/90 shadow-xl backdrop-blur-md">
          {/* Header */}
          <div className="border-b border-gray-700/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Icon
                identifier={IconIdentifier.Search}
                className="size-4 text-gray-400"
              />
              <h4 className="text-sm font-medium text-gray-200">
                Search Locations
              </h4>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Find places, cities, and landmarks
            </p>
          </div>

          {/* Search Input */}
          <div className="p-3">
            <Combobox value={selectedLocation} onChange={onPlaceSelect}>
              <div className="relative">
                <div className="flex items-center rounded-lg border border-gray-600/50 bg-gray-700/50 transition-all duration-200 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
                  <Icon
                    identifier={IconIdentifier.Search}
                    className="ml-3 size-4 text-gray-400"
                  />
                  <ComboboxInput
                    type="search"
                    className="w-full border-none bg-transparent py-2.5 pl-2 pr-3 text-sm text-gray-50 outline-none placeholder:text-gray-400"
                    displayValue={(feature?: FeatureResponse) =>
                      feature?.place_name_en ?? ''
                    }
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a location..."
                    autoComplete="off"
                  />
                </div>

                <ComboboxOptions className="mt-2 max-h-64 overflow-auto rounded-lg border border-gray-600/30 bg-gray-700/30">
                  {debouncedSearchQuery === '' ? (
                    <div className="px-4 py-8 text-center">
                      <Icon
                        identifier={IconIdentifier.Search}
                        className="mx-auto mb-2 size-6 text-gray-500"
                      />
                      <p className="text-sm text-gray-400">
                        Start typing to search locations
                      </p>
                    </div>
                  ) : isLoadingLocations ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner className="size-[1.2rem]" />
                      <span className="ml-2 text-sm text-gray-400">
                        Searching...
                      </span>
                    </div>
                  ) : !searchedLocations?.features ||
                    searchedLocations.features.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <Icon
                        identifier={IconIdentifier.Close}
                        className="mx-auto mb-2 size-8 text-gray-500"
                      />
                      <p className="text-sm text-gray-400">
                        No locations found
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Try a different search term
                      </p>
                    </div>
                  ) : (
                    <div className="py-1">
                      {searchedLocations.features.map((feature, index) => (
                        <ComboboxOption key={feature.id} value={feature}>
                          {({ focus }) => (
                            <SearchItem
                              feature={feature}
                              isSelected={feature.id === selectedLocationId}
                              isActive={focus}
                              className={index === 0 ? 'mt-0' : ''}
                            />
                          )}
                        </ComboboxOption>
                      ))}
                    </div>
                  )}
                </ComboboxOptions>
              </div>
            </Combobox>
          </div>
        </div>
      </div>
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
    'relative flex items-center px-3 py-2.5 mx-1 rounded-lg cursor-pointer transition-all duration-200 group',
    className,
    {
      'bg-blue-600/20 border border-blue-500/30': isSelected,
      'hover:bg-gray-600/50': !isSelected && !isActive,
      'bg-gray-600/50': isActive && !isSelected,
    },
  );

  return (
    <div className={customClassNames} {...rest}>
      {/* Location Icon */}
      <div
        className={`mr-3 flex size-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600 ${isSelected ? 'ring-2 ring-blue-400/50' : ''}`}
      >
        <Icon
          identifier={IconIdentifier.PointMarker}
          className="size-4 text-white"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
            {placeName}
          </p>
        </div>
        {placeAddress && (
          <p className="mt-0.5 truncate text-xs text-gray-400 transition-colors group-hover:text-gray-300">
            {placeAddress}
          </p>
        )}
      </div>
    </div>
  );
};
