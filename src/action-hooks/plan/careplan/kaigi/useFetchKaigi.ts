import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axios, { basePath } from '@my/axios';
import kaigiStore from '@my/stores/plan/careplan/kaigi/KaigiStore';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import { L124002CareplanKaigiUpdateApiFactory } from 'maps4nc-frontend-web-api';


const api = L124002CareplanKaigiUpdateApiFactory(undefined, basePath, axios);
console.log('api-object', api);




export const useFetchKaigi = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    async (officeServiceKindSeq: number, riyoushaSeq: number, keikakushoShubetsu: string, keikakushoSeq: number) => {
      try {
        dispatch(kaigiStore.actions.loading());
        const res = await api.getCareplanOfficeServiceKindSeqRiyoushaSeqKaigiKeikakushoShubetsuKeikakushoSeq(officeServiceKindSeq, riyoushaSeq, keikakushoShubetsu, keikakushoSeq);
        dispatch(kaigiStore.actions.fetchedPlanServiseTantoushaKaigi(res.data));
        console.log("res-obj: ", res);
        console.log("res.data: ", res.data);
      } catch (e) {
        handleApiError(e);
        dispatch(kaigiStore.actions.errored());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchKaigi;
