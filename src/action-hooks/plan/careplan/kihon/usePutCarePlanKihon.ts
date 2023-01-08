import { useCallback } from 'react';
import { useDispatch, useStore } from 'react-redux';
import axios, { basePath } from '@my/axios';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L131001CareplanYobouKihonApiFactory } from 'maps4nc-frontend-web-api';
import { UpdateUserBasicInformationParam } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useShowSuccessSnacbar } from '@my/action-hooks';
import { RootState } from '@my/stores';
import careplanKihonStore from '@my/stores/plan/careplan/kihon/KihonStore';

const api = L131001CareplanYobouKihonApiFactory(undefined, basePath, axios);

export const usePutCarePlanKihon = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);
  const showSuccessSnacbar = useShowSuccessSnacbar();
  const store = useStore<RootState>();
  const rootState = store.getState();
  const { selectedPlanKeikakushoKanri } = rootState.careplanHeader;

  return useCallback(
    async (saveData: UpdateUserBasicInformationParam) => {
      try {
        // 出力設定（同意欄）を登録
        const res = await api.putCareplanYobouOfficeServiceKindSeqRiyoushaSeqKihonKeikakushoSeq(
          selectedPlanKeikakushoKanri?.info?.officeServiceKindSeq || 0,
          selectedPlanKeikakushoKanri?.info?.riyoushaSeq || 0,
          selectedPlanKeikakushoKanri?.info?.keikakushoSeq || 0,
          saveData
        );

        showSuccessSnacbar(res);
        dispatch(careplanKihonStore.actions.clearCarePlanKihon());
      } catch (e) {
        handleApiError(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, handleApiError, showSuccessSnacbar]
  );
};

export default usePutCarePlanKihon;
