import { Styles } from '../../core/maplibre';

export type StyleFieldType = 'color' | 'range';

export type StyleFieldConfig = {
  key: keyof Styles;
  label: string;
  type: StyleFieldType;
  min?: number;
  max?: number;
  step?: number;
};

export type StyleSectionConfig = {
  title: string;
  /** GeoJSON geometry types that map to this section */
  geometryTypes: string[];
  fields: StyleFieldConfig[];
};

export const STYLE_SECTIONS: StyleSectionConfig[] = [
  {
    title: 'Points',
    geometryTypes: ['Point', 'MultiPoint'],
    fields: [
      { key: 'pointColor', label: 'Fill Color', type: 'color' },
      {
        key: 'pointWidth',
        label: 'Radius',
        type: 'range',
        min: 1,
        max: 20,
        step: 1,
      },
      { key: 'pointOutlineColor', label: 'Outline Color', type: 'color' },
      {
        key: 'pointOutlineWidth',
        label: 'Outline Width',
        type: 'range',
        min: 0,
        max: 10,
        step: 0.5,
      },
    ],
  },
  {
    title: 'Lines',
    geometryTypes: ['LineString', 'MultiLineString'],
    fields: [
      { key: 'lineStringColor', label: 'Color', type: 'color' },
      {
        key: 'lineStringWidth',
        label: 'Width',
        type: 'range',
        min: 1,
        max: 20,
        step: 0.5,
      },
    ],
  },
  {
    title: 'Polygons',
    geometryTypes: ['Polygon', 'MultiPolygon'],
    fields: [
      { key: 'polygonFillColor', label: 'Fill Color', type: 'color' },
      {
        key: 'polygonFillOpacity',
        label: 'Fill Opacity',
        type: 'range',
        min: 0,
        max: 1,
        step: 0.05,
      },
      { key: 'polygonOutlineColor', label: 'Outline Color', type: 'color' },
      {
        key: 'polygonOutlineWidth',
        label: 'Outline Width',
        type: 'range',
        min: 0,
        max: 20,
        step: 0.5,
      },
    ],
  },
];
