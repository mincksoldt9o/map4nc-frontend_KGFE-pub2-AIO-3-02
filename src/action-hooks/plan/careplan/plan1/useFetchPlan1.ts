import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import plan1Store from '@my/stores/plan/careplan/plan1/Plan1Store';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L121001Plan1ApiFactory } from 'maps4nc-frontend-web-api';

const api = L121001Plan1ApiFactory(undefined, basePath, axios);
console.log('api-object', api);

export const useFetchPlan1 = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    async (officeServiceKindSeq: number, riyoushaSeq: number, keikakushoSeq: number) => {
      try {
        dispatch(plan1Store.actions.loading());
        // 居宅サービス計画書(1)取得
        const res = await api.getCareplanKaigoOfficeServiceKindSeqRiyoushaSeqPlan1KeikakushoSeq(officeServiceKindSeq, riyoushaSeq, keikakushoSeq);
        dispatch(plan1Store.actions.fetchedPlanKyotakuServiceKeikakusho1(res.data));
        console.log("res-obj: ", res);
        console.log("res.data: ", res.data);
      } catch (e) {
        handleApiError(e);
        dispatch(plan1Store.actions.errored());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchPlan1;
