import { useContext } from "react";

import { UnsavedWarnContext, type IUnsavedWarnContext } from "~/contexts";

export type UseWarnAboutChangeType = () => {
  warnWhen: NonNullable<IUnsavedWarnContext["warnWhen"]>;
  setWarnWhen: NonNullable<IUnsavedWarnContext["setWarnWhen"]>;
};

export const useWarnAboutChange: UseWarnAboutChangeType = () => {
  const { warnWhen, setWarnWhen } = useContext(UnsavedWarnContext);

  return {
    warnWhen: Boolean(warnWhen),
    setWarnWhen: setWarnWhen ?? (() => undefined),
  };
};
