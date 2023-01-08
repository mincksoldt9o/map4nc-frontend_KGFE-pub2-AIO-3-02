import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import plan2Store from '@my/stores/plan/careplan/plan2/Plan2Store';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L122001Plan2ApiFactory } from 'maps4nc-frontend-web-api';

const api = L122001Plan2ApiFactory(undefined, basePath, axios);

export const useFetchPlan2 = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    async (officeServiceKindSeq: number, riyoushaSeq: number, keikakushoSeq: number) => {
      try {
        dispatch(plan2Store.actions.loadingPlan2());
        // 取得
        const res = await api.getCareplanKaigoOfficeServiceKindSeqRiyoushaSeqPlan2KeikakushoSeq(officeServiceKindSeq, riyoushaSeq, keikakushoSeq);
        dispatch(plan2Store.actions.fetchedPlan2(res.data));
      } catch (e) {
        handleApiError(e);
        dispatch(plan2Store.actions.erroredPastContentQuoteStatus());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchPlan2;
