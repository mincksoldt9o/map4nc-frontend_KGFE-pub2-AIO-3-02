import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader';

export const useClearCareplanHeader = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(careplanHeaderStore.actions.clearCareplanHeader());
  }, [dispatch]);
};

export default useClearCareplanHeader;
