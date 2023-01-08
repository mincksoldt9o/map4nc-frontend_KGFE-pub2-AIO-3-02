import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import kaigiStore from '@my/stores/plan/careplan/kaigi/KaigiStore';

export const useClearKaigi = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(kaigiStore.actions.clearKaigi());
  }, [dispatch]);
};

export default useClearKaigi;
