import React from 'react';
import { useDispatch } from 'react-redux';
import useHandleApiError from '@my/action-hooks/useHandleApiError';
import weeklyPlanStore, { Riyousha } from '@my/stores/plan/careplan/weeklyplan';
import { Z9999YoukaigodoListApiFactory } from 'maps4nc-frontend-web-api';
import { LabelAndValue, YoukaigodoList, OfficeServiceKindListOfServiceList } from 'maps4nc-frontend-web-api/dist/lib/model';
import axios, { basePath } from '@my/axios';

const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));

const SAMPLE_SERVICE_KIND_KAIGO: Array<OfficeServiceKindListOfServiceList> = [
  { seidoType: '1', officeSeq: 1, value: '11', label: '訪問介護', serviceShubetu: '1' },
  { seidoType: '1', officeSeq: 1, value: '12', label: '訪問入浴介護', serviceShubetu: '1' },
  { seidoType: '1', officeSeq: 1, value: '13', label: '訪問看護', serviceShubetu: '1' },
  { seidoType: '1', officeSeq: 1, value: '14', label: '訪問リハビリテーション', serviceShubetu: '1' },
  { seidoType: '1', officeSeq: 1, value: '15', label: '通所介護', serviceShubetu: '1' },
  { seidoType: '1', officeSeq: 1, value: '16', label: '通所リハビリテーション', serviceShubetu: '1' },
  { seidoType: '1', officeSeq: 1, value: '31', label: '居宅療養管理指導', serviceShubetu: '1' },
  { seidoType: '1', officeSeq: 1, value: '71', label: '夜間対応型訪問介護', serviceShubetu: '3' },
  { seidoType: '1', officeSeq: 1, value: '72', label: '認知症対応型通所介護', serviceShubetu: '3' },
  { seidoType: '1', officeSeq: 1, value: '73', label: '小規模多機能型居宅介護', serviceShubetu: '3' },
  { seidoType: '1', officeSeq: 1, value: '76', label: '定期巡回・随時対応型訪問介護看護', serviceShubetu: '3' },
  { seidoType: '1', officeSeq: 1, value: '77', label: '複合型サービス（看護小規模多機能）', serviceShubetu: '3' },
  { seidoType: '1', officeSeq: 1, value: '78', label: '地域密着型通所介護', serviceShubetu: '3' },
];

const SAMPLE_SERVICE_KIND_YOBOU: Array<OfficeServiceKindListOfServiceList> = [
  { seidoType: '1', officeSeq: 1, value: '62', label: '介護予防訪問入浴介護', serviceShubetu: '2' },
  { seidoType: '1', officeSeq: 1, value: '63', label: '介護予防訪問看護', serviceShubetu: '2' },
  { seidoType: '1', officeSeq: 1, value: '64', label: '介護予防訪問リハビリテーション', serviceShubetu: '2' },
  { seidoType: '1', officeSeq: 1, value: '66', label: '介護予防通所リハビリテーション', serviceShubetu: '2' },
  { seidoType: '1', officeSeq: 1, value: '34', label: '介護予防居宅療養管理指導', serviceShubetu: '2' },
  { seidoType: '1', officeSeq: 1, value: '74', label: '介護予防認知症対応型通所介護', serviceShubetu: '4' },
  { seidoType: '1', officeSeq: 1, value: '75', label: '介護予防小規模多機能型居宅介護', serviceShubetu: '4' },
  { seidoType: '1', officeSeq: 1, value: 'A2', label: '訪問型サービス（独自）', serviceShubetu: '5' },
  { seidoType: '1', officeSeq: 1, value: 'A3', label: '訪問型サービス（独自／定率）', serviceShubetu: '5' },
  { seidoType: '1', officeSeq: 1, value: 'A4', label: '訪問型サービス（独自／定額）', serviceShubetu: '5' },
  { seidoType: '1', officeSeq: 1, value: 'A6', label: '通所型サービス（独自）', serviceShubetu: '5' },
  { seidoType: '1', officeSeq: 1, value: 'A7', label: '通所型サービス（独自／定率）', serviceShubetu: '5' },
  { seidoType: '1', officeSeq: 1, value: 'A8', label: '通所型サービス（独自／定額）', serviceShubetu: '5' },
];

const z9999YoukaigodoListApi = Z9999YoukaigodoListApiFactory(undefined, basePath, axios);

const useChangeCreateDate = (screenID: string, keikakushoStatus: number, riyoushaSeq: number) => {
  const dispatch = useDispatch();
  const handleApiError = useHandleApiError(screenID, true);

  return React.useCallback(
    async (params: { createDate: number | null }) => {
      try {
        const { createDate } = params;

        await sleep(500); // API呼び出してる感用（削除すること）

        // 利用者情報は共通の構造だが、モックで実装がないので一旦ここで画面に必要なものをそれっぽく持ったものを作成している
        const riyousha: Riyousha =
          riyoushaSeq === 1
            ? {
                riyoushaSeq: 1,
                youkaigodo: { value: '1', label: '要介護度1' },
                futanwariai: { value: '80', label: '2割' },
              }
            : {
                riyoushaSeq: 2,
                youkaigodo: { value: '3', label: '要介護度3' },
                futanwariai: { value: '90', label: '1割' },
              };

        // サービス種類の取得
        const serviceKindList = keikakushoStatus === 1 ? SAMPLE_SERVICE_KIND_KAIGO : SAMPLE_SERVICE_KIND_YOBOU;

        // 要介護度リストの取得
        const youkaigodoListRes = await z9999YoukaigodoListApi.getCommonYoukaigodoList(createDate === null ? undefined : createDate);
        const youkaigodoData = youkaigodoListRes.data || [];
        const youkaigodoList: Array<LabelAndValue> = youkaigodoData.map<LabelAndValue>((v: YoukaigodoList) => ({ label: v.youkaigodoName, value: v.youkaigodoCode.substr(0, 1) }));

        dispatch(weeklyPlanStore.actions.createDateChanged({ riyousha, serviceKindList, youkaigodoList }));
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

export default useChangeCreateDate;
