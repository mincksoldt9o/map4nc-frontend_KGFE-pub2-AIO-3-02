import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import KengenWrapper from '@my/containers/organisms/KengenWrapper/KengenWrapper';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import screenIDs from '@my/screenIDs';

import CarePlanKaigoList from '@my/containers/pages/Plan/Careplan/List';
import RiyoushaCarePlanKaigo from '@my/containers/routes/Plan/Careplan/RiyoushaCarePlanKaigo';

type Props = {
  parentPath: string;
};

type RouteParams = {
  riyoushaSeq?: string;
  tabId?: string;
};

const CarePlanKaigo: React.FC<Props> = (props: Props) => {
  const { parentPath } = props;

  const history = useHistory();

  const routeMatch = useRouteMatch<RouteParams>(`${parentPath}/:riyoushaSeq/:tabId?`);
  const routeRiyoushaSeq = routeMatch?.params.riyoushaSeq || '';

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const kengenPath = getLoginKengenInfo(['plan', 'careplan', 'kaigo']);

  // 計画書リンククリック時
  const handleKeikakushoLinkClick = (tabId: string, riyoushaSeq: number) => {
    history.push(`${parentPath}/${riyoushaSeq}/${tabId}`);
  };

  // ヘッダー部のパンくずリンク押下時
  const handleHeaderBreadcrumbClick = () => {
    history.push(parentPath);
  };

  return (
    <Switch>
      <Route path={parentPath} exact>
        <KengenWrapper kengen={kengenPath} screenId={screenIDs.L1200_01}>
          <CarePlanKaigoList handleKeikakushoLinkClick={handleKeikakushoLinkClick} />
        </KengenWrapper>
      </Route>
      <Route path={`${parentPath}/${routeRiyoushaSeq}`}>
        <RiyoushaCarePlanKaigo parentPath={`${parentPath}/${routeRiyoushaSeq}`} riyoushaSeq={Number(routeRiyoushaSeq)} handleHeaderBreadcrumbClick={handleHeaderBreadcrumbClick} />
      </Route>
    </Switch>
  );
};

export default CarePlanKaigo;
