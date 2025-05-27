import {
  TerraDrawPointMode,
  TerraDrawCircleMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  TerraDrawFreehandMode,
  TerraDrawRectangleMode,
} from 'terra-draw';
import { DEFAULT_STYLES } from './constants';

export const setupModes = () => {
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
      styles: DEFAULT_STYLES,
    }),
    new TerraDrawLineStringMode({
      snapping: {
        toCoordinate: true,
      },
      styles: DEFAULT_STYLES,
    }),
    new TerraDrawPolygonMode({
      styles: {
        fillColor: DEFAULT_STYLES.polygonFillColor,
        fillOpacity: DEFAULT_STYLES.polygonFillOpacity,
        outlineColor: DEFAULT_STYLES.polygonOutlineColor,
        outlineWidth: DEFAULT_STYLES.polygonOutlineWidth,
      },
      snapping: {
        toLine: true,
        toCoordinate: true,
      },
    }),
    new TerraDrawRectangleMode({
      styles: {
        fillColor: DEFAULT_STYLES.polygonFillColor,
        fillOpacity: DEFAULT_STYLES.polygonFillOpacity,
        outlineColor: DEFAULT_STYLES.polygonOutlineColor,
        outlineWidth: DEFAULT_STYLES.polygonOutlineWidth,
      },
    }),
    new TerraDrawCircleMode({
      styles: {
        fillColor: DEFAULT_STYLES.polygonFillColor,
        fillOpacity: DEFAULT_STYLES.polygonFillOpacity,
        outlineColor: DEFAULT_STYLES.polygonOutlineColor,
        outlineWidth: DEFAULT_STYLES.polygonOutlineWidth,
      },
    }),
    new TerraDrawFreehandMode({
      styles: {
        fillColor: DEFAULT_STYLES.polygonFillColor,
        fillOpacity: DEFAULT_STYLES.polygonFillOpacity,
        outlineColor: DEFAULT_STYLES.polygonOutlineColor,
        outlineWidth: DEFAULT_STYLES.polygonOutlineWidth,
      },
    }),
  ];
};
