import { LngLatBoundsLike } from "maplibre-gl";

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
  "osm:place_type"?: string;
  place_type_name: (string | null)[];
};

type GeometryResponse = {
  type: string;
  coordinates: number[];
};

export type FeatureResponse = {
  type: string;
  properties: PropertiesResponse;
  geometry: GeometryResponse;
  bbox?: LngLatBoundsLike;
  center: number[];
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

export type FeatureCollectionResponse = {
  type: string;
  features: FeatureResponse[];
  query: string[];
  attribution: string;
};

export type SelectedLocation = {
  id: string;
  name: string;
};
