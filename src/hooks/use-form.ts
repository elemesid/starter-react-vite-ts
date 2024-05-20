import {
  useForm as useHookForm,
  UseFormProps as UseHookFormProps,
  FieldValues,
  UseFormHandleSubmit,
  UseFormReturn,
} from "react-hook-form";
import { useWarnAboutChange } from "./use-warn-about-change";
import { BaseRecord } from "~/@types";
import { useEffect } from "react";

export type UseFormReturnType<
  TVariables extends FieldValues = FieldValues,
  TContext extends BaseRecord = BaseRecord,
> = UseFormReturn<TVariables, TContext>;

export type UseFormProps<TVariables extends FieldValues = FieldValues, TContext extends BaseRecord = BaseRecord> = {
  warnWhenUnsavedChanges?: boolean;
} & UseHookFormProps<TVariables, TContext>;

export const useForm = <TVariables extends FieldValues = FieldValues, TContext extends BaseRecord = BaseRecord>({
  warnWhenUnsavedChanges: warnWhenUnsavedChangesProp,
  ...rest
}: UseFormProps<TVariables, TContext> = {}): UseFormReturnType<TVariables, TContext> => {
  const { warnWhen, setWarnWhen } = useWarnAboutChange();

  const warnWhenUnsavedChanges = warnWhenUnsavedChangesProp ?? warnWhen;

  const onValuesChange = (changeValues: Record<string, any>) => {
    if (warnWhenUnsavedChanges) {
      setWarnWhen(true);
    }
    return changeValues;
  };
  const useHookFormResult = useHookForm<TVariables, TContext>({
    ...rest,
  });

  const { watch, handleSubmit: handleSubmitReactHookForm } = useHookFormResult;

  useEffect(() => {
    const subscription = watch((values: any, { type }: { type?: any }) => {
      if (type === "change") {
        onValuesChange(values);
      }
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  const handleSubmit: UseFormHandleSubmit<TVariables> = (onValid, onInvalid) => async (e) => {
    setWarnWhen(false);
    return await handleSubmitReactHookForm(onValid, onInvalid)(e);
  };

  return {
    ...useHookFormResult,
    handleSubmit,
  };
};
