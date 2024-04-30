import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts";
import { FeatureCollectionResponse, FeatureResponse } from "./types";

import { Combobox } from "@headlessui/react";
import { useDebounce } from "@uidotdev/usehooks";
import { Icon, IconIdentifier } from "../components";
import { EnvVariables } from "../env-variables";

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
  const customClassNames = classNames(["relative", "w-full", className]);
  const url = new URL(window.location.href);

  // State.
  const [query, setQuery] = useState<string>();
  const debouncedSearchQuery = useDebounce(query, 300);

  const [selectedLocation, setSelectedLocation] = useState<FeatureResponse>();
  const [searchedLocations, setSearchedLocations] =
    useState<FeatureCollectionResponse>();

  // useEffect.
  useEffect(() => {
    setQuery(url.searchParams.get("query") ?? undefined);
  }, []);

  useEffect(() => {
    if (!debouncedSearchQuery) {
      return;
    }

    fetch(
      `https://api.maptiler.com/geocoding/${query}.json?proximity=ip&fuzzyMatch=true&limit=5&key=${EnvVariables.mapTilerKey}`
    ).then(async (res) => {
      return setSearchedLocations(await res.json());
    });
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (!selectedLocation?.id) {
      return;
    }

    fetch(
      `https://api.maptiler.com/geocoding/${selectedLocation.id}.json?limit=3&key=${EnvVariables.mapTilerKey}`
    ).then(async (res) => {
      const feature = await res.json();

      map?.addSource("searchLocation", {
        type: "geojson",
        data: feature,
      });

      map?.addLayer({
        source: "searchLocation",
        id: "searchLocationBoundary",
        type: "line",
        paint: {
          "line-color": "red",
          "line-width": 3,
        },
      });
    });

    return () => {
      const source = map?.getSource("searchLocation");

      if (source) {
        map?.removeLayer("searchLocationBoundary");
        map?.removeSource("searchLocation");
      }
    };
  }, [selectedLocation]);

  // Handlers.
  const updateSearchQuery = (value?: string) => {
    setQuery(value);

    // Update search param.
    if (!value) {
      url.searchParams.delete("query");
    } else {
      url.searchParams.set("query", value);
    }

    window.history.pushState(null, "", url.toString());
  };

  const onPlaceSelect = (feature: FeatureResponse) => {
    if (!feature.place_name_en) {
      return;
    }

    if (feature.bbox) {
      map?.fitBounds(feature.bbox);
    }

    setSelectedLocation(feature);

    updateSearchQuery();
  };

  return (
    <div className={customClassNames}>
      <Combobox value={selectedLocation} onChange={onPlaceSelect}>
        <div className="flex items-center overflow-hidden rounded-lg bg-gray-700">
          <Icon
            identifier={IconIdentifier.Search}
            className="size-5 text-gray-400 ml-3"
          />
          <Combobox.Input
            type="search"
            className="w-full border-none py-2 pr-3 pl-2 text-sm leading-5 bg-gray-700 text-gray-50 outline-none"
            displayValue={(feature: FeatureResponse) =>
              feature.place_name_en ?? ""
            }
            onChange={(e) => updateSearchQuery(e.target.value)}
            placeholder="Search locations"
          />
        </div>

        <Combobox.Options className="absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg focus:outline-none">
          {searchedLocations?.features.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-50">
              Nothing found.
            </div>
          ) : (
            searchedLocations?.features.map((feature) => (
              <Combobox.Option key={feature.id} value={feature}>
                {({ active }) => (
                  <SearchItem
                    feature={feature}
                    isSelected={feature.id === selectedLocation?.id}
                    isActive={active}
                  />
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
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
  const place = feature.place_name_en?.split(",").map((part) => part.trim());

  const placeName = place && place[0];
  const placeAddress = place?.slice(1).join(", ");

  const customClassNames = classNames(
    "flex items-center px-4 py-2 text-gray-200 hover:text-white select-none",
    className,
    {
      "font-medium": isSelected,
      "font-normal": !isSelected,
      "bg-gray-700": isActive,
    }
  );

  return (
    <div className={customClassNames} {...rest}>
      <div className="w-full">
        <p className="text-md">
          <span>{placeName}</span>
        </p>
        <p className="text-gray-400 block truncate text-sm">{placeAddress}</p>
      </div>
      {isSelected && (
        <Icon
          identifier={IconIdentifier.Tick}
          className="size-4 mr-1 text-teal-600 ml-auto"
          title="selected"
        />
      )}
    </div>
  );
};
