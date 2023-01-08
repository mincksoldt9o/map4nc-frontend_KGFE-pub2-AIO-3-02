import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import plan1Store from '@my/stores/plan/careplan/plan1/Plan1Store';

export const useSetDirtyPlan1Form = () => {
  const dispatch = useDispatch();
  return useCallback(
    (isDirty: boolean) => {
      dispatch(plan1Store.actions.setDirty(isDirty));
    },
    [dispatch]
  );
};

export default useSetDirtyPlan1Form;
