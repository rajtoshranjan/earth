import { useQuery } from '@tanstack/react-query';
import { EnvVariables } from '../../../env-variables';
import { FeatureCollectionResponse } from './types';

// Requests.
const fetchSearchedLocations = async (query?: string) => {
  const res = await fetch(
    `https://api.maptiler.com/geocoding/${query}.json?proximity=ip&fuzzyMatch=true&limit=5&key=${EnvVariables.mapTilerKey}`,
  );
  return res.json();
};

const fetchLocation = async (id?: string) => {
  const res = await fetch(
    `https://api.maptiler.com/geocoding/${id}.json?limit=3&key=${EnvVariables.mapTilerKey}`,
  );

  return res.json();
};

// Hooks.
export const useSearchLocation = (searchQuery?: string) =>
  useQuery<FeatureCollectionResponse>({
    queryKey: ['searchLocations', searchQuery],
    queryFn: () => fetchSearchedLocations(searchQuery),
    enabled: !!searchQuery,
  });

export const useLocation = (id?: string) =>
  useQuery<FeatureCollectionResponse>({
    queryKey: ['location', id],
    queryFn: () => fetchLocation(id),
    enabled: !!id,
  });
