import * as turf from '@turf/turf';
import { Feature } from 'geojson';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { GeoJSONStoreFeatures, TerraDraw } from 'terra-draw';
import { useMediaQuery } from 'usehooks-ts';
import { v4 as uuid4 } from 'uuid';
import {
  Button,
  Icon,
  IconIdentifier,
  Modal,
  ModalProps,
} from '../../../components';
import { GlobalContext } from '../../../contexts';
import { DEFAULT_STYLES } from '../constants';
import { Modes } from '../types';
import { FeaturesInfo } from './features-info';

type DrawFeatureModalProps = Omit<ModalProps, 'title'> & {
  draw: TerraDraw;
  changeMode: (mode: Modes) => void;
};

type CreateLayerData = {
  layerName: string;
  drawnFeatures: Record<string, GeoJSONStoreFeatures>;
};

export const DrawFeatureModal: React.FC<DrawFeatureModalProps> = ({
  draw,
  onClose,
  changeMode,
  ...rest
}) => {
  // Context.
  const { map, layers, setEditingLayerId, editingLayerId, layerManager } =
    useContext(GlobalContext);

  // Hooks.
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<CreateLayerData>({
    defaultValues: {
      layerName: 'Untitled Layer',
      drawnFeatures: {},
    },
  });

  // States.
  const [activeFeature, setActiveFeature] = useState<GeoJSONStoreFeatures>();

  // Constants.
  const isMediumDevice = useMediaQuery('(max-width: 768px)');
  const drawnFeatures = watch('drawnFeatures');

  // useEffects.
  useEffect(() => {
    // On feature changes.
    const onDraw = (featureIds: Array<string | number>) => {
      const features = draw?.getSnapshot();
      const currentMode = draw?.getMode();

      if (!features || !currentMode) {
        return;
      }

      const featureIdsSet = new Set(featureIds);

      for (const feature of features) {
        const featureId = feature.id ?? '';

        if (!featureIdsSet.has(featureId)) {
          continue;
        }

        const featureType = feature.geometry.type.toLowerCase();

        const isSameType = featureType === currentMode;
        const isPolygonInSpecialMode =
          feature.geometry.type === 'Polygon' &&
          ['rectangle', 'circle', 'freehand'].includes(currentMode);

        const isSelectableFeature =
          currentMode === 'select' && featureId in getValues('drawnFeatures');

        if (isSameType || isPolygonInSpecialMode || isSelectableFeature) {
          setActiveFeature(feature);
          break;
        }
      }
    };

    draw.on('change', onDraw);

    // On feature drawing finish.
    const onDrawEnd = (featureId: string | number) => {
      const features = draw?.getSnapshot();
      const feature = features.filter(({ id }) => id === featureId)[0];

      const currentDrawnFeatures = getValues('drawnFeatures');
      const updatedDrawnFeatures = {
        ...currentDrawnFeatures,
        [featureId]: feature,
      };
      setValue('drawnFeatures', updatedDrawnFeatures, { shouldDirty: true });

      setActiveFeature(feature);
    };
    draw.on('finish', onDrawEnd);

    return () => {
      draw.off('change', onDraw);
      draw.off('finish', onDrawEnd);
    };
  }, []);

  useEffect(() => {
    if (!layers || !editingLayerId) return;

    const layer = layers[editingLayerId];
    if (layer.type !== 'geojson') return;

    const featuresCollection = layer.sourceSpec.data;
    if (
      typeof featuresCollection === 'string' ||
      featuresCollection.type !== 'FeatureCollection'
    ) {
      throw new Error('Invalid GeoJSON object: Expected a FeatureCollection.');
    }

    const features: Feature[] = featuresCollection.features;

    if (features.length > 0) {
      map?.setLayerVisibility(editingLayerId, 'none');
      layerManager?.zoomToLayer(editingLayerId);
    }

    // Setup draw with initial features.
    draw?.start();
    // @ts-ignore
    draw?.addFeatures(features);

    changeMode('select');

    // Setup initial form values.
    const featuresValue = features.reduce<Record<string, Feature>>(
      (acc, feature) => {
        const id: string = feature.id ?? feature.properties?.id ?? uuid4();
        acc[id] = feature;
        return acc;
      },
      {},
    );

    // @ts-ignore
    setValue('drawnFeatures', featuresValue);
    setValue('layerName', layer.name);
  }, [editingLayerId]);

  // Handlers.
  const onModalClose = () => {
    onClose();
    reset();
    setActiveFeature(undefined);
    setEditingLayerId?.(undefined);

    if (editingLayerId) {
      map?.setLayerVisibility(editingLayerId, 'visible');
    }
  };

  const onSubmit = (data: CreateLayerData) => {
    const features = turf.featureCollection(Object.values(data.drawnFeatures));

    if (editingLayerId) {
      setEditingLayerId?.(undefined);
      layerManager?.updateGeoJsonLayer(editingLayerId, {
        name: data.layerName,
        data: features,
      });
    } else {
      layerManager?.addGeoJsonLayer({
        name: data.layerName,
        data: features,
        styles: DEFAULT_STYLES,
      });
    }

    draw.clear();
    onModalClose();
  };

  const onClear = () => {
    draw.clear();
    setValue('drawnFeatures', {}, { shouldDirty: true });
    setActiveFeature(undefined);
  };

  return (
    <Modal
      title={
        <div className="flex items-center">
          <Icon identifier={IconIdentifier.Layer} size={18} />
          <input
            placeholder="Layer Name"
            className="ml-2 rounded border border-transparent bg-transparent px-1 py-[0.1rem] outline-none focus:border-gray-300"
            {...register('layerName', {
              required: true,
            })}
          />
        </div>
      }
      position={isMediumDevice ? 'bottom-left' : 'top-right'}
      className={isMediumDevice ? '!w-[calc(100%-3.8rem)]' : ''}
      onClose={onModalClose}
      {...rest}
    >
      <FeaturesInfo features={drawnFeatures} activeFeature={activeFeature} />

      <div className="mt-4 flex items-center justify-between">
        <Button
          type="submit"
          iconIdentifier={IconIdentifier.Save}
          variant="secondary"
          className="border px-5"
          onClick={handleSubmit(onSubmit)}
          disabled={!isDirty}
        >
          {editingLayerId ? 'Save' : 'Save as Layer'}
        </Button>

        <Button
          iconIdentifier={IconIdentifier.Bin}
          onClick={onClear}
          variant="secondary"
          className="text-red-500"
          title="Remove drawn features"
          disabled={Object.keys(drawnFeatures).length === 0}
        />
      </div>
    </Modal>
  );
};
