import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader/CareplanHeaderStore';

export const useOpenAddConirmDialog = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(careplanHeaderStore.actions.openAddConfirmDialog());
  }, [dispatch]);
};

export default useOpenAddConirmDialog;
