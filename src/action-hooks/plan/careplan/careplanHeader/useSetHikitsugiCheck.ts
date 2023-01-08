import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader';

export const useSetHikitsugiCheck = () => {
  const dispatch = useDispatch();
  return useCallback(
    (checked: boolean) => {
      dispatch(careplanHeaderStore.actions.setHikitsugiCheck(checked));
    },
    [dispatch]
  );
};

export default useSetHikitsugiCheck;
