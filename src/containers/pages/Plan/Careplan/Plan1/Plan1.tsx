import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { RootState, useTypedSelector } from '@my/stores';
import useFetchPlanRiyoushaKihon from '@my/action-hooks/plan/careplan/plan1/useFetchPlanRiyoushaKihon';
import useFetchYoukaigodoList from '@my/action-hooks/plan/careplan/plan1/useFetchYoukaigodoList';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import KengenUtils from '@my/utils/KengenUtils';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import screenIDs from '@my/screenIDs';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import { useUnmount } from 'react-use';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearPlan1 from '@my/action-hooks/plan/careplan/plan1/useClearPlan1';
import { useClearApiMessage } from '@my/action-hooks';
import { Container } from '@material-ui/core';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel';
import Plan1AddForm from './Plan1AddForm';
import Plan1EditForm from './Plan1EditForm';
import { plan1InputFormSchema, Plan1InputFormType } from './Plan1InputForm';
import Plan1CopyForm from './Plan1CopyForm';

export type Props = {
  id: string;
  riyoushaSeq: number;
};

// 定数定義
// 画面の権限チェック用配列
const kengens = ['plan', 'careplan', 'kaigo', 'plan1'];

/**
 * 画面区分
 * @description
 *     必須
 *     履歴ヘッダコンポーネントで、最新 帳票履歴 取得時 のパラメータに用いる。
 *     (3200.画面/3230.画面設計/z9999.共通.xlsx - [画面概要 (11)] 参照)
 *     (3300.DB設計/3350.マスタデータ定義/定数一覧.xlsx - [#38] 参照)
 */
const screenKbn = '21210';

/**
 * 画面名
 * @description
 *     必須
 *     計画書系は選択されているタブのラベル名など。
 *     未設定の場合は固定値：帳票
 *     (3200.画面/3230.画面設計/z9999.共通.xlsx - [画面概要 (11)] 参照)
 */
const screenName = '居宅サービス計画書(1)';

/**
 * 居宅サービス計画書(1)画面
 */
const Plan1: React.FC<Props> = (props: Props) => {
  const { id, riyoushaSeq } = props;
  const getLoginKengenInfo = useGetLoginKengenInfo();
  const loginKengens = getLoginKengenInfo(kengens);
  const screenId = screenIDs.L1210_01.id;
  const isReadonly = KengenUtils.isReadonly(loginKengens[screenIDs.L1210_01.id]);

  const fetchPlanRiyoushaKihon = useFetchPlanRiyoushaKihon(screenIDs.L1210_01.id);
  const fetchYoukaigodoList = useFetchYoukaigodoList(screenIDs.L1210_01.id);
  const clearCareplanHeader = useClearCareplanHeader();
  const clearPlan1 = useClearPlan1();
  const clearApiMessage = useClearApiMessage();

  const mode = useTypedSelector((state: RootState) => state.careplanHeader.mode);
  const sakuseiDate = useTypedSelector((state: RootState) => state.careplanHeader.sakuseiDate);
  const loadingRiyoushaKihonStatus = useTypedSelector((state: RootState) => state.plan1.loadingRiyoushaKihonStatus);
  const loadingYoukaigodoListStatus = useTypedSelector((state: RootState) => state.plan1.loadingYoukaigodoListStatus);

  const notLoadedRiyoushaKihon = loadingRiyoushaKihonStatus !== 'Loaded';
  const notLoadedYoukaigodoList = loadingYoukaigodoListStatus !== 'Loaded';

  /**
   * EZ7 作成日変更時のイベント (CareplanHeader から呼ばれる)
   * @param sakuseiDateNum 作成日(Number型)
   */
  const onChangeCreateDate = async (sakuseiDateNum: number) => {
    // (プラン用) 利用者基本情報取得
    await fetchPlanRiyoushaKihon(riyoushaSeq, sakuseiDateNum);
    // 要介護度リスト取得
    await fetchYoukaigodoList(sakuseiDateNum);
  };

  // (プラン用) 利用者基本情報取得
  React.useEffect(
    UseEffectAsync.make(async () => {
      if (notLoadedRiyoushaKihon) {
        // console.log('(プラン用) 利用者基本情報取得');
        await fetchPlanRiyoushaKihon(riyoushaSeq, sakuseiDate || new Date().getTime());
      }
    }),
    [fetchPlanRiyoushaKihon, riyoushaSeq, sakuseiDate, notLoadedRiyoushaKihon]
  );

  // 要介護度リスト取得
  React.useEffect(
    UseEffectAsync.make(async () => {
      // (プラン用) 利用者基本情報取得完了を待つ
      if (notLoadedRiyoushaKihon) {
        return;
      }
      if (notLoadedYoukaigodoList) {
        // console.log('要介護度リスト取得');
        await fetchYoukaigodoList(sakuseiDate || new Date().getTime());
      }
    }),
    [fetchYoukaigodoList, sakuseiDate, notLoadedRiyoushaKihon, notLoadedYoukaigodoList]
  );

  // アンマウント
  useUnmount(() => {
    clearCareplanHeader();
    clearPlan1();
    clearApiMessage(screenIDs.L1210_01.id);
  });

  const formMethods = useForm<Plan1InputFormType>({
    mode: 'onChange',
    validationSchema: plan1InputFormSchema,
  });

  console.log("formMethods: ", formMethods);
  console.log("formMethods.control.mode: ", formMethods.control.mode);
  //console.log("formMethods.control.validateSchemaIsValid: ", formMethods.control.validateSchemaIsValid);
  


  if (loadingRiyoushaKihonStatus === 'Error' || loadingYoukaigodoListStatus === 'Error') {
    return (
      <Container maxWidth={false}>
        <GlobalMessagePanel screenID={screenIDs.L1210_01.id} />
      </Container>
    );
  }
  if (loadingRiyoushaKihonStatus !== 'Loaded' || loadingYoukaigodoListStatus !== 'Loaded') {
    return <Container maxWidth={false}>Now Loading...</Container>;
  }

  // eslint-disable-next-line no-console
  console.log('Plan1 render');

  return (
    <>
      <FormContext {...formMethods}>
        <CareplanHeader
          id={id}
          key={id}
          screenId={screenId}
          screenKbn={screenKbn}
          screenName={screenName}
          riyoushaSeq={riyoushaSeq}
          isShowGenan
          isShowTeishutsu
          isReadonly={isReadonly}
          onChangeCreateDate={onChangeCreateDate}>
          {mode === 'add' && <Plan1AddForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
          {mode === 'copy' && <Plan1CopyForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
          {mode === 'edit' && <Plan1EditForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
        </CareplanHeader>
      </FormContext>
    </>
  );
};

export default Plan1;
