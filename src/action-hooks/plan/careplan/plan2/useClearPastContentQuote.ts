import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import plan2Store from '@my/stores/plan/careplan/plan2/Plan2Store';

export const useClearPastContentQuote = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(plan2Store.actions.clearPastContentQuote());
  }, [dispatch]);
};

export default useClearPastContentQuote;
