import classNames from "classnames";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { GlobalContext } from "../contexts";
import {
  FeatureCollectionResponse,
  FeatureResponse,
  SelectedLocation,
} from "./types";

import { useDebounce } from "@uidotdev/usehooks";
import { Icon, IconIdentifier } from "../components";
import { EnvVariables } from "../env-variables";

type SearchProps = React.HTMLProps<HTMLDivElement>;

type SearchItemProps = React.HTMLProps<HTMLLIElement> & {
  feature: FeatureResponse;
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

  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>();
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

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    updateSearchQuery(value);
  };

  const onPlaceSelect = (feature: FeatureResponse) => {
    if (!feature.place_name_en) {
      return;
    }

    if (feature.bbox) {
      map?.fitBounds(feature.bbox);
    }

    setSelectedLocation({
      id: feature.id,
      name: feature.place_name_en,
    });

    updateSearchQuery();
  };

  return (
    <div className={customClassNames}>
      <Icon
        identifier={IconIdentifier.Search}
        className="absolute left-3 top-3 size-4 text-gray-400 stroke-5"
      />

      <input
        className="h-10 w-full border border-input px-3 text-sm bg-gray-700 text-gray-50 pl-10 pr-4 py-2 rounded-md focus:outline-none "
        placeholder="Search locations"
        type="search"
        value={query ?? selectedLocation?.name}
        onChange={onInputChange}
      />

      {/* Search Options */}
      {query && (
        <div className="absolute mt-1 w-full rounded-md shadow-md bg-gray-800 border-gray-600">
          {searchedLocations && searchedLocations.features.length > 0 ? (
            <ul className="py-1 text-sm text-gray-400">
              {searchedLocations.features.map((feature) => (
                <SearchItem
                  key={feature.id}
                  feature={feature}
                  onClick={() => onPlaceSelect(feature)}
                />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col text-center space-y-2 p-5">
              <h3 className="text-lg font-medium text-gray-300">
                No results found
              </h3>
              <p className="text-sm text-gray-400">
                Try searching for a different place.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SearchItem: React.FC<SearchItemProps> = ({ feature, ...rest }) => {
  const place = feature.place_name_en?.split(",").map((part) => part.trim());

  const placeName = place && place[0];
  const placeAddress = place?.slice(1).join(", ");

  return (
    <li
      className="block px-4 py-2 text-gray-200 hover:bg-gray-600 hover:text-white"
      {...rest}
    >
      <div>
        <a href="#">{placeName}</a>
        <p className="text-gray-400">{placeAddress}</p>
      </div>
    </li>
  );
};
