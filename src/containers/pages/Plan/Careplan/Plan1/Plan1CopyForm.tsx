import React from 'react';
import screenIDs from '@my/screenIDs';
import { RootState, useTypedSelector } from '@my/stores';
import { PlanKeikakushoKanri, PlanKyotakuServiceKeikakusho1, PlanKyotakuServiceKeikakusho1RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import usePostPlan1 from '@my/action-hooks/plan/careplan/plan1/usePostPlan1';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearPlan1 from '@my/action-hooks/plan/careplan/plan1/useClearPlan1';
import Plan1InputForm, { Plan1InputFormType } from './Plan1InputForm';

type Props = {
  id: string;
  isReadonly: boolean;
  screenKbn: string;
  riyoushaSeq: number;
};

const Plan1CopyForm: React.FC<Props> = (props: Props) => {
  const { id, isReadonly, screenKbn, riyoushaSeq } = props;

  const plan1Data = useTypedSelector((state: RootState) => state.plan1.planKyotakuServiceKeikakusho1);
  const postPlan1 = usePostPlan1(screenIDs.L1210_01.id);
  const clearCareplanHeader = useClearCareplanHeader();
  const clearPlan1 = useClearPlan1();

  // (引継ぎ追加用) 登録ボタン押下時
  const onSubmit = async (data: Plan1InputFormType) => {
    // eslint-disable-next-line no-console
    console.log('***** data -> ', data);

    const officeSeq = -1; // API側で設定するため、無視される
    const officeServiceKindSeq = -1; // API側で設定するため、無視される
    const keikakushoShubetsu = screenKbn; // API側で設定するため、無視される
    const keikakushoSeq = -1; // API側で設定するため、無視される
    const updateAt = new Date().getTime(); // API側で設定するため、無視される

    const planKeikakushoKanri = {
      // primary keys
      officeSeq,
      officeServiceKindSeq,
      keikakushoShubetsu,
      keikakushoSeq,
      riyoushaSeq,
      updateAt,
      // data
      isGenan: data.careplanHeaderGenan === 'true',
      isTeishutsu: data.careplanHeaderTeishutsu === '1',
      keikakuSakuseiDate: data.careplanHeaderSakuseiDate !== undefined ? data.careplanHeaderSakuseiDate.getTime() : new Date().getTime(),
      keikakuSakuseiStaffName: data.careplanHeaderSakuseiName,
      memo: data.careplanHeaderMemo,
      minaoshiDate: undefined,
      serviceTeikyouYearMonth: undefined,
    } as PlanKeikakushoKanri;

    let isShokaiSakuseiFlg = false;
    let isShoukaiSakuseiFlg = false;
    let isKeizokuSakuseiFlg = false;

    if (data.sakuseiKbn !== undefined) {
      if (data.sakuseiKbn.indexOf('0') !== -1) {
        isShokaiSakuseiFlg = true;
      }
      if (data.sakuseiKbn.indexOf('1') !== -1) {
        isShoukaiSakuseiFlg = true;
      }
      if (data.sakuseiKbn.indexOf('2') !== -1) {
        isKeizokuSakuseiFlg = true;
      }
    }
    const planKyotakuServiceKeikakusho1 = {
      // primary keys
      officeSeq,
      officeServiceKindSeq,
      keikakushoShubetsu,
      keikakushoSeq,
      riyoushaSeq,
      updateAt,
      // data
      isShokaiSakusei: isShokaiSakuseiFlg,
      isShoukaiSakusei: isShoukaiSakuseiFlg,
      isKeizokuSakusei: isKeizokuSakuseiFlg,
      ninteiKbn: data.ninteiKbn,
      keikakuSakuseiDate: data.keikakuSakuseiDate,
      firstSakuseiDate: data.firstSakuseiDate,
      ninteiDate: data.ninteiDate,
      ninteiStartDate: data.ninteiStartDate,
      ninteiEndDate: data.ninteiEndDate,
      youkaigoKbn: data.youkaigoKbn,
      seikatsuIkou: data.seikatsuIkou,
      ikenServiceKindShitei: data.ikenServiceKindShitei,
      enjoHoushin: data.enjoHoushin,
      saniteReasonType: data.saniteReasonType,
      saniteReasonSonota: data.saniteReasonSonota,
    } as PlanKyotakuServiceKeikakusho1;

    const registerData = {
      planKeikakushoKanri,
      planKyotakuServiceKeikakusho1,
    } as PlanKyotakuServiceKeikakusho1RegisterData;

    // 追加API
    await postPlan1(riyoushaSeq, registerData);
    // 更新後、state を全てクリアし、再読み込み
    clearCareplanHeader();
    clearPlan1();
  };

  // デフォルトバリュー
  const defaultValues: Plan1InputFormType = {};
  if (plan1Data?.isShokaiSakusei === true) {
    defaultValues.sakuseiKbn = ['0'];
  }
  if (plan1Data?.isShoukaiSakusei === true) {
    defaultValues.sakuseiKbn = ['1'];
  }
  if (plan1Data?.isKeizokuSakusei === true) {
    defaultValues.sakuseiKbn = ['2'];
  }
  defaultValues.ninteiKbn = plan1Data?.ninteiKbn;
  defaultValues.keikakuSakuseiDate = plan1Data?.keikakuSakuseiDate !== undefined ? new Date(plan1Data?.keikakuSakuseiDate) : undefined;
  defaultValues.firstSakuseiDate = plan1Data?.firstSakuseiDate !== undefined ? new Date(plan1Data?.firstSakuseiDate) : undefined;
  defaultValues.ninteiDate = plan1Data?.ninteiDate !== undefined ? new Date(plan1Data?.ninteiDate) : undefined;
  defaultValues.ninteiStartDate = plan1Data?.ninteiStartDate !== undefined ? new Date(plan1Data?.ninteiStartDate) : undefined;
  defaultValues.ninteiEndDate = plan1Data?.ninteiEndDate !== undefined ? new Date(plan1Data?.ninteiEndDate) : undefined;
  defaultValues.youkaigoKbn = plan1Data?.youkaigoKbn;
  defaultValues.seikatsuIkou = plan1Data?.seikatsuIkou;
  defaultValues.ikenServiceKindShitei = plan1Data?.ikenServiceKindShitei;
  defaultValues.enjoHoushin = plan1Data?.enjoHoushin;
  defaultValues.saniteReasonType = plan1Data?.saniteReasonType !== undefined ? [plan1Data?.saniteReasonType] : [];
  defaultValues.saniteReasonSonota = plan1Data?.saniteReasonSonota;

  // eslint-disable-next-line no-console
  console.log('Plan1CopyForm render');

  return <Plan1InputForm id={`${id}-add`} isReadonly={isReadonly} defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default Plan1CopyForm;
