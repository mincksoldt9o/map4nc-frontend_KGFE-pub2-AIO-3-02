import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useUnmount } from 'react-use';
import { ScreenID } from '@my/screenIDs';
import useDocumentTitle from '@my/hooks/useDocumentTitle';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel/GlobalMessagePanel';
import { RootState, useTypedSelector } from '@my/stores';
import { useFetchHistoryInit } from '@my/action-hooks/common/chouhyouSakuseiDateList';
import { useClearKeikakusho, useSelectedKeikakusho } from '@my/action-hooks/plan/keikakusho';
import UseEffectAsync from '@my/utils/UseEffectAsync';
import { Container } from '@material-ui/core';
import styled from 'styled-components';
import { useClearApiMessage } from '@my/action-hooks';
import KengenUtils from '@my/utils/KengenUtils';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import { KeikakushoTabIds, RouteParamsType } from '@my/containers/pages/Plan/Keikakusho';
import KeikakushoComForm from '@my/containers/pages/Plan/Keikakusho/KeikakushoComForm';

const StyledContainer = styled(Container)`
  height: 100vh;
  margin-top: -234px;
  padding: 246px 0.5em 0 0.5em;
  & form {
    overflow: hidden;
  }
  @media (max-height: 660px) {
    height: auto;
    margin-top: auto;
    padding: 1em;
  }
  @media (max-width: 780px) {
    height: auto;
    margin-top: auto;
    padding: 1em;
  }
` as typeof Container;
const InnerMessagePanel = styled.div`
  & .MuiBox-root {
    margin: 0 0 16px 0;
  }
`;

type KeikakushoComProps = {
  id: string;
  screenId: ScreenID;
};

const KeikakushoCom: React.FC<KeikakushoComProps> = (props: KeikakushoComProps) => {
  const { id, screenId } = props;
  useDocumentTitle(screenId);

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const clearApiMessage = useClearApiMessage();
  const fetchHistoryInit = useFetchHistoryInit(screenId.id);
  const clearKeikakusho = useClearKeikakusho();
  const selectedKeikakusho = useSelectedKeikakusho(screenId.id);
  const { tabId } = useParams<RouteParamsType>();
  const riyoushaSeq = useTypedSelector((state: RootState) => state.riyousha.currentRiyousha?.riyoushaSeq);
  const { loadingInitStatus, deletedStatus, selectedHistory } = useTypedSelector((state: RootState) => state.chouhyouSakuseiDate);
  const { loadingStatus, keikakushoInfo } = useTypedSelector((state: RootState) => state.keikakusho);
  const kengens = getLoginKengenInfo(['plan', 'keikakusho']);
  const isReadonly = KengenUtils.isReadonly(kengens[screenId.id]);
  const headerTabId = tabId && KeikakushoTabIds.has(tabId) ? KeikakushoTabIds.get(tabId) || '' : '';

  useUnmount(() => {
    clearApiMessage(screenId.id);
    clearKeikakusho();
  });

  useEffect(
    UseEffectAsync.make(async () => {
      if (riyoushaSeq && !deletedStatus) {
        if (loadingInitStatus === 'NotLoad') {
          await fetchHistoryInit(selectedHistory.sakuseiSeq, 1, riyoushaSeq, headerTabId);
        }
        if (loadingInitStatus === 'Loaded' && loadingStatus === 'NotLoad') {
          selectedKeikakusho(selectedHistory);
        }
      }
    }),
    [loadingStatus, loadingInitStatus, selectedHistory, deletedStatus, riyoushaSeq, headerTabId]
  );

  if (!(loadingInitStatus !== 'Error' && loadingStatus !== 'Error')) {
    return (
      <Container maxWidth={false}>
        <GlobalMessagePanel screenID={screenId.id} />
      </Container>
    );
  }
  if (!(loadingInitStatus === 'Loaded' && loadingStatus === 'Loaded')) {
    return <Container maxWidth={false}>Now Loading...</Container>;
  }
  return (
    <StyledContainer maxWidth={false}>
      <InnerMessagePanel>
        <GlobalMessagePanel screenID={screenId.id} />
      </InnerMessagePanel>
      <KeikakushoComForm id={id} screenId={screenId} isReadonly={isReadonly} defaultValues={keikakushoInfo} />
    </StyledContainer>
  );
};

export default KeikakushoCom;
