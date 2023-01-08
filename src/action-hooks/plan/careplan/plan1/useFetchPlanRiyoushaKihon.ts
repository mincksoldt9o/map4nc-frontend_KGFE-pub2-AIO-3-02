import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import plan1Store from '@my/stores/plan/careplan/plan1/Plan1Store';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { Z9999RiyoushaKihonApiFactory } from 'maps4nc-frontend-web-api';

const api = Z9999RiyoushaKihonApiFactory(undefined, basePath, axios);

export const useFetchPlanRiyoushaKihon = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    async (riyoushaSeq: number, sakuseiDate: number) => {
      try {
        dispatch(plan1Store.actions.loadingRiyoushaKihon());
        // (プラン用) 利用者基本情報取得
        const res = await api.getCommonRiyoushaSeqRiyoushaKihon(riyoushaSeq, sakuseiDate);
        dispatch(plan1Store.actions.fetchedRiyoushaKihon(res.data));
      } catch (e) {
        handleApiError(e);
        dispatch(plan1Store.actions.erroredRiyoushaKihon());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchPlanRiyoushaKihon;
