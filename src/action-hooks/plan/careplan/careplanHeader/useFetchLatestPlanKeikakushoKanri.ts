import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
// import axios, { basePath } from '@my/axios';
import careplanHeaderStore from '@my/stores/plan/careplan/careplanHeader/CareplanHeaderStore';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
// import { Z999956PlanHistoryApiFactory } from 'maps4nc-frontend-web-api';
import { PlanKeikakushoKanri } from 'maps4nc-frontend-web-api/dist/lib/model';

// const api = Z999956PlanHistoryApiFactory(undefined, basePath, axios);

export const useFetchLatestPlanKeikakushoKanri = (screenID: string) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID);

  return useCallback(
    (riyoushaSeq: number, screenKbn: string) => {
      try {
        dispatch(careplanHeaderStore.actions.loadingLatestPlanKeikakushoKanri());

        // TODO: (正式なAPIを呼ぶ想定) 最新帳票履歴取得
        // const res = await api.getLatestPlanHistory(screenKbn, riyoushaSeq);

        // TODO: (後で消す) API決定まで仮のデータセット
        const testData: PlanKeikakushoKanri = {
          // primary keys
          officeSeq: 1,
          officeServiceKindSeq: 1,
          riyoushaSeq,
          keikakushoShubetsu: screenKbn,
          keikakushoSeq: 2,
          updateAt: new Date('2022-12-10 12:13:14').getTime(),
          // data
          keikakuSakuseiDate: new Date('2022-12-10').getTime(),
          keikakuSakuseiStaffName: '田中 次郎',
          serviceTeikyouYearMonth: new Date('2022-12').getTime(),
          memo: 'featched memo data',
          isGenan: true,
          isTeishutsu: true,
          minaoshiDate: new Date('2022-12-19').getTime(),
        };
        const res = {
          data: {
            latestInfo: testData,
            latestCount: 3,
          },
        };
        // TODO: (後で消す) データが無かった場合のデータセット
        /*
        const res = {
          data: {
            latestInfo: undefined,
            latestCount: 0,
          },
        };
        */
        // 最新帳票履歴を保存
        dispatch(careplanHeaderStore.actions.fetchedLatestPlanKeikakushoKanri(res.data));
      } catch (e) {
        handleApiError(e);
        dispatch(careplanHeaderStore.actions.erroredLodingLatestPlanKeikakushoKanri());
      }
    },
    [dispatch, handleApiError]
  );
};

export default useFetchLatestPlanKeikakushoKanri;
