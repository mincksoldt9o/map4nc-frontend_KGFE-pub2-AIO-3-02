import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import kaigiStore from '@my/stores/plan/careplan/kaigi/KaigiStore';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L124002CareplanKaigiUpdateApiFactory } from 'maps4nc-frontend-web-api';
import { CarePlanKaigiRegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useShowSuccessSnacbar } from '@my/action-hooks';

const api = L124002CareplanKaigiUpdateApiFactory(undefined, basePath, axios);

export const usePutKaigi = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);
  const showSuccessSnacbar = useShowSuccessSnacbar();

  return useCallback(
    async (officeServiceKindSeq: number, riyoushaSeq: number, keikakushoShubetsu: string, keikakushoSeq: number, data: CarePlanKaigiRegisterData) => {
      try {
        const res = await api.putCareplanOfficeServiceKindSeqRiyoushaSeqKaigiKeikakushoShubetsuKeikakushoSeq(officeServiceKindSeq, riyoushaSeq, keikakushoShubetsu, keikakushoSeq, data);
        showSuccessSnacbar(res);
        dispatch(kaigiStore.actions.clearKaigi());
      } catch (e) {
        handleApiError(e);
      }
    },
    [dispatch, handleApiError, showSuccessSnacbar]
  );
};

export default usePutKaigi;
