import classNames from 'classnames';
import { GeoJSON } from 'geojson';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Button, Icon, IconIdentifier, Modal } from '../../components';
import { GlobalContext } from '../../contexts';
import { Styles } from '../../core/maplibre';
import { STYLE_SECTIONS, StyleFieldConfig } from './constants';

type StyleLayerModalProps = {
  show: boolean;
  onClose: VoidFunction;
  layerId: string;
  currentStyles: Styles;
  layerData?: GeoJSON | string;
};

// Helpers.

/** Collect all unique geometry type names from a GeoJSON object. */
function collectGeometryTypes(data: GeoJSON | string | undefined): Set<string> {
  if (!data || typeof data === 'string') return new Set();

  const types = new Set<string>();

  const visit = (obj: GeoJSON) => {
    switch (obj.type) {
      case 'FeatureCollection':
        obj.features.forEach(visit);
        break;
      case 'Feature':
        if (obj.geometry) visit(obj.geometry as unknown as GeoJSON);
        break;
      case 'GeometryCollection':
        obj.geometries.forEach((g) => visit(g as unknown as GeoJSON));
        break;
      default:
        types.add(obj.type);
    }
  };

  visit(data);
  return types;
}

// Sub-components.
type ColorSwatchProps = { value: string; onChange: (v: string) => void };

const ColorSwatch: React.FC<ColorSwatchProps> = ({ value, onChange }) => (
  <div className="relative flex cursor-pointer items-center gap-2 rounded-md border border-gray-600 bg-gray-700 px-2.5 py-1.5 transition-colors hover:border-gray-500">
    <div
      className="size-4 shrink-0 rounded-sm ring-1 ring-white/10"
      style={{ backgroundColor: value }}
    />
    <span className="font-mono text-xs uppercase tracking-wider text-gray-300">
      {value}
    </span>
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="absolute inset-0 size-full cursor-pointer opacity-0"
    />
  </div>
);

type RangeControlProps = {
  field: StyleFieldConfig;
  value: number;
  onChange: (v: string) => void;
};

const RangeControl: React.FC<RangeControlProps> = ({
  field,
  value,
  onChange,
}) => {
  const displayValue =
    field.step && field.step < 1 ? value.toFixed(2) : String(Math.round(value));

  const percent =
    ((value - (field.min ?? 0)) / ((field.max ?? 1) - (field.min ?? 0))) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center">
          <div
            className="pointer-events-none h-1.5 rounded-full bg-blue-400"
            style={{ width: `${percent}%` }}
          />
        </div>
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="relative h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-600 accent-blue-400"
        />
      </div>
      <span className="w-11 rounded-md bg-gray-700 px-1.5 py-0.5 text-center font-mono text-xs text-gray-300">
        {displayValue}
      </span>
    </div>
  );
};

// Main component.

export const StyleLayerModal: React.FC<StyleLayerModalProps> = ({
  show,
  onClose,
  layerId,
  currentStyles,
  layerData,
}) => {
  const { map, layerManager } = useContext(GlobalContext);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [styles, setStyles] = useState<Styles>(currentStyles);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );
  const originalStylesRef = useRef<Styles>(currentStyles);

  // Only show sections whose geometry type is present in the layer data.
  // If data is a remote URL (string) or undefined, show all sections.
  const presentGeometryTypes = useMemo(
    () => collectGeometryTypes(layerData),
    [layerData],
  );
  const visibleSections = useMemo(
    () =>
      STYLE_SECTIONS.filter(
        (s) =>
          presentGeometryTypes.size === 0 ||
          s.geometryTypes.some((t) => presentGeometryTypes.has(t)),
      ),
    [presentGeometryTypes],
  );

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const handleFieldChange = (field: StyleFieldConfig, rawValue: string) => {
    const value = field.type === 'range' ? parseFloat(rawValue) : rawValue;
    const update = { [field.key]: value } as Styles;
    setStyles((prev) => ({ ...prev, ...update }));
    map?.updateGeoJSONLayerStyles(layerId, update);
  };

  const handleSave = async () => {
    await layerManager?.updateLayerStyles(layerId, styles);
    originalStylesRef.current = styles;
    onClose();
  };

  const handleClose = () => {
    map?.updateGeoJSONLayerStyles(layerId, originalStylesRef.current);
    setStyles(originalStylesRef.current);
    onClose();
  };

  const getFieldValue = (field: StyleFieldConfig) => {
    const val = styles[field.key];
    return val !== undefined
      ? val
      : field.type === 'color'
        ? '#ffffff'
        : (field.min ?? 0);
  };

  return (
    <Modal
      title="Style Layer"
      show={show}
      onClose={handleClose}
      position={isMobile ? 'bottom-left' : 'top-right'}
      className={isMobile ? '!w-[calc(100%-3.8rem)]' : 'max-w-xs'}
    >
      <div className="space-y-2">
        {visibleSections.map((section) => {
          const isCollapsed = collapsedSections.has(section.title);

          return (
            <div
              key={section.title}
              className="overflow-hidden rounded-lg border border-gray-700/60 bg-gray-700/20"
            >
              {/* Section header — clickable to collapse */}
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-gray-700/60 bg-gray-700/30 px-3 py-2 transition-colors hover:bg-gray-700/50"
                onClick={() => toggleSection(section.title)}
              >
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  {section.title}
                </span>
                <Icon
                  identifier={IconIdentifier.Down}
                  className={classNames(
                    'size-3 text-gray-500 transition-transform duration-200',
                    { 'rotate-180': !isCollapsed, '-rotate-0': isCollapsed },
                  )}
                />
              </button>

              {/* Fields — hidden when collapsed */}
              {!isCollapsed && (
                <div className="divide-y divide-gray-700/40 px-3">
                  {section.fields.map((field) => (
                    <div
                      key={field.key}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <label className="shrink-0 text-sm text-gray-300">
                        {field.label}
                      </label>
                      {field.type === 'color' ? (
                        <ColorSwatch
                          value={getFieldValue(field) as string}
                          onChange={(v) => handleFieldChange(field, v)}
                        />
                      ) : (
                        <RangeControl
                          field={field}
                          value={getFieldValue(field) as number}
                          onChange={(v) => handleFieldChange(field, v)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="border px-4"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          size="sm"
          iconIdentifier={IconIdentifier.Save}
          className="border px-4"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};
