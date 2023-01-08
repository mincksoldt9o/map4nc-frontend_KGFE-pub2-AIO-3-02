import { useCallback } from 'react';
import OutputSettingStore from '@my/stores/plan/careplan/OutputSettingStore';
import { useDispatch } from 'react-redux';

export const useSetDirtyOutputSettingForm = () => {
  const dispatch = useDispatch();
  return useCallback(
    (isDirty: boolean) => {
      dispatch(OutputSettingStore.actions.setDirty(isDirty));
    },
    [dispatch]
  );
};

export default useSetDirtyOutputSettingForm;
