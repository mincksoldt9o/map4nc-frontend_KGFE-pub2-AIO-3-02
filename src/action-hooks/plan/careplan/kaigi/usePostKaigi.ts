import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import kaigiStore from '@my/stores/plan/careplan/kaigi/KaigiStore';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L124001CareplanKaigiRegisterApiFactory } from 'maps4nc-frontend-web-api';
import { CarePlanKaigiRegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useShowSuccessSnacbar } from '@my/action-hooks';


const api = L124001CareplanKaigiRegisterApiFactory(undefined, basePath, axios);

export const usePostKaigi = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);
  const showSuccessSnacbar = useShowSuccessSnacbar();

  return useCallback(
    // postCareplanOfficeServiceKindSeqRiyoushaSeqKaigiKeikakushoShubetsu(officeServiceKindSeq: number, riyoushaSeq: number, keikakushoShubetsu: string, carePlanKaigiRegisterData: CarePlanKaigiRegisterData, options?: any): AxiosPromise<PlanServiseTantoushaKaigiKey>;
    async (officeServiceKindSeq: number, riyoushaSeq: number, keikakushoShubetsu: string, data: CarePlanKaigiRegisterData) => {
      try {
        // 追加
        const res = await api.postCareplanOfficeServiceKindSeqRiyoushaSeqKaigiKeikakushoShubetsu(officeServiceKindSeq, riyoushaSeq, keikakushoShubetsu, data);
        showSuccessSnacbar(res);
        dispatch(kaigiStore.actions.clearKaigi());
      } catch (e) {
        handleApiError(e);
      }
    },
    [dispatch, handleApiError, showSuccessSnacbar]
  );
};

export default usePostKaigi;
