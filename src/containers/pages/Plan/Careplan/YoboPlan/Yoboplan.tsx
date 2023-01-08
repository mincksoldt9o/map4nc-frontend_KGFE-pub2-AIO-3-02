import React from 'react';
import { FormContext, useForm } from 'react-hook-form';
import screenIDs from '@my/screenIDs';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import TokyoA from '@my/containers/pages/Plan/Careplan/YoboPlan/TokyoYoushiki/TokyoA';
import TokyoB from '@my/containers/pages/Plan/Careplan/YoboPlan/TokyoYoushiki/TokyoB';
import TokyoC from '@my/containers/pages/Plan/Careplan/YoboPlan/TokyoYoushiki/TokyoC';
import CareplanHeader from '@my/containers/pages/Common/CareplanHeader';
import OptionButtonField from '@my/components/molecules/OptionButtonField';
import { Box, Grid } from '@material-ui/core';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import KihonInfo from './KoroshoYoshiki/KihonInfo';
import Mokuhyo from './KoroshoYoshiki/Mokuhyo';

// 支援計画書.東京都様式のメニュータブ
const yoboplanTokyoMenuTabs: Array<TabType> = [
  { id: 'TokyoA', label: '東京A表', value: 'A', enabled: true },
  { id: 'TokyoB', label: '東京B表', value: 'B', enabled: true },
  { id: 'TokyoC', label: '東京C表', value: 'C', enabled: true },
];
const yoboplanKoroshoMenuTabs: Array<TabType> = [
  { id: 'kihonInfo', label: '基本情報・総合方針', value: 'kihonInfo', enabled: true },
  { id: 'mokuhyoAssessment', label: '目標・アセスメント等', value: 'mokuhyoAssessment', enabled: true },
];

const Yoboplan: React.FC = () => {
  const [yoboPlanType, setYoboPlanType] = React.useState('TOKYO');
  const [yoboplanTokyoTabsValue, setYoboplanTokyoTabsValue] = React.useState('A');
  const [yoboplanKoroshoTabsValue, setYoboplanKoroshoTabsValue] = React.useState('kihonInfo');

  const formMethods = useForm({
    mode: 'onChange',
    // validationSchema: yoboplanInputFormSchema, // FIXME: See Plan1.tsx as example.
  });

  return (
    <>
      <FormContext {...formMethods}>
        <CareplanHeader id="yoboplan" screenId={screenIDs.L1331_01.id} screenName="介護予防サービス・支援計画表(東京都)" screenKbn="21331" riyoushaSeq={1} isShowGenan isShowTeishutsu>
          {/* 支援計画書タブ直下 */}
          <Grid container direction="row" justify="space-between">
            <Box ml={1} maxWidth={300}>
              <OptionButtonField
                id="sample-switch"
                name="sampleSwitch"
                onChange={(v) => setYoboPlanType(v)}
                options={[
                  { label: '東京都様式', value: 'TOKYO' },
                  { label: '厚労省様式', value: 'KOROSHO' },
                ]}
                defaultValue="TOKYO"
                label="様式切り替え(サンプル用)"
                labelWidth={100}
              />
            </Box>
            <Grid item>
              <Box maxWidth={280} m={1}>
                <CalendarInputField id="minaoshi-alert" name="minaoshiAlert" label="見直しアラート" labelWidth={120} variant="table" />
              </Box>
            </Grid>
          </Grid>
          {yoboPlanType === 'TOKYO' && (
            <>
              {/* 東京都様式：メニュータブ */}
              <Tabs id="yobo-plan-tabs" orientation="horizontal" value={yoboplanTokyoTabsValue} tabs={yoboplanTokyoMenuTabs} onChange={(e, v) => setYoboplanTokyoTabsValue(v)} minWidth={60} />
              {yoboplanTokyoTabsValue === 'A' && <TokyoA />}
              {yoboplanTokyoTabsValue === 'B' && <TokyoB />}
              {yoboplanTokyoTabsValue === 'C' && <TokyoC />}
            </>
          )}
          {yoboPlanType === 'KOROSHO' && (
            <>
              {/* 厚労省様式：メニュータブ */}
              <Tabs id="yobo-plan-tabs" orientation="horizontal" value={yoboplanKoroshoTabsValue} tabs={yoboplanKoroshoMenuTabs} onChange={(e, v) => setYoboplanKoroshoTabsValue(v)} minWidth={60} />
              {yoboplanKoroshoTabsValue === 'kihonInfo' && <KihonInfo />}
              {yoboplanKoroshoTabsValue === 'mokuhyoAssessment' && <Mokuhyo />}
            </>
          )}
        </CareplanHeader>
      </FormContext>
    </>
  );
};

export default Yoboplan;
