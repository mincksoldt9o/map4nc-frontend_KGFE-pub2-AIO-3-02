import React from 'react';
import { useDispatch } from 'react-redux';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import weeklyPlanStore, { EditWeeklyServicePlan, ServiceKindColor, ServiceKindColorMap, WeeklyServicePlanService } from '@my/stores/plan/careplan/weeklyplan';
import axios, { basePath } from '@my/axios';

import { Z9999GetConstListApiFactory } from 'maps4nc-frontend-web-api';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import { EventType, Weeks } from '@my/components/organisms/WeekCalendarTimeGrid';
import DateUtils from '@my/utils/DateUtils';

const z9999GetConstListApi = Z9999GetConstListApiFactory(undefined, basePath, axios);

export const SAMPLE_COLOR_MAP: ServiceKindColorMap = {
  // 訪問介護
  c11: { backgroundColor: '#00FF00', color: '#000000' },
  // (予防)訪問入浴介護
  c12: { backgroundColor: '#808000', color: '#ffffff' },
  c62: { backgroundColor: '#808000', color: '#ffffff' },
  // (予防)訪問看護
  c13: { backgroundColor: '#FF0000', color: '#ffffff' },
  c63: { backgroundColor: '#FF0000', color: '#ffffff' },
  // (予防)訪問リハビリテーション
  c14: { backgroundColor: '#6495ED', color: '#000000' },
  c64: { backgroundColor: '#6495ED', color: '#000000' },
  // 通所介護、地域密着型通所介護
  c15: { backgroundColor: '#DAA520', color: '#000000' },
  c78: { backgroundColor: '#DAA520', color: '#000000' },
  // (予防)通所リハビリテーション
  c16: { backgroundColor: '#0000FF', color: '#ffffff' },
  c66: { backgroundColor: '#0000FF', color: '#ffffff' },
  // (予防)居宅療養管理指導
  c31: { backgroundColor: '#FFFF00', color: '#000000' },
  c34: { backgroundColor: '#FFFF00', color: '#000000' },
  // 夜間対応型訪問介護
  c71: { backgroundColor: '#008000', color: '#ffffff' },
  // (予防)認知症対応型通所介護
  c72: { backgroundColor: '#808080', color: '#ffffff' },
  c74: { backgroundColor: '#808080', color: '#ffffff' },
  // (予防)小規模多機能型居宅介護
  c73: { backgroundColor: '#800080', color: '#ffffff' },
  c75: { backgroundColor: '#800080', color: '#ffffff' },
  // 定期巡回・随時対応型訪問介護看護
  c76: { backgroundColor: '#98FB98', color: '#000000' },
  // 複合型サービス
  c77: { backgroundColor: '#800000', color: '#ffffff' },
  // 総合事業訪問型サービス
  cA2: { backgroundColor: '#00FF00', color: '#000000' },
  cA3: { backgroundColor: '#00FF00', color: '#000000' },
  cA4: { backgroundColor: '#00FF00', color: '#000000' },
  // 総合事業通所型サービス
  cA6: { backgroundColor: '#DAA520', color: '#000000' },
  cA7: { backgroundColor: '#DAA520', color: '#000000' },
  cA8: { backgroundColor: '#DAA520', color: '#000000' },
  // 総合事業その他サービス
  cCodeFumei: { backgroundColor: '#00FFFF', color: '#000000' },
};

const HOKENGAI_COLOR: ServiceKindColor = { backgroundColor: '#FFFFFF', color: '#000000' };

const SAMPLE_EVENTS: Array<EventType<WeeklyServicePlanService>> = [
  {
    id: 1,
    start: '10:00',
    end: '12:30',
    weeks: [Weeks.WED],
    title: 'sample',
    title4tp: 'sample',
    backgroundColor: HOKENGAI_COLOR.backgroundColor,
    color: HOKENGAI_COLOR.color,
    data: {
      serviceNaiyouSeq: 1,
      hokenServiceKbn: '2',
      teikyouWeeks: [Weeks.WED],
      teikyouStartTime: 36000,
      teikyouEndTime: 45000,
      displayName: 'sample',
    },
  },
];

const SAMPLE_PLAN: EditWeeklyServicePlan = {
  katsudou5: 'xxxxx',
  sonotaService: 'その他の内容',
  tekiyouStart: DateUtils.nowYearMonth().getTime(),
  fontSize: { label: '10', value: '10' },
  serviceList: SAMPLE_EVENTS,
};

const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));

const useFetchWeeklyPlan = (screenID: string, keikakushoStatus: number, riyoushaSeq: number) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID, true);

  return React.useCallback(
    async (params: { selectedHistorySeq?: number; mode: 'add' | 'edit' }) => {
      const { selectedHistorySeq, mode } = params;

      try {
        dispatch(weeklyPlanStore.actions.loading());

        await sleep(500); // API呼び出してる感用（削除すること）

        // サービス種類色取得
        const colorMap: ServiceKindColorMap = SAMPLE_COLOR_MAP;

        // 負担割合リスト取得
        const futanwariaiRes = await z9999GetConstListApi.getCommonGetConstListConstName('futanwariai');
        const futanwariaiList: Array<LabelAndValue> = futanwariaiRes.data || [];

        // 週間サービス計画/介護予防週間支援計画表 の取得
        let weeklyServicePlan: EditWeeklyServicePlan | undefined;
        if (mode !== 'add' || selectedHistorySeq !== undefined) {
          weeklyServicePlan = SAMPLE_PLAN;
        }

        dispatch(weeklyPlanStore.actions.fetchedWeeklyPlan({ colorMap, futanwariaiList, weeklyServicePlan }));
      } catch (e) {
        dispatch(weeklyPlanStore.actions.errored());
        handleApiError(e);
      }
    },
    // FIXME: サンプルとして作っているため使っていないものがある
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, handleApiError, keikakushoStatus, riyoushaSeq]
  );
};

export default useFetchWeeklyPlan;
