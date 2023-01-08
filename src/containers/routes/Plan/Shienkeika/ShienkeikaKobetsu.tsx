import React from 'react';
import styled from 'styled-components';
import { Redirect, useRouteMatch } from 'react-router';
import { RootState, useTypedSelector } from '@my/stores';
import AlertMessage from '@my/components/atomic/AlertMessage';
import SearchIcon from '@my/components/icon/SearchIcon';

import ShienkeikaKobetsuRiyousha from './ShienkeikaKobetsuRiyousha';

const InnerArea = styled.div`
  padding: 1em 0;
`;

const InnerSearchIcon = styled(SearchIcon)`
  width: 0.7em;
  height: 0.7em;
`;

type RouteParams = {
  riyoushaSeq: string;
};

type Props = {
  parentPath: string;
};

const ShienkeikaKobetsu: React.FC<Props> = (props: Props) => {
  const { parentPath } = props;

  const currentRiyousha = useTypedSelector((state: RootState) => state.riyousha.currentRiyousha);
  const riyoushaSeq = currentRiyousha?.riyoushaSeq !== undefined ? currentRiyousha?.riyoushaSeq.toString() : '0';

  // URL変更を検知し rerender
  // ※以下を入れることで検知できる
  useRouteMatch<RouteParams>(`${parentPath}/:riyoushaSeq`);

  return (
    <>
      {currentRiyousha ? (
        <>
          <Redirect from={parentPath} to={`${parentPath}/${riyoushaSeq}`} exact />
          <ShienkeikaKobetsuRiyousha parentPath={`${parentPath}/${riyoushaSeq}`} />
        </>
      ) : (
        <InnerArea>
          <AlertMessage
            type="warn"
            message={
              <>
                利用者が選択されていません。利用者台帳もしくは画面上部&nbsp;
                <InnerSearchIcon />
                &nbsp;にて利用者を選択してください。
              </>
            }
          />
        </InnerArea>
      )}
    </>
  );
};

export default ShienkeikaKobetsu;
