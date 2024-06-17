import { IconIdentifier } from '../../components';

export type Modes =
  | 'select'
  | 'point'
  | 'linestring'
  | 'polygon'
  | 'rectangle'
  | 'circle'
  | 'freehand';

export type RequiredModes = Exclude<Modes, 'freehand' | 'circle' | 'rectangle'>;
export type OptionalModes = Exclude<Modes, RequiredModes>;

export type ModeInfo = {
  iconIdentifier: IconIdentifier;
};
