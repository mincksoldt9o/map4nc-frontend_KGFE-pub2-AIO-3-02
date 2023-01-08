import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import kaigiStore from '@my/stores/plan/careplan/kaigi/KaigiStore';

export const useSetDirtyKaigiForm = () => {
  const dispatch = useDispatch();
  return useCallback(
    (isDirty: boolean) => {
      dispatch(kaigiStore.actions.setDirty(isDirty));
    },
    [dispatch]
  );
};

export default useSetDirtyKaigiForm;
