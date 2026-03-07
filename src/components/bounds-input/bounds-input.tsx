import React from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Input } from '../input';

export interface BoundsInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: FieldErrors<any>;
  required?: boolean | string;
}

export const BoundsInput: React.FC<BoundsInputProps> = ({
  register,
  errors,
  required = true,
}) => {
  return (
    <>
      <h6 className="mt-5 text-sm text-gray-500">Tile Coverage (bounds)</h6>
      <div className="mt-2 flex flex-col items-center justify-center gap-5 py-2">
        <Input
          className="w-6/12"
          label="North Latitude"
          type="number"
          step="any"
          {...register('northLatitude', {
            required,
            max: { value: 85, message: 'Max 85' },
            min: { value: -85, message: 'Min -85' },
          })}
          error={errors.northLatitude as never}
        />
        <div className="flex w-full items-center justify-center gap-6">
          <Input
            className="w-1/2"
            label="West Longitude"
            type="number"
            step="any"
            {...register('westLongitude', {
              required,
              max: { value: 180, message: 'Max 180' },
              min: { value: -180, message: 'Min -180' },
            })}
            error={errors.westLongitude as never}
          />
          <Input
            className="w-1/2"
            label="East Longitude"
            type="number"
            step="any"
            {...register('eastLongitude', {
              required,
              max: { value: 180, message: 'Max 180' },
              min: { value: -180, message: 'Min -180' },
            })}
            error={errors.eastLongitude as never}
          />
        </div>
        <Input
          className="w-6/12"
          label="South Latitude"
          type="number"
          step="any"
          {...register('southLatitude', {
            required,
            max: { value: 85, message: 'Max 85' },
            min: { value: -85, message: 'Min -85' },
          })}
          error={errors.southLatitude as never}
        />
      </div>
    </>
  );
};
