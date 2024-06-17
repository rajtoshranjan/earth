import React from 'react';

type MeasurementNodeProps = {
  title: string;
  value: string | number;
  unit: Units;
};

export enum Units {
  Meter = 'meter',
  Kilometer = 'km',
  Degree = 'deg',
}

export const MeasurementNode: React.FC<MeasurementNodeProps> = ({
  title,
  value,
  unit,
}) => {
  // Helpers.
  const getUnitJSX = () => {
    switch (unit) {
      case Units.Kilometer:
        return 'km';
      case Units.Meter:
        return (
          <>
            m <sup>2</sup>
          </>
        );
      case Units.Degree:
        return <sup>&deg;</sup>;
    }
  };

  return (
    <div className="flex items-center justify-between py-1 text-sm text-gray-300">
      <div>
        <p className="font-bold">{title}</p>
        <p>
          {value} {getUnitJSX()}
        </p>
      </div>

      {/* TODO: Add unit convert */}
      {/* <DropdownMenu iconIdentifier={IconIdentifier.Down} className="size-6">
        <DropdownMenu.Item>Meter</DropdownMenu.Item>
      </DropdownMenu> */}
    </div>
  );
};
