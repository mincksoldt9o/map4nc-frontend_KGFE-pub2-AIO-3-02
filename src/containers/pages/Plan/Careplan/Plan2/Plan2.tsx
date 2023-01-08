import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import screenIDs from '@my/screenIDs';
import KengenUtils from '@my/utils/KengenUtils';
import { RootState, useTypedSelector } from '@my/stores';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import { useUnmount } from 'react-use';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import { useClearPlan2 } from '@my/action-hooks/plan/careplan/plan2';
import { useClearApiMessage } from '@my/action-hooks';
import Plan2AddForm from './Plan2AddForm';
import Plan2CopyForm from './Plan2CopyForm';
import Plan2EditForm from './Plan2EditForm';
import { plan2InputFormSchema, Plan2InputFormType } from './Plan2InputForm';

export type Props = {
  id: string;
  riyoushaSeq: number;
};

// 定数定義
// 画面の権限チェック用配列
const kengens = ['plan', 'careplan', 'kaigo', 'plan2'];

/**
 * 画面区分
 * @description
 *     必須
 *     履歴ヘッダコンポーネントで、最新 帳票履歴 取得時 のパラメータに用いる。
 *     (3200.画面/3230.画面設計/z9999.共通.xlsx - [画面概要 (11)] 参照)
 *     (3300.DB設計/3350.マスタデータ定義/定数一覧.xlsx - [#38] 参照)
 */
const screenKbn = '21220';

/**
 * 画面名
 * @description
 *     必須
 *     計画書系は選択されているタブのラベル名など。
 *     未設定の場合は固定値：帳票
 *     (3200.画面/3230.画面設計/z9999.共通.xlsx - [画面概要 (11)] 参照)
 */
const screenName = '居宅サービス計画書(2)';

const Plan2: React.FC<Props> = (props: Props) => {
  const { id, riyoushaSeq } = props;

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const loginKengens = getLoginKengenInfo(kengens);
  const screenId = screenIDs.L1220_01.id;
  const isReadonly = KengenUtils.isReadonly(loginKengens[screenIDs.L1220_01.id]);

  const clearCareplanHeader = useClearCareplanHeader();
  const clearPlan2 = useClearPlan2();
  const clearApiMessage = useClearApiMessage();

  const mode = useTypedSelector((state: RootState) => state.careplanHeader.mode);

  // アンマウント
  useUnmount(() => {
    clearCareplanHeader();
    clearPlan2();
    clearApiMessage(screenId);
  });

  const formMethods = useForm<Plan2InputFormType>({
    mode: 'onChange',
    validationSchema: plan2InputFormSchema,
  });

  // eslint-disable-next-line no-console
  console.log('Plan2 render');

  return (
    <>
      <FormContext {...formMethods}>
        <CareplanHeader id={id} screenId={screenId} screenName={screenName} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly}>
          {mode === 'add' && <Plan2AddForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
          {mode === 'copy' && <Plan2CopyForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
          {mode === 'edit' && <Plan2EditForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
        </CareplanHeader>
      </FormContext>
    </>
  );
};

export default Plan2;
