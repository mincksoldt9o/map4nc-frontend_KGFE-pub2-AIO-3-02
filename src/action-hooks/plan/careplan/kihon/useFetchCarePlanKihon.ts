import { useCallback } from 'react';
import { useDispatch, useStore } from 'react-redux';
import axios, { basePath } from '@my/axios';

import kihonStore from '@my/stores/plan/careplan/kihon/KihonStore';
import { RootState } from '@my/stores';
import { L131001CareplanYobouKihonApiFactory } from 'maps4nc-frontend-web-api';
import useHandleApiError from '@my/action-hooks/useHandleApiError';

const apiL131001 = L131001CareplanYobouKihonApiFactory(undefined, basePath, axios);
export type LabelAndValue = { value: string; label?: string };

export const useFetchCarePlanKihon = (screenID: string) => {
  const dispatch = useDispatch();
  const store = useStore<RootState>();
  const rootState = store.getState();
  const handleApiError = useHandleApiError(screenID);

  const { selectedPlanKeikakushoKanri } = rootState.careplanHeader;

  return useCallback(
    async () => {
      try {
        const res = await apiL131001.getCareplanYobouOfficeServiceKindSeqRiyoushaSeqKihonKeikakushoSeq(
          selectedPlanKeikakushoKanri?.info?.officeServiceKindSeq || 0,
          selectedPlanKeikakushoKanri?.info?.riyoushaSeq || 0,
          selectedPlanKeikakushoKanri?.info?.keikakushoSeq || 0
        );
        dispatch(kihonStore.actions.fetchCarePlanKihon({ ...res.data }));
      } catch (e) {
        handleApiError(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, handleApiError]
  );
};

export default useFetchCarePlanKihon;
