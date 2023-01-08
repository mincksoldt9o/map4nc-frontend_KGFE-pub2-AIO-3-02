import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import plan1Store from '@my/stores/plan/careplan/plan1/Plan1Store';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L121002Plan1ApiFactory } from 'maps4nc-frontend-web-api';
import { PlanKyotakuServiceKeikakusho1RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useShowSuccessSnacbar } from '@my/action-hooks';

const api = L121002Plan1ApiFactory(undefined, basePath, axios);

export const usePostPlan1 = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);
  const showSuccessSnacbar = useShowSuccessSnacbar();

  return useCallback(
    async (riyoushaSeq: number, data: PlanKyotakuServiceKeikakusho1RegisterData) => {
      try {
        // 追加
        const res = await api.postCareplanKaigoRiyoushaSeqPlan1(riyoushaSeq, data);
        showSuccessSnacbar(res);
        dispatch(plan1Store.actions.clearPlan1());
      } catch (e) {
        handleApiError(e);
      }
    },
    [dispatch, handleApiError, showSuccessSnacbar]
  );
};

export default usePostPlan1;