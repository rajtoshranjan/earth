import {
  CreateGeoJSONLayerSpecs,
  CreateRasterLayerSpecs,
  CreateVectorLayerSpecs,
} from '../../maplibre';

type CommonLayerInfo = {
  name: string;
  show: boolean;
  authRecordId?: string;
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
    | {
        type: 'vector';
        sourceSpec: CreateVectorLayerSpecs;
      }
  );

export type Layers = Record<string, LayerInfo>;

export type AddRasterLayerParams = CreateRasterLayerSpecs & {
  name: string;
  authRecordId?: string;
};

export type AddGeoJsonLayerParams = CreateGeoJSONLayerSpecs & {
  name: string;
  authRecordId?: string;
};

export type AddVectorLayerParams = CreateVectorLayerSpecs & {
  name: string;
  authRecordId?: string;
};

export type UpdateGeoJsonLayerParams = Partial<AddGeoJsonLayerParams>;
