import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import careplanHeaderStore, { CareplanHeaderSelectedKeikakushoKanriType } from '@my/stores/plan/careplan/careplanHeader';
import { PlanKeikakushoKanri } from 'maps4nc-frontend-web-api/dist/lib/model';

export const useSetSelectedPlanKeikakushoKanri = () => {
  const dispatch = useDispatch();
  return useCallback(
    (planKeikakushoKanri: PlanKeikakushoKanri) => {
      const data: CareplanHeaderSelectedKeikakushoKanriType = {
        info: planKeikakushoKanri,
        updated: new Date().getTime(),
      };
      dispatch(careplanHeaderStore.actions.setSelectedPlanKeikakushoKanri(data));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );
};

export default useSetSelectedPlanKeikakushoKanri;
