import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import plan1Store from '@my/stores/plan/careplan/plan1/Plan1Store';

export const useClearPlan1 = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(plan1Store.actions.clearPlan1());
  }, [dispatch]);
};

export default useClearPlan1;
