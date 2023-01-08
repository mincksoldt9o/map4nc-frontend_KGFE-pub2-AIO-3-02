import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader/CareplanHeaderStore';

export const useCloseAddConfirmDialog = () => {
  const dispatch = useDispatch();

  return useCallback(() => {
    dispatch(careplanHeaderStore.actions.closeAddConfirmDialog());
  }, [dispatch]);
};

export default useCloseAddConfirmDialog;
