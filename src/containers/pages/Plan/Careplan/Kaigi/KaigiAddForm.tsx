import React from 'react';
import { RootState, useTypedSelector } from '@my/stores';
import screenIDs from '@my/screenIDs';
import { CarePlanKaigiRegisterData, PlanKeikakushoKanri, PlanServiseTantoushaKaigi } from 'maps4nc-frontend-web-api/dist/lib/model';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearKaigi from '@my/action-hooks/plan/careplan/kaigi/useClearKaigi';
import usePostKaigi from '@my/action-hooks/plan/careplan/kaigi/usePostKaigi';
import KaigiInputForm, { KaigiInputFormType } from './KaigiInputForm';

type Props = {
  id: string;
  isReadonly: boolean;
  screenKbn: string;
  riyoushaSeq: number;
};

const KaigiAddForm: React.FC<Props> = (props: Props) => {
  const { id, isReadonly, screenKbn, riyoushaSeq } = props;

  const postKaigi = usePostKaigi(screenIDs.L1240_01.id);
  const clearCareplanHeader = useClearCareplanHeader();
  const clearKaigi = useClearKaigi();

  const riyoushaKihon = useTypedSelector((state: RootState) => state.kaigi.riyoushaKihon);
  
  const kaigiData = useTypedSelector((state: RootState) => state.kaigi.planServiseTantoushaKaigi);
  console.log('kaigiData form KaigiAddForm: ', kaigiData);

  // (追加用) 登録ボタン押下時
  const onSubmit = async (data: KaigiInputFormType) => {
    // eslint-disable-next-line no-console
    console.log('***** data -> ', data);

    const officeSeq = -1; // Ignored because it is set on the API side
    const officeServiceKindSeq = -1; // Ignored because it is set on the API side
    const keikakushoShubetsu = screenKbn; // Ignored because it is set on the API side
    const keikakushoSeq = -1; // Ignored because it is set on the API side
    const updateAt = new Date().getTime(); // Ignored because it is set on the API side


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
    const planServiseTantoushaKaigi = {
      // primary keys
      officeSeq,
      officeServiceKindSeq,
      riyoushaSeq,
      keikakushoShubetsu,
      keikakushoSeq,
      // data fields
      kaisaiDate: data.kaisaiDate,
      kaisaiBasho: data.kaisaiBasho,
      kaisaiJikan: data.kaisaiJikan,
      kaisaiKaisuu: data.kaisaiKaisuu,
      name1: data.name1,
      name2: data.name2,
      name3: data.name3,
      name4: data.name4,
      name5: data.name5,
      name6: data.name6,
      name7: data.name7,
      name8: data.name8,
      name9: data.name9,
      shozoku1: data.shozoku1,
      shozoku2: data.shozoku2,
      shozoku3: data.shozoku3,
      shozoku4: data.shozoku4,
      shozoku5: data.shozoku5,
      shozoku6: data.shozoku6,
      shozoku7: data.shozoku7,
      shozoku8: data.shozoku8,
      shozoku9: data.shozoku9,
      shussekiHonnin: data.shussekiHonnin,
      shussekiKazoku: data.shussekiKazoku,
      shussekiTsuzukigara: data.shussekiTsuzukigara,
      shussekiBikou: data.shussekiBikou,
      kentouKoumoku: data.kentouKoumoku,
      kentouNaiyou: data.kentouNaiyou,
      ketsuron: data.ketsuron,
      kadai: data.kadai,
      updateAt: data.updateAt,
    } as PlanServiseTantoushaKaigi;

    const registerData = {
      planKeikakushoKanri,
      planServiseTantoushaKaigi,
    } as CarePlanKaigiRegisterData;

    // 追加API
    await postKaigi(officeServiceKindSeq, riyoushaSeq, keikakushoShubetsu, registerData);
    // 更新後、state を全てクリアし、再読み込み
    clearCareplanHeader();
    clearKaigi();
  };

  // const defaultValues: KaigiInputFormType = {
  //   sakuseiKbn: ['0'],
  //   keikakuSakuseiDate: new Date(),
  //   ninteiDate: riyoushaKihon?.hiho?.ninteiDate !== undefined ? new Date(riyoushaKihon.hiho.ninteiDate) : undefined,
  //   ninteiStartDate: riyoushaKihon?.hiho?.ninteiStartDate !== undefined ? new Date(riyoushaKihon.hiho.ninteiStartDate) : undefined,
  //   ninteiEndDate: riyoushaKihon?.hiho?.ninteiEndDate !== undefined ? new Date(riyoushaKihon.hiho.ninteiEndDate) : undefined,
  //   youkaigoKbn: riyoushaKihon?.hiho?.youkaigoKbn,
  // };

  const defaultValues: KaigiInputFormType = {
    kaisaiDate: kaigiData?.kaisaiDate !== undefined ? new Date(kaigiData.kaisaiDate) : undefined,
    // kaisaiDate: kaigiData?.kaisaiDate,
    kaisaiBasho: kaigiData?.kaisaiBasho,
    // kaisaiJikan: kaigiData?.kaisaiJikan,
    kaisaiJikan: kaigiData?.kaisaiJikan !== undefined ? new Date(kaigiData.kaisaiJikan) : undefined,
    kaisaiKaisuu: kaigiData?.kaisaiKaisuu,
    // minaoshiAlert: undefined, // BE API-missing this field
    shozoku1: kaigiData?.shozoku1,
    name1: kaigiData?.name1,
    shozoku2: kaigiData?.shozoku2,
    name2: kaigiData?.name2,
    shozoku3: kaigiData?.shozoku3,
    name3: kaigiData?.name3,
    shozoku4: kaigiData?.shozoku4,
    name4: kaigiData?.name4,
    shozoku5: kaigiData?.shozoku5,
    name5: kaigiData?.name5,
    shozoku6: kaigiData?.shozoku6,
    name6: kaigiData?.name6,
    shozoku7: kaigiData?.shozoku7,
    name7: kaigiData?.name7,
    shozoku8: kaigiData?.shozoku8,
    name8: kaigiData?.name8,
    shozoku9: kaigiData?.shozoku9,
    name9: kaigiData?.name9,
    shussekiHonnin: kaigiData?.shussekiHonnin,
    shussekiKazoku: kaigiData?.shussekiKazoku,
    shussekiTsuzukigara: kaigiData?.shussekiTsuzukigara,
    shussekiBikou: kaigiData?.shussekiBikou,
    kentouKoumoku: kaigiData?.kentouKoumoku,
    kentouNaiyou: kaigiData?.kentouNaiyou,
    ketsuron: kaigiData?.ketsuron,
    kadai: kaigiData?.kadai,
  };



  // eslint-disable-next-line no-console
  console.log('KaigiAddForm render');

  return <KaigiInputForm id={`${id}-add`} isReadonly={isReadonly} defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default KaigiAddForm;
