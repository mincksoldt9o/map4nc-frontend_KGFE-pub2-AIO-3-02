import React from 'react';
import { RootState, useTypedSelector } from '@my/stores';
import screenIDs from '@my/screenIDs';
import { PlanKeikakushoKanri, PlanKyotakuServiceKeikakusho1, PlanKyotakuServiceKeikakusho1RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearPlan1 from '@my/action-hooks/plan/careplan/plan1/useClearPlan1';
import usePostPlan1 from '@my/action-hooks/plan/careplan/plan1/usePostPlan1';
import Plan1InputForm, { Plan1InputFormType } from './Plan1InputForm';

type Props = {
  id: string;
  isReadonly: boolean;
  screenKbn: string;
  riyoushaSeq: number;
};

const Plan1AddForm: React.FC<Props> = (props: Props) => {
  const { id, isReadonly, screenKbn, riyoushaSeq } = props;

  const postPlan1 = usePostPlan1(screenIDs.L1210_01.id);
  const clearCareplanHeader = useClearCareplanHeader();
  const clearPlan1 = useClearPlan1();

  const riyoushaKihon = useTypedSelector((state: RootState) => state.plan1.riyoushaKihon);

  // (追加用) 登録ボタン押下時
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

  const defaultValues: Plan1InputFormType = {
    sakuseiKbn: ['0'],
    keikakuSakuseiDate: new Date(),
    ninteiDate: riyoushaKihon?.hiho?.ninteiDate !== undefined ? new Date(riyoushaKihon.hiho.ninteiDate) : undefined,
    ninteiStartDate: riyoushaKihon?.hiho?.ninteiStartDate !== undefined ? new Date(riyoushaKihon.hiho.ninteiStartDate) : undefined,
    ninteiEndDate: riyoushaKihon?.hiho?.ninteiEndDate !== undefined ? new Date(riyoushaKihon.hiho.ninteiEndDate) : undefined,
    youkaigoKbn: riyoushaKihon?.hiho?.youkaigoKbn,
  };

  // eslint-disable-next-line no-console
  console.log('Plan1AddForm render');

  return <Plan1InputForm id={`${id}-add`} isReadonly={isReadonly} defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default Plan1AddForm;
