import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import plan2Store from '@my/stores/plan/careplan/plan2/Plan2Store';

export const useClearPlan2 = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(plan2Store.actions.clearPlan2());
  }, [dispatch]);
};

export default useClearPlan2;
