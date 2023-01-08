import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import screenIDs from '@my/screenIDs';
import KengenUtils from '@my/utils/KengenUtils';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import { Box, Grid } from '@material-ui/core';
import DateSwitcher from '@my/components/molecules/DateSwitcher';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import SwitchButtonField from '@my/components/molecules/SwitchButtonField';
import SearchField from '@my/components/molecules/SearchField';

import CarePlanKaigo from '@my/containers/routes/Plan/Careplan/CarePlanKaigo';
import CarePlanYobou from '@my/containers/routes/Plan/Careplan/CarePlanYobou';

type RouteParams = {
  tabId: string;
};

type Props = {
  parentPath: string;
};

const Careplan: React.FC<Props> = (props: Props) => {
  const { parentPath } = props;

  const history = useHistory();

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const kaigoKengenPath = getLoginKengenInfo(['plan', 'careplan', 'kaigo']);
  const yobouKengenPath = getLoginKengenInfo(['plan', 'careplan', 'yobou']);

  // 各タブの権限状態
  const readableKaigo = KengenUtils.isReadable(kaigoKengenPath[screenIDs.L1200_01.id]);
  const readableYobou = KengenUtils.isReadable(yobouKengenPath[screenIDs.L1300_01.id]);

  // 初期選択状態
  let defaultSelectPageKey = '';
  if (readableKaigo) {
    defaultSelectPageKey = 'kaigo';
  } else if (readableYobou) {
    defaultSelectPageKey = 'yobou';
  }

  // タブ情報
  const tabs: Array<TabType> = [];
  if (readableKaigo) {
    tabs.push({ id: '1', value: `${parentPath}/kaigo`, label: '介護計画書', enabled: true });
  }
  if (readableYobou) {
    tabs.push({ id: '2', value: `${parentPath}/yobou`, label: '予防計画書', enabled: true });
  }

  // 表示対象年月プルダウン変更時
  const [displayTaishouNengetsu, setDisplayTaishouNengetsu] = React.useState<Date | undefined>(new Date());
  const handleNengetsuChange = (selectedNengetsu?: Date) => {
    setDisplayTaishouNengetsu(selectedNengetsu);
    return true;
  };

  // 万能検索テキストの変更時
  const [searchText, setSearchText] = React.useState<string>();
  const handleSearchChange = (searchValue: string) => {
    setSearchText(searchValue);
  };

  // 万能検索テキストの検索ボタン押下時
  const handleSearchClick = () => {
    console.log('***** 検索ボタン押下時', searchText);
  };

  // URL変更を検知し rerender
  // ※以下を入れることで検知できる
  useRouteMatch<RouteParams>(`${parentPath}/:tabId`);

  return (
    <Box mt={1}>
      <Switch>
        <Redirect from={parentPath} to={`${parentPath}/${defaultSelectPageKey}`} exact />
        <Route path={[`${parentPath}/kaigo`, `${parentPath}/yobou`]} exact>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <Box ml={1}>
                <DateSwitcher id="display-taishou-nengetsu" name="displayTaishouNengetsu" disabled={false} value={displayTaishouNengetsu} onChange={handleNengetsuChange} variant="table" />
              </Box>
            </Grid>
            <Grid item justify="center">
              <Box ml={1.5}>
                <ComboBoxField
                  id="care-maneger"
                  name="careManeger"
                  label="ケアマネジャー"
                  options={[{ label: '管理者', value: '1' }]}
                  value={{ label: '管理者', value: '1' }}
                  clearable={false}
                  minWidth={220}
                  variant="table"
                  labelWidth={110}
                />
              </Box>
            </Grid>
            <Grid item>
              <Box ml={2}>
                <SwitchButtonField id="taishogai" name="taishogai" label="検索対象外も表示する" labelWidth={150} size="small" />
              </Box>
            </Grid>
          </Grid>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={8}>
              <Box ml={1} mt={1}>
                <SearchField
                  id="search-text"
                  placeholder="利用者番号／被保険者番号／氏名／氏名カナで検索"
                  value={searchText}
                  size="small"
                  onChange={handleSearchChange}
                  onClickSearchButton={handleSearchClick}
                  fullWidth
                />
              </Box>
            </Grid>
          </Grid>
          <Tabs id="tabs" link orientation="horizontal" value={history.location.pathname} tabs={tabs} />
        </Route>
      </Switch>
      <Switch>
        <Route path={`${parentPath}/kaigo`}>
          <CarePlanKaigo parentPath={`${parentPath}/kaigo`} />
        </Route>
        <Route path={`${parentPath}/yobou`}>
          <CarePlanYobou parentPath={`${parentPath}/yobou`} />
        </Route>
      </Switch>
    </Box>
  );
};

export default Careplan;
