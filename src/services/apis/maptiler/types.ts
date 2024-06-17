import { Feature, FeatureCollection, Geometry } from '@turf/turf';
import { LngLatBoundsLike, LngLatLike } from 'maplibre-gl';

type Context = {
  ref: string;
  country_code: string;
  id: string;
  text: string;
  wikidata?: string;
  kind: string;
  language?: string;
  text_en?: string;
  language_en?: string;
};

type PropertiesResponse = {
  ref: string;
  country_code: string;
  wikidata?: string;
  kind: string;
  'osm:place_type'?: string;
  place_type_name: (string | null)[];
};

export type FeatureResponse = Feature<Geometry, PropertiesResponse> & {
  bbox?: LngLatBoundsLike;
  center: LngLatLike;
  place_name: string;
  place_type: string[];
  relevance: number;
  id: string;
  text: string;
  place_type_name: string[];
  context: Context[];
  text_en?: string;
  place_name_en?: string;
  language?: string;
  language_en?: string;
};

export type FeatureCollectionResponse = Omit<FeatureCollection, 'features'> & {
  features: FeatureResponse[];
  query: string[];
  attribution: string;
};
