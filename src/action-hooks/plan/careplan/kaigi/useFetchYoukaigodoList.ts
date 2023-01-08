import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import plan1Store from '@my/stores/plan/careplan/plan1/Plan1Store';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { Z9999YoukaigodoListApiFactory } from 'maps4nc-frontend-web-api';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';

const api = Z9999YoukaigodoListApiFactory(undefined, basePath, axios);

export const useFetchYoukaigodoList = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    async (searchDate: number) => {
      try {
        dispatch(plan1Store.actions.loadingYoukaigodoList());
        // 要介護度リスト取得
        const res = await api.getCommonYoukaigodoList(searchDate);
        const youkaigodoList: Array<LabelAndValue> = [];
        res.data.forEach((YoukaigodoList) => {
          youkaigodoList.push({ label: YoukaigodoList.youkaigodoName, value: YoukaigodoList.youkaigodoCode || '' });
        });
        dispatch(plan1Store.actions.fetchedYoukaigodoList(youkaigodoList));
      } catch (e) {
        handleApiError(e);
        dispatch(plan1Store.actions.erroredYoukaigodoList());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchYoukaigodoList;
