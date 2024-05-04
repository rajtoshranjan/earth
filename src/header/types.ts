import { LngLatBoundsLike, LngLatLike } from 'maplibre-gl';

export type SelectedLocationInfo = {
  id: string;
  bound?: LngLatBoundsLike;
  center?: LngLatLike;
};
