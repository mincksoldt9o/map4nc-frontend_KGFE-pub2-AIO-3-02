import React, { useState } from 'react';
import styled from 'styled-components';

import { DialogContent, DialogActions } from '@my/components/atomic/Dialog';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import Accordion from '@my/components/molecules/Accordion';
import DataDisplay from '@my/components/atomic/DataDisplay';
import { CellProps, DataGrid, DataGridColumn, EditableGridData, GridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import Tabs, { TabType } from '@my/components/molecules/Tabs';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';

/** TODO: z9999-11 へ変更する */

const HihoInfoPanel = styled.div`
  padding: 0px 10px;
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const HeaderCell = styled(TableCell)`
  background-color: #a49696;
  color: white;
  padding: 7px 5px 7px 5px;
`;

const StyledTableCell = styled(TableCell)`
  padding: 7px 5px 7px 5px;
`;

type ShienkeikaKagenzanSettingInputFormProps = {
  id: string;
  onSubmit: () => void;
  isKaigo: boolean;
  isYobou: boolean;
  isIkkatu: boolean;
  editServiceKindValue?: string;
};

// サービス種類 DataGrid
type ServiceKindGridColumnData = GridData & {
  serviceKind: LabelAndValue;
};
const serviceKindDefaultData: ServiceKindGridColumnData[] = [
  {
    serviceKind: { label: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３１２３４５６７８９４', value: '1' },
  },
  {
    serviceKind: { label: '介護予防短期入所療養介護（介護療養型医療施設等）', value: '26' },
  },
  {
    serviceKind: { label: '訪問介護', value: '11' },
  },
  {
    serviceKind: { label: '訪問入浴介護', value: '12' },
  },
  {
    serviceKind: { label: '訪問看護', value: '13' },
  },
  {
    serviceKind: { label: '訪問リハビリテーション', value: '14' },
  },
  {
    serviceKind: { label: '通所介護', value: '15' },
  },
  {
    serviceKind: { label: '通所リハビリテーション', value: '16' },
  },
];

// 加減算 DataGrid
type KagenzanGridColumnData = EditableGridData & {
  kagenzan: LabelAndValue;
  setsumei?: string;
};
const kagenzanDefaultData: KagenzanGridColumnData[] = [
  {
    kagenzan: { label: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３１２３４５６７８９４', value: '1' },
    setsumei: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３１２３４５６７８９４１２３４５６７８９５１２３４５６７８９６',
  },
  {
    kagenzan: { label: '中山間地域等に居住するものへのサービス提供加算', value: '2' },
    setsumei: '中山間地域等に居住する者へのサービス提供加算',
  },
  {
    kagenzan: { label: '入院時情報連携加算Ⅰ', value: '3' },
    setsumei: '入院時情報連携加算Ⅰ。入院後３日以内に情報提供（提供方法は問わない）',
  },
  {
    kagenzan: { label: '入院時情報連携加算Ⅱ', value: '4' },
    setsumei: '入院時情報連携加算Ⅱ。入院後７日以内に情報提供（提供方法は問わない）',
  },
  {
    kagenzan: { label: '退院退所加算Ⅰ1', value: '5' },
    setsumei: '退院時連携1回・ｶﾝﾌｧﾚﾝｽ参加無',
  },
  {
    kagenzan: { label: '退院退所加算Ⅰ2', value: '6' },
    setsumei: '退院時連携1回・ｶﾝﾌｧﾚﾝｽ参加有',
  },
  {
    kagenzan: { label: '退院退所加算Ⅱ1', value: '7' },
    setsumei: '退院時連携2回・ｶﾝﾌｧﾚﾝｽ参加無',
  },
  {
    kagenzan: { label: '退院退所加算Ⅱ2', value: '8' },
    setsumei: '退院時連携2回・ｶﾝﾌｧﾚﾝｽ参加有',
  },
  {
    kagenzan: { label: '退院退所加算Ⅲ', value: '9' },
    setsumei: '退院時連携3回・ｶﾝﾌｧﾚﾝｽ参加有',
  },
  {
    kagenzan: { label: '緊急時等居宅カンファレンス加算', value: '10' },
    setsumei: '緊急時等居宅ｶﾝﾌｧﾚﾝｽ加算。月２回まで居宅に訪問しｶﾝﾌｧﾚﾝｽを行った場合',
  },
  {
    kagenzan: { label: '通院時情報連携加算', value: '11' },
    setsumei: '',
  },
  {
    kagenzan: { label: 'ターミナルケアマネジメント加算', value: '12' },
    setsumei: '死亡日及び死亡日前１４日以内に２日以上在宅の訪問等を行った場合',
  },
  {
    kagenzan: { label: '運営基準減算Ⅰ', value: '13' },
    setsumei: '正当な理由なく、月１回、利用者の居宅を訪問していない',
  },
  {
    kagenzan: { label: '運営基準減算Ⅱ', value: '14' },
    setsumei: '正当な理由なく、計画作成時に担当者会議/照会を行っていない',
  },
  {
    kagenzan: { label: '運営基準減算Ⅲ', value: '15' },
    setsumei: '居宅サービス計画（原案）の説明/同意を得て、交付していない',
  },
  {
    kagenzan: { label: '運営基準減算Ⅳ', value: '16' },
    setsumei: '実施状況把握の未記録が１月以上継続している',
  },
];

const ShienkeikaKagenzanSettingInputForm: React.FC<ShienkeikaKagenzanSettingInputFormProps> = (props: ShienkeikaKagenzanSettingInputFormProps) => {
  const { id, onSubmit, isKaigo, isYobou, isIkkatu, editServiceKindValue } = props;

  console.log(isKaigo); // 使用しない場合は props から削除する

  const [tabValue, setTabValue] = useState<string>('1'); // TODO: 初期値として、総合事業（A1～A9）のみの場合は、総合事業を初期とする。総合事業サービス以外のサービスがある場合は、予防を初期値とする

  // サービス種類 DataGrid
  const servicekindcolumns: DataGridColumn<ServiceKindGridColumnData>[] = React.useMemo(
    (): DataGridColumn<ServiceKindGridColumnData>[] => [
      {
        Header: 'サービス種類',
        accessor: 'serviceKind',
        // fixed: true,
        // width: 360,
        width: 1,
        minWidth: 360,
        maxWidth: 2000,
        Cell: ({ value: labelAndValue }: CellProps<ServiceKindGridColumnData, LabelAndValue>) => {
          return <DataDisplay id={`${id}-servicekind-label`} value={labelAndValue.label} />;
        },
      },
    ],
    [id]
  );
  const serviceKindDataGridValues = useEditableDataGrid<ServiceKindGridColumnData>({
    sortable: false,
    defaultData: serviceKindDefaultData,
  });

  // 加減算 DataGrid
  const kagenzanColumns: DataGridColumn<KagenzanGridColumnData>[] = React.useMemo((): DataGridColumn<KagenzanGridColumnData>[] => {
    const commonColumns: DataGridColumn<KagenzanGridColumnData>[] = [];

    commonColumns.push({
      Header: '加減算名',
      accessor: 'kagenzan',
      width: 2,
      minWidth: 300,
      wrap: true,
      Cell: ({ value: labelAndValue }: CellProps<ServiceKindGridColumnData, LabelAndValue>) => {
        return <DataDisplay id={`${id}-kagenzan-label`} value={labelAndValue.label} />;
      },
    });

    if (tabValue === '1') {
      commonColumns.push({
        Header: '説明',
        accessor: 'setsumei',
        width: 4,
        minWidth: 440,
        wrap: true,
      });
    }

    return commonColumns;
  }, [id, tabValue]);
  const kagenzanDataGridValues = useEditableDataGrid<KagenzanGridColumnData>({
    rowSelect: 'multiple',
    sortable: false,
    defaultData: kagenzanDefaultData,
  });

  // タブ情報
  const tabHandleChange = (event: React.ChangeEvent<{}>, value: string) => {
    setTabValue(value);
  };
  const tabs: Array<TabType> = [];
  // if (readableKaigo) {
  //   tabs.push({ id: '1', value: `${parentPath}/kaigo`, label: '介護計画書', enabled: true });
  // }
  // if (readableYobou) {
  //   tabs.push({ id: '2', value: `${parentPath}/yobou`, label: '予防計画書', enabled: true });
  // }
  tabs.push({ id: '1', value: '1', label: '予防', enabled: true });
  tabs.push({ id: '2', value: '2', label: '総合事業', enabled: true });

  // タブ表示制御
  const displayTab = isYobou || (isIkkatu && editServiceKindValue === '46');

  return (
    <>
      <DialogContent>
        <Box mt={1} />
        <Accordion id="hiho-accordion" summary="被保険者証情報・サービス情報" orientation="vertical">
          <HihoInfoPanel>
            <TableContainer>
              <Table aria-label="custom pagination table">
                <TableBody>
                  <TableRow>
                    <HeaderCell component="th" align="center">
                      保険者
                    </HeaderCell>
                    <StyledTableCell align="center">
                      <DataDisplay id={`${id}_hokensha`} value="131037 港区（特別区）" />
                    </StyledTableCell>
                    <HeaderCell component="th" align="center">
                      被保険者番号
                    </HeaderCell>
                    <StyledTableCell align="center">
                      <DataDisplay id={`${id}_hihokensha-no`} value="0000000003" />
                    </StyledTableCell>
                    <HeaderCell component="th" align="center">
                      要介護度
                    </HeaderCell>
                    <StyledTableCell align="center">
                      <DataDisplay id={`${id}_youkaigodo`} value="要介護２" />
                    </StyledTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </HihoInfoPanel>
          <Box mb={1} />
          <LayoutForm id={id}>
            <LayoutItem variant="right-margin">
              <DataGrid id="servicekind-details" columns={servicekindcolumns} flexibleHeight {...serviceKindDataGridValues} />
            </LayoutItem>
          </LayoutForm>
          <Box mb={1} />
        </Accordion>
        <Box mb={1} />
        {displayTab && <Tabs id="tabs" orientation="horizontal" value={tabValue} tabs={tabs} onChange={tabHandleChange} />}
        <Box mb={1} />
        <DataGrid id="kagenzan-details" columns={kagenzanColumns} heightOffset={260} {...kagenzanDataGridValues} />
      </DialogContent>
      <DialogActions>
        <GeneralIconButton icon="register" id={`${id}-save-button`} onClick={onSubmit}>
          決定
        </GeneralIconButton>
      </DialogActions>
    </>
  );
};

export default ShienkeikaKagenzanSettingInputForm;
