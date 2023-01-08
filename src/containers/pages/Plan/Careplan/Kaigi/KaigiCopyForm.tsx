import React from 'react';
import screenIDs from '@my/screenIDs';
import { RootState, useTypedSelector } from '@my/stores';
import { PlanKeikakushoKanri, PlanKyotakuServiceKeikakusho1, PlanKyotakuServiceKeikakusho1RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import usePostKaigi from '@my/action-hooks/plan/careplan/kaigi/usePostKaigi';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearKaigi from '@my/action-hooks/plan/careplan/kaigi/useClearKaigi';
import KaigiInputForm, { KaigiInputFormType } from './KaigiInputForm';

type Props = {
  id: string;
  isReadonly: boolean;
  screenKbn: string;
  riyoushaSeq: number;
};

const KaigiCopyForm: React.FC<Props> = (props: Props) => {
  const { id, isReadonly, screenKbn, riyoushaSeq } = props;

  const kaigiData = useTypedSelector((state: RootState) => state.kaigi.planKyotakuServiceKeikakusho1);
  const postKaigi = usePostKaigi(screenIDs.L1240_01.id);
  const clearCareplanHeader = useClearCareplanHeader();
  const clearKaigi = useClearKaigi();

  // (引継ぎ追加用) 登録ボタン押下時
  const onSubmit = async (data: KaigiInputFormType) => {
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
    await postKaigi(riyoushaSeq, registerData);
    // 更新後、state を全てクリアし、再読み込み
    clearCareplanHeader();
    clearKaigi();
  };

  // デフォルトバリュー
  const defaultValues: KaigiInputFormType = {};
  if (kaigiData?.isShokaiSakusei === true) {
    defaultValues.sakuseiKbn = ['0'];
  }
  if (kaigiData?.isShoukaiSakusei === true) {
    defaultValues.sakuseiKbn = ['1'];
  }
  if (kaigiData?.isKeizokuSakusei === true) {
    defaultValues.sakuseiKbn = ['2'];
  }
  defaultValues.ninteiKbn = kaigiData?.ninteiKbn;
  defaultValues.keikakuSakuseiDate = kaigiData?.keikakuSakuseiDate !== undefined ? new Date(kaigiData?.keikakuSakuseiDate) : undefined;
  defaultValues.firstSakuseiDate = kaigiData?.firstSakuseiDate !== undefined ? new Date(kaigiData?.firstSakuseiDate) : undefined;
  defaultValues.ninteiDate = kaigiData?.ninteiDate !== undefined ? new Date(kaigiData?.ninteiDate) : undefined;
  defaultValues.ninteiStartDate = kaigiData?.ninteiStartDate !== undefined ? new Date(kaigiData?.ninteiStartDate) : undefined;
  defaultValues.ninteiEndDate = kaigiData?.ninteiEndDate !== undefined ? new Date(kaigiData?.ninteiEndDate) : undefined;
  defaultValues.youkaigoKbn = kaigiData?.youkaigoKbn;
  defaultValues.seikatsuIkou = kaigiData?.seikatsuIkou;
  defaultValues.ikenServiceKindShitei = kaigiData?.ikenServiceKindShitei;
  defaultValues.enjoHoushin = kaigiData?.enjoHoushin;
  defaultValues.saniteReasonType = kaigiData?.saniteReasonType !== undefined ? [kaigiData?.saniteReasonType] : [];
  defaultValues.saniteReasonSonota = kaigiData?.saniteReasonSonota;

  // eslint-disable-next-line no-console
  console.log('KaigiCopyForm render');

  return <KaigiInputForm id={`${id}-add`} isReadonly={isReadonly} defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default KaigiCopyForm;
