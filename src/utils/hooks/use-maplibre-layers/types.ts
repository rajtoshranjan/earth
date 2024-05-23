import { RasterSourceSpecification } from 'maplibre-gl';

export type LayerInfo = {
  name: string;
  show: boolean;
  sourceId: string;
  sourceSpec: Omit<RasterSourceSpecification, 'type'>;
};

export type Layers = Record<string, LayerInfo>;

export type AddRasterLayerParams = Omit<RasterSourceSpecification, 'type'> & {
  name: string;
  show?: boolean;
};
