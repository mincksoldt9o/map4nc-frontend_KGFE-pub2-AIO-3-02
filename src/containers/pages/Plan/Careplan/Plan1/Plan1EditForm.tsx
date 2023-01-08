import useFetchPlan1 from '@my/action-hooks/plan/careplan/plan1/useFetchPlan1';
import { RootState, useTypedSelector } from '@my/stores';
import screenIDs from '@my/screenIDs';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import React from 'react';
import { PlanKeikakushoKanri, PlanKyotakuServiceKeikakusho1, PlanKyotakuServiceKeikakusho1RegisterData } from 'maps4nc-frontend-web-api/dist/lib/model';
import usePutPlan1 from '@my/action-hooks/plan/careplan/plan1/usePutPlan1';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearPlan1 from '@my/action-hooks/plan/careplan/plan1/useClearPlan1';
import { Container } from '@material-ui/core';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel';
import Plan1InputForm, { Plan1InputFormType } from './Plan1InputForm';

type Props = {
  id: string;
  isReadonly: boolean;
  screenKbn: string;
  riyoushaSeq: number;
};

const Plan1EditForm: React.FC<Props> = (props: Props) => {
  const { id, screenKbn, riyoushaSeq, isReadonly } = props;

  const fetchPlan1 = useFetchPlan1(screenIDs.L1210_01.id);
  const putPlan1 = usePutPlan1(screenIDs.L1210_01.id);
  const clearCareplanHeader = useClearCareplanHeader();
  const clearPlan1 = useClearPlan1();

  const plan1Data = useTypedSelector((state: RootState) => state.plan1.planKyotakuServiceKeikakusho1);
  console.log('plan1Data: ', plan1Data);

  const loadingStatus = useTypedSelector((state: RootState) => state.plan1.loadingStatus);

  const selectedPlanKeikakushoKanri = useTypedSelector((state: RootState) => state.careplanHeader.selectedPlanKeikakushoKanri);
  // debug
  console.log('selectedPlanKeikakushoKanri: ', selectedPlanKeikakushoKanri);
  console.log(
    'RootState-Plan1-careplanHeader: ',
    useTypedSelector((state: RootState) => state.careplanHeader)
  );

  const notLoaded = loadingStatus !== 'Loaded';

  // 居宅サービス計画書(1)取得
  React.useEffect(
    UseEffectAsync.make(async () => {
      if (notLoaded) {
        // console.log('居宅サービス計画書(1)取得');
        await fetchPlan1(selectedPlanKeikakushoKanri?.info?.officeServiceKindSeq || 0, riyoushaSeq, selectedPlanKeikakushoKanri?.info?.keikakushoSeq || 0);
      }
    }),
    [fetchPlan1, selectedPlanKeikakushoKanri, riyoushaSeq, notLoaded]
  );

  // (編集用) 登録ボタン押下時
  const onSubmit = async (data: Plan1InputFormType) => {
    // eslint-disable-next-line no-console
    console.log('***** data -> ', data);

    const officeSeq = selectedPlanKeikakushoKanri?.info?.officeSeq || -1; // API側で設定するため、無視される
    const officeServiceKindSeq = selectedPlanKeikakushoKanri?.info?.officeServiceKindSeq || -1;
    const keikakushoShubetsu = screenKbn; // API側で設定するため、無視される
    const keikakushoSeq = selectedPlanKeikakushoKanri?.info?.keikakushoSeq || -1;
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

    // 更新API
    await putPlan1(officeServiceKindSeq, riyoushaSeq, keikakushoSeq, registerData);
    // 更新後、state を全てクリアし、再読み込み
    clearCareplanHeader();
    clearPlan1();
  };

  const defaultValues: Plan1InputFormType = {
    sakuseiKbn: ['2'],
    ninteiKbn: plan1Data?.ninteiKbn,
    keikakuSakuseiDate: plan1Data?.keikakuSakuseiDate !== undefined ? new Date(plan1Data.keikakuSakuseiDate) : undefined,
    firstSakuseiDate: plan1Data?.firstSakuseiDate !== undefined ? new Date(plan1Data.firstSakuseiDate) : undefined,
    ninteiDate: plan1Data?.ninteiDate !== undefined ? new Date(plan1Data.ninteiDate) : undefined,
    ninteiStartDate: plan1Data?.ninteiStartDate !== undefined ? new Date(plan1Data.ninteiStartDate) : undefined,
    ninteiEndDate: plan1Data?.ninteiEndDate !== undefined ? new Date(plan1Data.ninteiEndDate) : undefined,
    youkaigoKbn: plan1Data?.youkaigoKbn,
    seikatsuIkou: plan1Data?.seikatsuIkou,
    ikenServiceKindShitei: plan1Data?.ikenServiceKindShitei,
    enjoHoushin: plan1Data?.enjoHoushin,
    saniteReasonType: plan1Data?.saniteReasonType !== undefined ? [plan1Data?.saniteReasonType] : [],
    saniteReasonSonota: plan1Data?.saniteReasonSonota,
  };

  if (loadingStatus === 'Error') {
    return (
      <Container maxWidth={false}>
        <GlobalMessagePanel screenID={screenIDs.L1210_01.id} />
      </Container>
    );
  }
  if (loadingStatus !== 'Loaded') {
    return <Container maxWidth={false}>Now Loading...</Container>;
  }

  // eslint-disable-next-line no-console
  console.log('Plan1EditForm render');

  return <Plan1InputForm id={`${id}-edit`} isReadonly={isReadonly} defaultValues={defaultValues} onSubmit={onSubmit} />;
};

export default Plan1EditForm;
