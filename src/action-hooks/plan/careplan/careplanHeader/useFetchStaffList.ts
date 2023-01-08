import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader/CareplanHeaderStore';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { Z9999UserListApiFactory } from 'maps4nc-frontend-web-api';

const api = Z9999UserListApiFactory(undefined, basePath, axios);

export const useFetchStaffList = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    async (searchDateFromNum: number) => {
      try {
        dispatch(careplanHeaderStore.actions.loadingStaffList());
        // スタッフリスト取得
        const isNoWariate = true;
        const res = await api.getCommonUserList(searchDateFromNum, undefined, undefined, isNoWariate);

        dispatch(careplanHeaderStore.actions.fetchedStaffList(res.data));
      } catch (e) {
        handleApiError(e);
        dispatch(careplanHeaderStore.actions.erroredLodingStaffList());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchStaffList;
