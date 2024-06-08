import { IconIdentifier } from '../../components';

export type Modes =
  | 'select'
  | 'point'
  | 'linestring'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'freehand';

export type ModeInfo = {
  iconIdentifier: IconIdentifier;
};
