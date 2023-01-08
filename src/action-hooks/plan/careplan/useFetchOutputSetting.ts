import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import outputSettingStore from '@my/stores/plan/careplan/OutputSettingStore';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { Z9999OutputSettingApiFactory } from 'maps4nc-frontend-web-api';

const api = Z9999OutputSettingApiFactory(undefined, basePath, axios);

export const useFetchOutputSetting = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(async () => {
    try {
      dispatch(outputSettingStore.actions.loading());
      // 出力設定（同意欄）を取得
      const res = await api.getCommonOutputSetting();
      dispatch(outputSettingStore.actions.fetchedOutputSetting(res.data));
    } catch (e) {
      handleApiError(e);
    }
  }, [dispatch, handleApiError]);
};

export default useFetchOutputSetting;
