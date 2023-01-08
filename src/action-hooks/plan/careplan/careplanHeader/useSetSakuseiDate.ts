import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader';

export const useSetSakuseiDate = () => {
  const dispatch = useDispatch();
  return useCallback(
    (sakuseiDate: number) => {
      dispatch(careplanHeaderStore.actions.setSakuseiDate(sakuseiDate));
    },
    [dispatch]
  );
};

export default useSetSakuseiDate;
