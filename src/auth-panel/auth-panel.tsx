import { Fieldset } from '@headlessui/react';
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { v4 as uuid4 } from 'uuid';
import { Button, IconIdentifier, Input, Modal, Icon } from '../components';
import { AuthRecord, useAuthStore } from '../core/auth';

type AuthPanelProps = {
  show: boolean;
  onClose: VoidFunction;
};

export const AuthPanel: React.FC<AuthPanelProps> = ({ show, onClose }) => {
  const { values: authRecords, mutations: authMutations } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);

  const { register, control, handleSubmit, reset } = useForm<AuthRecord>({
    defaultValues: { name: '', headers: [{ key: 'Authorization', value: '' }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });

  const onSubmit = async (data: AuthRecord) => {
    await authMutations.addValue(uuid4(), data);
    reset();
    setIsAdding(false);
  };

  const handleCreateNew = () => {
    reset({ name: '', headers: [{ key: 'Authorization', value: '' }] });
    setIsAdding(true);
  };

  return (
    <Modal title="Auth Methods" show={show} onClose={onClose}>
      {!isAdding ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h6 className="text-[0.8rem] font-medium text-gray-400">
              Your Saved Methods
            </h6>
            <Button
              variant="secondary"
              size="sm"
              iconIdentifier={IconIdentifier.Plus}
              onClick={handleCreateNew}
              className="px-3"
            >
              Add New
            </Button>
          </div>
          <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
            {Object.entries(authRecords).length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">
                No auth methods found.
              </p>
            ) : (
              Object.entries(authRecords).map(([id, record]) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 p-3"
                >
                  <span className="text-sm text-gray-200">{record.name}</span>
                  <button
                    onClick={() => authMutations.deleteValue(id)}
                    className="text-gray-500 transition-colors hover:text-red-400"
                    title="Delete Method"
                  >
                    <Icon identifier={IconIdentifier.Bin} className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <Fieldset
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            label="Method Name (e.g. My Protected Raster Server)"
            {...register('name', { required: true })}
          />

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="custom-headers"
                className="text-xs font-medium text-gray-300"
              >
                Custom Headers
              </label>
            </div>
            <div
              id="custom-headers"
              className="flex max-h-48 flex-col gap-3 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 p-2"
            >
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    label=""
                    className="flex-1"
                    defaultValue={field.key}
                    {...register(`headers.${index}.key` as const, {
                      required: true,
                    })}
                  />
                  <Input
                    label=""
                    className="flex-1"
                    defaultValue={field.value}
                    {...register(`headers.${index}.value` as const, {
                      required: true,
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-1 flex shrink-0 items-center justify-center p-2 text-gray-500 hover:text-red-400"
                    disabled={fields.length === 1}
                  >
                    <Icon identifier={IconIdentifier.Bin} className="size-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-1 w-full justify-center text-xs"
                onClick={() => append({ key: '', value: '' })}
                iconIdentifier={IconIdentifier.Plus}
              >
                Add Header
              </Button>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              iconIdentifier={IconIdentifier.Save}
            >
              Save Details
            </Button>
          </div>
        </Fieldset>
      )}
    </Modal>
  );
};
