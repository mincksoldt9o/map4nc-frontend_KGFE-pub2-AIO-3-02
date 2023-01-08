import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import plan2Store from '@my/stores/plan/careplan/plan2/Plan2Store';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L122003Plan2ApiFactory } from 'maps4nc-frontend-web-api';
import { PlanKyotakuServiceKeikakusho2RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useShowSuccessSnacbar } from '@my/action-hooks';

const api = L122003Plan2ApiFactory(undefined, basePath, axios);

export const usePostPlan2 = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);
  const showSuccessSnacbar = useShowSuccessSnacbar();

  return useCallback(
    async (riyoushaSeq: number, keikakushoSeq: number | undefined, data: PlanKyotakuServiceKeikakusho2RegisterData) => {
      try {
        // 追加
        const res = await api.postCareplanKaigoRiyoushaSeqPlan2(riyoushaSeq, keikakushoSeq, data);
        showSuccessSnacbar(res);
        dispatch(plan2Store.actions.clearPlan2());
      } catch (e) {
        handleApiError(e);
      }
    },
    [dispatch, handleApiError, showSuccessSnacbar]
  );
};

export default usePostPlan2;
