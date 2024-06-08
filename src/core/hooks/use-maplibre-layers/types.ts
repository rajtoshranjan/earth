import {
  CreateGeoJSONLayerSpecs,
  CreateRasterLayerSpecs,
} from '../../maplibre';

type CommonLayerInfo = {
  name: string;
  show: boolean;
};

export type LayerInfo = CommonLayerInfo &
  (
    | {
        type: 'raster';
        sourceSpec: CreateRasterLayerSpecs;
      }
    | {
        type: 'geojson';
        sourceSpec: CreateGeoJSONLayerSpecs;
      }
  );

export type Layers = Record<string, LayerInfo>;

export type AddRasterLayerParams = CreateRasterLayerSpecs & {
  name: string;
};

export type AddGeoJsonLayerParams = CreateGeoJSONLayerSpecs & {
  name: string;
};
