import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import outputSettingStore from '@my/stores/plan/careplan/OutputSettingStore';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { Z9999OutputSettingApiFactory } from 'maps4nc-frontend-web-api';
import { OutputSetting } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useShowSuccessSnacbar } from '@my/action-hooks';

const api = Z9999OutputSettingApiFactory(undefined, basePath, axios);

export const usePostOutputSetting = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);
  const showSuccessSnacbar = useShowSuccessSnacbar();

  return useCallback(
    async (saveData: OutputSetting) => {
      try {
        // 出力設定（同意欄）を登録
        const res = await api.postCommonOutputSetting(saveData);

        showSuccessSnacbar(res);
        dispatch(outputSettingStore.actions.clearOutputSetting());
      } catch (e) {
        handleApiError(e);
      }
    },
    [dispatch, handleApiError, showSuccessSnacbar]
  );
};

export default usePostOutputSetting;
