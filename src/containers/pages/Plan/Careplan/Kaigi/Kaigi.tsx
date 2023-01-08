import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import { RootState, useTypedSelector } from '@my/stores';
import useFetchPlanRiyoushaKihon from '@my/action-hooks/plan/careplan/kaigi/useFetchPlanRiyoushaKihon';
import useFetchYoukaigodoList from '@my/action-hooks/plan/careplan/kaigi/useFetchYoukaigodoList';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import KengenUtils from '@my/utils/KengenUtils';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import screenIDs from '@my/screenIDs';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import { useUnmount } from 'react-use';
import { useClearCareplanHeader } from '@my/action-hooks/plan/careplan/careplanHeader';
import useClearKaigi from '@my/action-hooks/plan/careplan/kaigi/useClearKaigi';
import { useClearApiMessage } from '@my/action-hooks';
import { Container } from '@material-ui/core';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel';
import KaigiAddForm from './KaigiAddForm';
import KaigiEditForm from './KaigiEditForm';
import { kaigiInputFormSchema, KaigiInputFormType } from './KaigiInputForm';
import KaigiCopyForm from './KaigiCopyForm';

export type Props = {
  id: string;
  riyoushaSeq: number;
};

// constant definition
// Screen permission check array
const kengens = ['plan', 'careplan', 'kaigo', 'kaigi'];

const screenKbn = '21240';

const screenName = 'サービス担当者会議の要点'; // Key points of the service representative meeting

/**
  * Key Points screen
  */
const Kaigi: React.FC<Props> = (props: Props) => {
  const { id, riyoushaSeq } = props;
  const getLoginKengenInfo = useGetLoginKengenInfo();
  const loginKengens = getLoginKengenInfo(kengens);
  const screenId = screenIDs.L1240_01.id;
  const isReadonly = KengenUtils.isReadonly(loginKengens[screenIDs.L1240_01.id]);

  const fetchPlanRiyoushaKihon = useFetchPlanRiyoushaKihon(screenIDs.L1240_01.id);
  const fetchYoukaigodoList = useFetchYoukaigodoList(screenIDs.L1240_01.id);
  const clearCareplanHeader = useClearCareplanHeader();
  const clearKaigi = useClearKaigi();
  const clearApiMessage = useClearApiMessage();

  const mode = useTypedSelector((state: RootState) => state.careplanHeader.mode);
  const sakuseiDate = useTypedSelector((state: RootState) => state.careplanHeader.sakuseiDate);
  const loadingRiyoushaKihonStatus = useTypedSelector((state: RootState) => state.kaigi.loadingRiyoushaKihonStatus);
  const loadingYoukaigodoListStatus = useTypedSelector((state: RootState) => state.kaigi.loadingYoukaigodoListStatus);

  const notLoadedRiyoushaKihon = loadingRiyoushaKihonStatus !== 'Loaded';
  const notLoadedYoukaigodoList = loadingYoukaigodoListStatus !== 'Loaded';

  /**
    * EZ7 Creation Date Change Event (called from CareplanHeader)
    * @param sakuseiDateNum Creation date (Number type)
    */
  const onChangeCreateDate = async (sakuseiDateNum: number) => {
    // (for plan) get key points
    await fetchPlanRiyoushaKihon(riyoushaSeq, sakuseiDateNum);
    // Acquire care level list
    await fetchYoukaigodoList(sakuseiDateNum);
  };

  // (for plan) get key points
  React. useEffect(
  UseEffectAsync. make(async () => {
  if (notLoadedRiyoushaKihon) {
  // console.log('(for plan) key points');
  await fetchPlanRiyoushaKihon(riyoushaSeq, sakuseiDate || new Date().getTime());
  }
  }),
  [fetchPlanRiyoushaKihon, riyoushaSeq, sakuseiDate, notLoadedRiyoushaKihon]
  );

  // Acquire care level list
  React. useEffect(
  UseEffectAsync. make(async () => {
  // (For plan) Wait for completion of basic user information acquisition
  if (notLoadedRiyoushaKihon) {
  return;
  }
  if (notLoadedYoukaigodoList) {
  // console.log('get list of care level');
  await fetchYoukaigodoList(sakuseiDate || new Date().getTime());
  }
  }),
  [fetchYoukaigodoList, sakuseiDate, notLoadedRiyoushaKihon, notLoadedYoukaigodoList]
  );

  // unmount


  useUnmount(() => {
    clearCareplanHeader();
    clearKaigi();
    clearApiMessage(screenIDs.L1240_01.id);
  });

  const formMethods = useForm<KaigiInputFormType>({
    mode: 'onChange',
    validationSchema: kaigiInputFormSchema,
  });

  if (loadingRiyoushaKihonStatus === 'Error' || loadingYoukaigodoListStatus === 'Error') {
    return (
      <Container maxWidth={false}>
        <GlobalMessagePanel screenID={screenIDs.L1240_01.id} />
      </Container>
    );
  }

  // if (loadingRiyoushaKihonStatus !== 'Loaded' || loadingYoukaigodoListStatus !== 'Loaded') {
  //   return <Container maxWidth={false}>Now Loading......</Container>;
  // }

  // eslint-disable-next-line no-console
  console.log('Kaigi render');

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
          {mode === 'add' && <KaigiAddForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
          {mode === 'copy' && <KaigiCopyForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
          {mode === 'edit' && <KaigiEditForm id={id} screenKbn={screenKbn} riyoushaSeq={riyoushaSeq} isReadonly={isReadonly} />}
        </CareplanHeader>
      </FormContext>
    </>
  );
};

export default Kaigi;