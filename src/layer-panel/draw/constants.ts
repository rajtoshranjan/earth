import { IconIdentifier } from '../../components';
import { Styles } from '../../core/maplibre';
import { ModeInfo, OptionalModes, RequiredModes } from './types';

export const MODES: Record<RequiredModes, ModeInfo> &
  Partial<Record<OptionalModes, ModeInfo>> = {
  select: {
    iconIdentifier: IconIdentifier.Select,
  },
  point: {
    iconIdentifier: IconIdentifier.PointMarker,
  },
  linestring: {
    iconIdentifier: IconIdentifier.Line,
  },
  polygon: {
    iconIdentifier: IconIdentifier.Polygon,
  },
};

// Enable rest of the modes in desktop view.
if (window.innerWidth > 768) {
  MODES.rectangle = {
    iconIdentifier: IconIdentifier.Rectangle,
  };
  MODES.circle = {
    iconIdentifier: IconIdentifier.Circle,
  };
  MODES.freehand = {
    iconIdentifier: IconIdentifier.Freehand,
  };
}

export const DEFAULT_STYLES: Styles = {
  pointColor: '#60a5fa',
  pointWidth: 5,
  pointOutlineColor: '#ffffff',
  pointOutlineWidth: 2,
  lineStringColor: '#60a5fa',
  lineStringWidth: 3,
  polygonFillColor: '#60a5fa',
  polygonFillOpacity: 0.4,
  polygonOutlineColor: '#60a5fa',
  polygonOutlineWidth: 3,
};
