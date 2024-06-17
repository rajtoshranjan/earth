import {
  RasterSourceSpecification,
  GeoJSONSourceSpecification,
} from 'maplibre-gl';
import { HexColor } from 'terra-draw';

export type LayerIdsMap = {
  geojson: {
    pointLayerId: string;
    lineLayerId: string;
    polygonBoundaryLayerId: string;
    polygonLayerId: string;
  };
  raster: string;
};

export type LayerType = keyof LayerIdsMap;

export type Styles = Partial<{
  pointColor: HexColor;
  pointWidth: number;
  pointOutlineColor: HexColor;
  pointOutlineWidth: number;
  lineStringColor: HexColor;
  lineStringWidth: number;
  polygonFillColor: HexColor;
  polygonFillOpacity: number;
  polygonOutlineColor: HexColor;
  polygonOutlineWidth: number;
}>;

export type CreateRasterLayerSpecs = Omit<RasterSourceSpecification, 'type'> & {
  id?: string;
};

export type CreateGeoJSONLayerSpecs = Omit<
  GeoJSONSourceSpecification,
  'type'
> & {
  id?: string;
  styles: Styles;
};
