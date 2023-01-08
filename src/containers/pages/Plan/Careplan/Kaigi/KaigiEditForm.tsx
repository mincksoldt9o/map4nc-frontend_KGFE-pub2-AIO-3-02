import useFetchKaigi from '@my/action-hooks/plan/careplan/kaigi/useFetchKaigi';
import { RootState, useTypedSelector } from '@my/stores';
import screenIDs from '@my/screenIDs';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import React from 'react';

// import { PlanKeikakushoKanri, PlanKyotakuServiceKeikakusho1, PlanKyotakuServiceKeikakusho1RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import { PlanKeikakushoKanri, PlanServiseTantoushaKaigi, CarePlanKaigiUpdateData } from 'maps4nc-frontend-web-api/dist/lib/model';

import usePutKaigi from '@my/action-hooks/plan/careplan/kaigi/usePutKaigi';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearKaigi from '@my/action-hooks/plan/careplan/kaigi/useClearKaigi';
import { Container } from '@material-ui/core';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel';
import KaigiInputForm, { KaigiInputFormType } from './KaigiInputForm';

type Props = {
  id: string;
  isReadonly: boolean;
  screenKbn: string;
  riyoushaSeq: number;
};

const KaigiEditForm: React.FC<Props> = (props: Props) => {
  const { id, screenKbn, riyoushaSeq, isReadonly } = props;

  const fetchKaigi = useFetchKaigi(screenIDs.L1240_01.id); // GET 
  const putKaigi = usePutKaigi(screenIDs.L1240_01.id); // UPDATE = GET + PUT

  const clearCareplanHeader = useClearCareplanHeader();
  const clearKaigi = useClearKaigi();

  // const kaigiData = useTypedSelector((state: RootState) => state.kaigi.planKyotakuServiceKeikakusho1);
  // const kaigiData = useTypedSelector((state: RootState) => state.kaigi.planServiseTantoushaKaigi);
  // debug: state.kaigi.* 
  // kaigi: {
  //   planServiseTantoushaKaigi: {
  //     officeSeq: 1,
  //     officeServiceKindSeq: 1,
  //     riyoushaSeq: 1,
  //     keikakushoShubetsu: 'keikakushoShubetsu',
  //     keikakushoSeq: 1,
  //     kaisaiDate: 1670544000000,
  //     kaisaiBasho: 'kaisaiBasho',
  //     kaisaiJikan: 'kaisaiJikan',
  //     kaisaiKaisuu: 1,
  //     shozoku1: 'shozoku1',
  //     name1: 'name1',
  //     shozoku2: 'shozoku2',
  //     name2: 'name2',
  //     shozoku3: 'shozoku3',
  //     name3: 'name3',
  //     shozoku4: 'shozoku4',
  //     name4: 'name4',
  //     shozoku5: 'shozoku5',
  //     name5: 'name5',
  //     shozoku6: 'shozoku6',
  //     name6: 'name6',
  //     shozoku7: 'shozoku7',
  //     name7: 'name7',
  //     shozoku8: 'shozoku8',
  //     name8: 'name8',
  //     shozoku9: 'shozoku9',
  //     name9: 'name9',
  //     shussekiHonnin: 'shussekiHonnin',
  //     shussekiKazoku: 'shussekiKazoku',
  //     shussekiTsuzukigara: 'shussekiTsuzukigara',
  //     shussekiBikou: 'shussekiBikou',
  //     kentouKoumoku: 'kentouKoumoku',
  //     kentouNaiyou: 'kentouNaiyou',
  //     ketsuron: 'ketsuron',
  //     kadai: 'kadai',
  //     updateAt: 1672877180172
  //   },
  //   youkaigodoList: [],
  //   loadingStatus: 'Loaded',
  //   loadingRiyoushaKihonStatus: 'NotLoad',
  //   loadingYoukaigodoListStatus: 'NotLoad',
  //   isDirty: false
  // }

  //

//   PUT - request-body : CarePlanKaigiUpdateData = object(planKeikakushoKanri, planServiceTantoushaKaigi)

// PUT - response-body: PlanSeriseTantousshaKaigiKey

  const riyoushaKihon = useTypedSelector((state: RootState) => state.kaigi.riyoushaKihon);

  const kaigiData = useTypedSelector((state: RootState) => state.kaigi.planServiseTantoushaKaigi);
  
  console.log('kaigiData form KaigiEditForm: ', kaigiData);

  const loadingStatus = useTypedSelector((state: RootState) => state.kaigi.loadingStatus);

  // debug
  const selectedPlanKeikakushoKanri = useTypedSelector((state: RootState) => state.careplanHeader.selectedPlanKeikakushoKanri);
  console.log('selectedPlanKeikakushoKanri: ', selectedPlanKeikakushoKanri);
  console.log(
    'RootState-careplanHeader: ',
    useTypedSelector((state: RootState) => state.careplanHeader)
  );

  const notLoaded = loadingStatus !== 'Loaded';

  // 居宅サービス計画書(1)取得
  React.useEffect(
    UseEffectAsync.make(async () => {
      if (notLoaded) {
        // console.log('居宅サービス計画書(1)取得');
        //        await fetchKaigi(selectedPlanKeikakushoKanri?.info?.officeServiceKindSeq || 0, riyoushaSeq, selectedPlanKeikakushoKanri?.info?.keikakushoSeq || 0);
        await fetchKaigi(
          selectedPlanKeikakushoKanri?.info?.officeServiceKindSeq || 0,
          selectedPlanKeikakushoKanri?.info?.riyoushaSeq || 0,
          selectedPlanKeikakushoKanri?.info?.keikakushoShubetsu || '',
          selectedPlanKeikakushoKanri?.info?.keikakushoSeq || 0
        );
      }
    }),
    [fetchKaigi, selectedPlanKeikakushoKanri, riyoushaSeq, notLoaded]
  );

  // debug onSubmit simple function
  // const onSubmit = async (data: KaigiInputFormType) => {
  //     // eslint-disable-next-line no-console
  //     console.log('onSubmit called');
  //     console.log('data on KaigiEditForm -> ', data);

  //   // eslint-disable-next-line no-console
  //   console.log('KaigiEditForm render 01');
  //   console.log('onSubmit called after render 01');
  // }

  // (編集用) 登録ボタン押下時
  const onSubmit = async (data: KaigiInputFormType) => {
    // eslint-disable-next-line no-console
    console.log('data on KaigiEditForm -> ', data);

    const officeSeq = selectedPlanKeikakushoKanri?.info?.officeSeq || -1; // API側で設定するため、無視される
    const officeServiceKindSeq = selectedPlanKeikakushoKanri?.info?.officeServiceKindSeq || -1;
    const keikakushoShubetsu = screenKbn; // API側で設定するため、無視される
    const keikakushoSeq = selectedPlanKeikakushoKanri?.info?.keikakushoSeq || -1;
    const updateAt = new Date().getTime(); // API側で設定するため、無視される

    //PUT - request-body : CarePlanKaigiUpdateData = object(planKeikakushoKanri, planServiceTantoushaKaigi)
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

    //// process: conditional to set flags
    // if (data.sakuseiKbn !== undefined) {
    //   if (data.sakuseiKbn.indexOf('0') !== -1) {
    //     isShokaiSakuseiFlg = true;
    //   }
    //   if (data.sakuseiKbn.indexOf('1') !== -1) {
    //     isShoukaiSakuseiFlg = true;
    //   }
    //   if (data.sakuseiKbn.indexOf('2') !== -1) {
    //     isKeizokuSakuseiFlg = true;
    //   }
    // }
    
    //PUT - request-body : CarePlanKaigiUpdateData = object(planKeikakushoKanri, planServiceTantoushaKaigi)
    // PlanServiseTantoushaKaigi object
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
      // updator props 
      updateAt: data.updateAt,
    } as PlanServiseTantoushaKaigi;

    const registerData = {
      planKeikakushoKanri,
      planServiseTantoushaKaigi,
    } as CarePlanKaigiUpdateData;


  //// debug:   curl --request PUT \
  //   --url http://localhost:3000/api/careplan/2/3/kaigi/%27abc%27/1 \
  //   --header 'Content-Type: application/json' \
  //   --data '{
  //   "planKeikakushoKanri": {
  //     "updateAt": 0,
  //     "keikakuSakuseiDate": 0,
  //     "keikakuSakuseiStaffName": "string",
  //     "serviceTeikyouYearMonth": 0,
  //     "memo": "string",
  //     "isGenan": true,
  //     "isTeishutsu": true,
  //     "minaoshiDate": 0,
  //     "officeSeq": -2147483648,
  //     "officeServiceKindSeq": -2147483648,
  //     "riyoushaSeq": -2147483648,
  //     "keikakushoShubetsu": "string",
  //     "keikakushoSeq": -2147483648
  //   },
  //   "planServiseTantoushaKaigi": {
  //     "officeSeq": 0,
  //     "officeServiceKindSeq": 0,
  //     "riyoushaSeq": 0,
  //     "keikakushoShubetsu": "string",
  //     "keikakushoSeq": 0,
  //     "kaisaiDate": 0,
  //     "kaisaiBasho": "string",
  //     "kaisaiJikan": "string",
  //     "kaisaiKaisuu": 0,
  //     "shozoku1": "string",
  //     "name1": "string",
  //     "shozoku2": "string",
  //     "name2": "string",
  //     "shozoku3": "string",
  //     "name3": "string",
  //     "shozoku4": "string",
  //     "name4": "string",
  //     "shozoku5": "string",
  //     "name5": "string",
  //     "shozoku6": "string",
  //     "name6": "string",
  //     "shozoku7": "string",
  //     "name7": "string",
  //     "shozoku8": "string",
  //     "name8": "string",
  //     "shozoku9": "string",
  //     "name9": "string",
  //     "shussekiHonnin": "string",
  //     "shussekiKazoku": "string",
  //     "shussekiTsuzukigara": "string",
  //     "shussekiBikou": "string",
  //     "kentouKoumoku": "string",
  //     "kentouNaiyou": "string",
  //     "ketsuron": "string",
  //     "kadai": "string",
  //     "updateAt": 0
  //   }
  // }'

//// debug: //params
// // keikakushoSeq
// // integer
// // <int32>
// // required
// // 計画書SEQ

// // keikakushoShubetsu
// // string
// // required
// // 計画書種別

// // officeServiceKindSeq
// // integer
// // <int32>
// // required
// // 施設・事業所サービス種類別SEQ

// // riyoushaSeq
// // integer
// // <int32>
// // required
// // 利用者SEQ


    
    // await putKaigi(officeServiceKindSeq, riyoushaSeq, keikakushoShubetsu, keikakushoSeq, registerData);
    await putKaigi(officeServiceKindSeq, riyoushaSeq, keikakushoShubetsu, keikakushoSeq, registerData);
    
    clearCareplanHeader();
    clearKaigi();
  };


  //kaigiData form KaigiEditForm
// {
//   "officeSeq": 1,
//   "officeServiceKindSeq": 1,
//   "riyoushaSeq": 1,
//   "keikakushoShubetsu": "keikakushoShubetsu",
//   "keikakushoSeq": 1,

//   "kaisaiDate": 1670544000000,
//   "kaisaiBasho": "kaisaiBasho",
//   "kaisaiJikan": "kaisaiJikan",
//   "kaisaiKaisuu": 1,

//   "shozoku1": "shozoku1",
//   "name1": "name1",
//   "shozoku2": "shozoku2",
//   "name2": "name2",
//   "shozoku3": "shozoku3",
//   "name3": "name3",
//   "shozoku4": "shozoku4",
//   "name4": "name4",
//   "shozoku5": "shozoku5",
//   "name5": "name5",
//   "shozoku6": "shozoku6",
//   "name6": "name6",
//   "shozoku7": "shozoku7",
//   "name7": "name7",
//   "shozoku8": "shozoku8",
//   "name8": "name8",
//   "shozoku9": "shozoku9",
//   "name9": "name9",

//   "shussekiHonnin": "shussekiHonnin",
//   "shussekiKazoku": "shussekiKazoku",
//   "shussekiTsuzukigara": "shussekiTsuzukigara",
//   "shussekiBikou": "shussekiBikou",
//   "kentouKoumoku": "kentouKoumoku",
//   "kentouNaiyou": "kentouNaiyou",
//   "ketsuron": "ketsuron",
//   "kadai": "kadai",

//   "updateAt": 1672877180172
// }

  const defaultValues: KaigiInputFormType = {
    kaisaiDate: kaigiData?.kaisaiDate !== undefined ? new Date(kaigiData.kaisaiDate) : undefined,
    // kaisaiDate: kaigiData?.kaisaiDate,
    kaisaiBasho: kaigiData?.kaisaiBasho,
    // kaisaiJikan: kaigiData?.kaisaiJikan,
    kaisaiJikan: kaigiData?.kaisaiJikan !== undefined ? new Date(kaigiData.kaisaiJikan) : undefined,
    kaisaiKaisuu: kaigiData?.kaisaiKaisuu,
    // minaoshiDate: kaigiData?.minaoshiDate !== undefined ? new Date(kaigiData.minaoshiDate) : undefined,
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

  if (loadingStatus === 'Error') {
    return (
      <Container maxWidth={false}>
        <GlobalMessagePanel screenID={screenIDs.L1240_01.id} />
      </Container>
    );
  }
  if (loadingStatus !== 'Loaded') {
    return <Container maxWidth={false}>Now Loading...</Container>;
  }

  // eslint-disable-next-line no-console
  console.log('KaigiEditForm render 01');

  return <KaigiInputForm id={`${id}-edit`} isReadonly={isReadonly} defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default KaigiEditForm;
