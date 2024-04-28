import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import classNames from "classnames";
import {
  FeatureResponse,
  FeatureCollectionResponse,
  SelectedLocation,
} from "./types";
import { GlobalContext } from "../../contexts";

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
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>();
  const [searchedLocations, setSearchedLocations] =
    useState<FeatureCollectionResponse>();

  // useEffect.
  useEffect(() => {
    setQuery(url.searchParams.get("query") ?? undefined);
  }, []);

  useEffect(() => {
    if (!query) {
      return;
    }

    const timeoutId = setTimeout(fetchLocationList, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (!selectedLocation?.id) {
      return;
    }

    fetch(
      `https://api.maptiler.com/geocoding/${
        selectedLocation.id
      }.json?limit=3&key=${import.meta.env.VITE_MAP_TILER_KEY}`
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

  // Helpers.
  const fetchLocationList = () => {
    fetch(
      `https://api.maptiler.com/geocoding/${query}.json?proximity=ip&fuzzyMatch=true&limit=5&key=${
        import.meta.env.VITE_MAP_TILER_KEY
      }`
    ).then(async (res) => {
      return setSearchedLocations(await res.json());
    });
  };

  // Handlers.
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    // Update search param.
    url.searchParams.set("query", value);
    window.history.pushState(null, "", url.toString());
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
    setQuery(undefined);
  };

  return (
    <div className={customClassNames}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-3 top-3 h-4 w-4 text-gray-400"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3"></path>
      </svg>

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
