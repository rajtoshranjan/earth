import {
  TerraDrawPointMode,
  TerraDrawCircleMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  TerraDrawFreehandMode,
  TerraDrawRectangleMode,
} from 'terra-draw';
import { Styles } from '../../core/maplibre';
import { DEFAULT_STYLES } from './constants';

export const setupModes = (styles: Styles = DEFAULT_STYLES) => {
  const merged_styles = { ...DEFAULT_STYLES, ...styles };
  const polygonStyles = {
    fillColor: merged_styles.polygonFillColor!,
    fillOpacity: merged_styles.polygonFillOpacity!,
    outlineColor: merged_styles.polygonOutlineColor!,
    outlineWidth: merged_styles.polygonOutlineWidth!,
  };

  return [
    new TerraDrawSelectMode({
      flags: {
        arbitary: {
          feature: {},
        },

        polygon: {
          feature: {
            draggable: true,
            rotateable: true,
            scaleable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },

        linestring: {
          feature: {
            draggable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },

        point: {
          feature: {
            draggable: true,
          },
        },

        freehand: {
          feature: {
            draggable: true,
            rotateable: true,
            scaleable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },

        circle: {
          feature: {
            draggable: true,
            rotateable: true,
            scaleable: true,
            coordinates: {
              draggable: true,
              resizable: 'center-fixed',
            },
          },
        },

        rectangle: {
          feature: {
            draggable: true,
            rotateable: true,
            scaleable: true,
            coordinates: {
              draggable: true,
              resizable: 'center-fixed',
            },
          },
        },
      },
    }),
    new TerraDrawPointMode({
      styles: {
        pointColor: merged_styles.pointColor!,
        pointWidth: merged_styles.pointWidth!,
        pointOutlineColor: merged_styles.pointOutlineColor!,
        pointOutlineWidth: merged_styles.pointOutlineWidth!,
      },
    }),
    new TerraDrawLineStringMode({
      snapping: {
        toCoordinate: true,
      },
      styles: {
        lineStringColor: merged_styles.lineStringColor!,
        lineStringWidth: merged_styles.lineStringWidth!,
      },
    }),
    new TerraDrawPolygonMode({
      styles: polygonStyles,
      snapping: {
        toLine: true,
        toCoordinate: true,
      },
    }),
    new TerraDrawRectangleMode({ styles: polygonStyles }),
    new TerraDrawCircleMode({ styles: polygonStyles }),
    new TerraDrawFreehandMode({ styles: polygonStyles }),
  ];
};
