import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader';

export const useSetMode = () => {
  const dispatch = useDispatch();
  return useCallback(
    (mode: 'add' | 'copy' | 'edit' | 'none' | undefined) => {
      dispatch(careplanHeaderStore.actions.setMode(mode));
    },
    [dispatch]
  );
};

export default useSetMode;
