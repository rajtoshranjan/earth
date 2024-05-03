import {
  TerraDrawPointMode,
  TerraDrawCircleMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  TerraDrawFreehandMode,
  TerraDrawRectangleMode,
  TerraDrawRenderMode,
} from 'terra-draw';

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
        freehand: {
          feature: { draggable: true, coordinates: {} },
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
        circle: {
          feature: {
            draggable: true,
          },
        },
        point: {
          feature: {
            draggable: true,
          },
        },
      },
    }),
    new TerraDrawPointMode(),
    new TerraDrawLineStringMode({
      snapping: true,
      allowSelfIntersections: false,
    }),
    new TerraDrawPolygonMode({
      snapping: true,
      allowSelfIntersections: false,
    }),
    new TerraDrawRectangleMode(),
    new TerraDrawCircleMode(),
    new TerraDrawFreehandMode(),
    new TerraDrawRenderMode({
      modeName: 'arbitary',
      styles: {
        polygonFillColor: '#4357AD',
        polygonOutlineColor: '#48A9A6',
        polygonOutlineWidth: 2,
      },
    }),
  ];
};
