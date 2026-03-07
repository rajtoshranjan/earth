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
            <h6 className="font-medium text-gray-400">Your Saved Methods</h6>
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
          <div className="flex max-h-60 flex-col gap-3 overflow-y-auto">
            {Object.entries(authRecords).length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-800/50 py-8">
                <Icon
                  identifier={IconIdentifier.Save}
                  className="mb-3 size-8 text-gray-600"
                />
                <p className="text-sm font-medium text-gray-400">
                  No auth methods found
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Add one to use with your tiled layers
                </p>
              </div>
            ) : (
              Object.entries(authRecords).map(([id, record]) => (
                <div
                  key={id}
                  className="group flex items-center justify-between rounded-xl border border-gray-700 bg-gray-800 p-3 transition-colors hover:border-blue-500/50 hover:bg-gray-800/80"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-200">
                      {record.name}
                    </span>
                    <span className="mt-0.5 text-xs text-gray-500">
                      {record.headers.length} header
                      {record.headers.length === 1 ? '' : 's'} configured
                    </span>
                  </div>
                  <button
                    onClick={() => authMutations.deleteValue(id)}
                    className="flex size-8 items-center justify-center rounded-lg text-gray-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
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
          className="flex flex-col gap-5"
        >
          <div>
            <h6 className="mb-3 text-[0.8rem] font-medium text-gray-400">
              Auth Method Details
            </h6>
            <Input
              label="Auth Name"
              {...register('name', { required: true })}
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h6 className="text-[0.8rem] font-medium text-gray-400">
                Headers Configuration
              </h6>
            </div>
            <div
              id="custom-headers"
              className="flex max-h-[300px] flex-col gap-3 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900/50 p-3"
            >
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-2 rounded-lg bg-gray-800 p-2"
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <Input
                      label="Key"
                      defaultValue={field.key}
                      {...register(`headers.${index}.key` as const, {
                        required: true,
                      })}
                    />
                    <Input
                      label="Value"
                      defaultValue={field.value}
                      {...register(`headers.${index}.value` as const, {
                        required: true,
                      })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    disabled={fields.length === 1}
                    title="Remove Header"
                  >
                    <Icon identifier={IconIdentifier.Bin} className="size-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="mt-1 w-full justify-center border-dashed py-2 text-xs text-gray-400 hover:text-white"
                onClick={() => append({ key: '', value: '' })}
                iconIdentifier={IconIdentifier.Plus}
              >
                Add Another Header
              </Button>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              iconIdentifier={IconIdentifier.Save}
              className="border"
            >
              Save Method
            </Button>
          </div>
        </Fieldset>
      )}
    </Modal>
  );
};
