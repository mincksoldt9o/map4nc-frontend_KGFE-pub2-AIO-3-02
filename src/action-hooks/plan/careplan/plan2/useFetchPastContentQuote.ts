import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import plan2Store from '@my/stores/plan/careplan/plan2/Plan2Store';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L122002Plan2ApiFactory } from 'maps4nc-frontend-web-api';

const api = L122002Plan2ApiFactory(undefined, basePath, axios);

export const useFetchPastContentQuote = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    async (searchCriteria: string, isLoginStaffOnly: boolean, searchDateFrom: number | undefined, searchDateTo: number | undefined) => {
      try {
        dispatch(plan2Store.actions.loadingPastContentQuoteStatus());
        // 過去内容引用取得
        const res = await api.postCareplanKaigoPlan2PastContentQuote(searchCriteria, isLoginStaffOnly, searchDateFrom, searchDateTo);
        dispatch(plan2Store.actions.fetchedPastContentQuote(res.data));
      } catch (e) {
        handleApiError(e);
        dispatch(plan2Store.actions.erroredPastContentQuoteStatus());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchPastContentQuote;
