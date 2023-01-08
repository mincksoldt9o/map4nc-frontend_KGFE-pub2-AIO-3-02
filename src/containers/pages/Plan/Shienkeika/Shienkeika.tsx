import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

// import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import screenIDs, { ScreenID } from '@my/screenIDs';
import Messages from '@my/messages';
// import KengenUtils from '@my/utils/KengenUtils';
import { Box, Chip, Grid } from '@material-ui/core';
import ComboBoxField from '@my/components/molecules/ComboBoxField';

import OptionButton from '@my/components/atomic/OptionButton';
import CalendarInput from '@my/components/molecules/CalendarInput';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import TextInputField from '@my/components/molecules/TextInputField';
import DataDisplay from '@my/components/atomic/DataDisplay';
import CalendarIcon from '@my/components/icon/CalendarIcon';
import IconButton from '@my/components/atomic/IconButton';
import { CellProps, DataGrid, DataGridColumn, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import DateUtils from '@my/utils/DateUtils';
import { DataKindColumnFilter, includesSomeFilterType, TextColumnFilter } from '@my/components/molecules/DataGrid/filters';
import ShienkeikaNextHoumonDateTimeEdit from '@my/containers/pages/Plan/Shienkeika/ShienkeikaNextHoumonDateTimeEdit';
import ShienkeikaPrint from '@my/containers/pages/Plan/Shienkeika/ShienkeikaPrint';
import ShienkeikaForm from '@my/containers/pages/Plan/Shienkeika/ShienkeikaForm';
import ShienkeikaRiyoushaSelectForm from '@my/containers/pages/Plan/Shienkeika/ShienkeikaRiyoushaSelectForm';
import { useHistory } from 'react-router';
import PrintCsvButton from '@my/components/atomic/PrintCsvButton';
import { useConfirm } from '@my/components/atomic/ConfirmDialog';
import { RootState, useTypedSelector } from '@my/stores';
import Label from '@my/components/atomic/Label';

const StyledGeneralIconButton = styled(GeneralIconButton)`
  margin-right: 5px;
` as typeof GeneralIconButton;

const StyledDataDisplay = styled(DataDisplay)`
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
` as typeof DataDisplay;

type Props = {
  id: string;
  screen: ScreenID; // 介護データの場合は screenIDs.L1410_01 予防データの場合は screenIDs.L1420_01 を設定すること
};

type GridColumnData = EditableGridData & {
  serviceKind: LabelAndValue;
  shienKeikaDate: number;
  shienKeikaTime?: number;
  riyousha: LabelAndValue;
  tantouCareManager: LabelAndValue;
  koumoku?: string;
  naiyou?: string;
  kasan?: LabelAndValue[];
  isHoumon?: boolean;
  youshiki: string; // 1:厚労省様式、2:東京都様式
};

type modeType = 'add' | 'edit' | 'copy' | undefined;

const defaultData: GridColumnData[] = [
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 1924959599000,
    shienKeikaTime: 53999000,
    riyousha: { label: '１２３４５６７８９１１２３４５', value: '10001' },
    tantouCareManager: { label: '１２３４５６７８９１１２３４５', value: '90001' },
    koumoku: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３',
    naiyou: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３１２３４５６７８９４',
    kasan: [{ label: '１２３４５６７８９１１２３４５', value: '1' }],
    isHoumon: true,
    youshiki: '1',
  },
  {
    serviceKind: { label: '予防', value: '46' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    youshiki: '1',
  },
  {
    serviceKind: { label: '予防', value: '46' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【予防相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    youshiki: '1',
  },
  {
    serviceKind: { label: '予防', value: '46' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【予防相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    isHoumon: true,
    youshiki: '1',
  },
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【介護相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    youshiki: '1',
  },
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【介護相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    youshiki: '1',
  },
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【介護相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    youshiki: '1',
  },
];

const defaultKaigoData: GridColumnData[] = [
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 1924959599000,
    shienKeikaTime: 53999000,
    riyousha: { label: '１２３４５６７８９１１２３４５', value: '10001' },
    tantouCareManager: { label: '１２３４５６７８９１１２３４５', value: '90001' },
    koumoku: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３',
    naiyou: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３１２３４５６７８９４',
    kasan: [{ label: '１２３４５６７８９１１２３４５', value: '1' }],
    isHoumon: true,
    youshiki: '1',
  },
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【介護相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    youshiki: '1',
  },
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【介護相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    youshiki: '1',
  },
  {
    serviceKind: { label: '介護', value: '43' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【介護相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    youshiki: '1',
  },
];

const defaultYobouData: GridColumnData[] = [
  {
    serviceKind: { label: '予防', value: '46' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    youshiki: '1',
  },
  {
    serviceKind: { label: '予防', value: '46' },
    shienKeikaDate: 315846000000,
    riyousha: { label: '１２３４５６７８９１１２３４５', value: '10001' },
    tantouCareManager: { label: '１２３４５６７８９１１２３４５', value: '90001' },
    koumoku: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３',
    naiyou: '１２３４５６７８９１１２３４５６７８９２１２３４５６７８９３１２３４５６７８９４',
    kasan: [{ label: '１２３４５６７８９１１２３４５', value: '1' }],
    youshiki: '2',
  },
  {
    serviceKind: { label: '予防', value: '46' },
    shienKeikaDate: 315846000000,
    shienKeikaTime: 53999000,
    riyousha: { label: '利用者　一郎', value: '10001' },
    tantouCareManager: { label: '日本　一郎', value: '90001' },
    koumoku: '【予防相談】',
    naiyou: '電話によりご本人から介護予防支援サービスの利用についての相談あり。',
    kasan: [
      { label: '初回加算', value: '1' },
      { label: '入院時情報連携加算Ⅰ', value: '2' },
    ],
    isHoumon: true,
    youshiki: '2',
  },
];

const getFormTitle = (isMode: modeType, isIkkatu: boolean) => {
  let riyoushaName = '';
  if (isIkkatu) {
    riyoushaName = '(日本　一郎)';
  }
  if (isMode === 'add' || isMode === 'copy') {
    return `支援経過追加 ${riyoushaName}`;
  }
  if (isMode === 'edit') {
    return `支援経過編集 ${riyoushaName}`;
  }
  return '';
};

// 日時フィルター
const shienKeikaDateFilterItems = [
  { value: '1', label: '訪問あり' },
  { value: '2', label: '訪問なし' },
];

// 区分フィルター
const serviceKindFilterItems = [
  { value: '43', label: '介護' },
  { value: '46', label: '予防' },
];

const Shienkeika: React.FC<Props> = (props: Props) => {
  const { id, screen } = props;

  const isKaigo = screen.id === screenIDs.L1410_01.id;
  const isYobou = screen.id === screenIDs.L1420_01.id;
  const isIkkatu = screen.id === screenIDs.L1430_01.id;

  const history = useHistory();
  const confirm = useConfirm();

  const currentRiyousha = useTypedSelector((state: RootState) => state.riyousha.currentRiyousha);
  const riyoushaSeq = currentRiyousha?.riyoushaSeq !== undefined ? currentRiyousha?.riyoushaSeq.toString() : '0';

  const defaultTantouCareManager = isIkkatu ? { value: '1', label: '日本　一郎' } : { value: '0', label: '全て' };

  const [serviceKindValue, setServiceKindValue] = useState<string>(isKaigo ? '43' : '46');
  const [startDateValue, setStartDateValue] = useState<Date | null>(isIkkatu ? DateUtils.calcDay(new Date(), -7) : DateUtils.calcMonth(new Date(), -1));
  const [endDateValue, setEndDateValue] = useState<Date | null>(new Date());
  const [tantouCareManagerValue, setTantouCareManagerValue] = useState<LabelAndValue | undefined>(defaultTantouCareManager);
  const [isOpenPrintModal, setIsOpenPrintModal] = useState<boolean>(false);
  const [isOpenCalendarModal, setIsOpenCalendarModal] = useState<boolean>(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
  const [isOpenRiyoushaSelectModal, setIsOpenRiyoushaSelectModal] = useState<boolean>(false);
  const [isMode, setIsMode] = useState<modeType>(undefined);

  // const getLoginKengenInfo = useGetLoginKengenInfo();
  // const kengenPath = getLoginKengenInfo(['plan', 'shienkeika']);

  // 各タブの権限状態
  // const readableKaigo = KengenUtils.isReadable(kengenPath[screenIDs.L1410_01.id]);
  // const readableYobou = KengenUtils.isReadable(kengenPath[screenIDs.L1420_01.id]);
  // const readableIkkatsu = KengenUtils.isReadable(kengenPath[screenIDs.L1430_01.id]);

  // 介護/予防 オプションボタン
  const serviceKindOptions = [
    { label: '介護', value: '43' },
    { label: '予防', value: '46' },
  ];
  const serviceKindHandleChange = (value: string) => {
    setServiceKindValue(value);
    const path = `/plan/shienkeika/kobetsu/${riyoushaSeq}/${value === '43' ? 'kaigo' : 'yobou'}`;
    history.push(path);
  };

  // 期間
  const startDateHandleChange = (value: Date | null) => {
    setStartDateValue(value);
  };
  const endtDateHandleChange = (value: Date | null) => {
    setEndDateValue(value);
  };

  // 担当ケアマネプルダウン
  const tantouCareManegerOptions: LabelAndValue[] = [
    { value: '0', label: '全て' },
    { value: '1', label: '日本　一郎' },
    { value: '2', label: '日本　二郎' },
  ];
  const tantouCareManagerHandleChange = (value?: LabelAndValue | Array<LabelAndValue>) => {
    if (value !== undefined && !Array.isArray(value)) {
      setTantouCareManagerValue(value);
    }
  };

  // 印刷ボタン押下時
  const printHandleClick = () => {
    console.log('印刷ボタン押下');
    setIsOpenPrintModal(true);
  };

  // CSVボタン押下時
  const excelDownloadHandleClick = () => {
    console.log('CSVボタン押下');
  };

  // 検索ボタン押下時
  const searchHandleClick = () => {
    console.log('検索ボタン押下');
  };

  // カレンダーアイコン
  const calendarIconHandleClick = () => {
    console.log('カレンダーボタン押下');
    setIsOpenCalendarModal(true);
  };

  // 編集ボタン押下時
  const handleClickEdit = (rowIndex: number) => {
    console.log(`編集ボタン押下 [${rowIndex}行目]`);
    setIsOpenEditModal(true);
    setIsMode('edit');
  };

  // 複製ボタン押下時
  const handleClickCopy = (rowIndex: number) => {
    console.log(`複製ボタン押下 [${rowIndex}行目]`);
    if (isIkkatu) {
      setIsOpenRiyoushaSelectModal(true);
    } else {
      setIsOpenEditModal(true);
    }
    setIsMode('copy');
  };

  // 行追加ボタン押下時
  const handleClickAdd = () => {
    console.log('行追加ボタン押下');
    if (isIkkatu) {
      setIsOpenRiyoushaSelectModal(true);
    } else {
      setIsOpenEditModal(true);
    }
    setIsMode('add');
  };

  // 行削除ボタン押下時
  const handleClickDelete = useCallback(async () => {
    console.log('行削除ボタン押下');
    const message = Messages.MESSAGE_0007('選択行');
    const isOk = await confirm({ message });
    if (!isOk) {
      return;
    }
    console.log('行削除処理');
  }, [confirm]);

  // 利用者選択後の動作
  const operationAfterRiyoushaSelect = (openEdit: boolean) => {
    setIsOpenRiyoushaSelectModal(false);
    if (openEdit) {
      setIsOpenEditModal(true);
    }
  };

  // 予防（厚労省様式）の場合は、項目列を非表示にする
  let displayKoumoku = true;
  if (isYobou && defaultData.length) {
    const { youshiki } = isKaigo ? defaultKaigoData[0] : isYobou ? defaultYobouData[0] : defaultData[0]; // TODO: 実装時は action-hooks の状態で切り替える
    if (youshiki === '1') {
      displayKoumoku = false;
    }
  }

  // リスト
  const columns: DataGridColumn<GridColumnData>[] = React.useMemo((): DataGridColumn<GridColumnData>[] => {
    const commonColumns: DataGridColumn<GridColumnData>[] = [];

    if (isIkkatu) {
      commonColumns.push({
        Header: '利用者名',
        accessor: 'riyousha',
        width: 1,
        minWidth: 100,
        maxWidth: 170,
        Filter: TextColumnFilter,
        Cell: ({ value }: CellProps<GridColumnData, LabelAndValue>) => {
          const { label } = value;
          return (
            <div>
              <StyledDataDisplay id={`${id}-riyousha-name`} value={label} />
            </div>
          );
        },
      });
    }

    commonColumns.push({
      Header: '日時',
      accessor: 'shienKeikaDate',
      fixed: true,
      width: 230,
      typeAll: shienKeikaDateFilterItems,
      forceTypeAllOnly: true,
      filter: includesSomeFilterType,
      Filter: DataKindColumnFilter,
      Cell: ({ row: { original }, value }: CellProps<GridColumnData, number>) => {
        const { isHoumon, shienKeikaTime } = original;
        return (
          <div>
            <Grid container alignItems="center">
              <Grid item>
                <DataDisplay id={`${id}-homon-date`} type="date" value={value} />
              </Grid>
              {(shienKeikaTime || shienKeikaTime === 0) && (
                <Grid item>
                  <Box ml={1}>
                    <DataDisplay id={`${id}-homon-time`} type="time" value={shienKeikaTime} />
                  </Box>
                </Grid>
              )}
              {isHoumon && (
                <Grid item>
                  <Box ml={1}>
                    <Chip id={`${id}-homon-date-time-chip`} label="訪問" size="small" style={{ backgroundColor: '#1976D2', color: '#FFFFFF' }} />
                  </Box>
                </Grid>
              )}
            </Grid>
          </div>
        );
      },
    });

    if (isIkkatu) {
      commonColumns.push({
        Header: '区分',
        accessor: 'serviceKind',
        fixed: true,
        width: 60,
        disableSortBy: true,
        typeAll: serviceKindFilterItems,
        forceTypeAllOnly: true,
        filter: includesSomeFilterType,
        Filter: DataKindColumnFilter,
        Cell: ({ value }: CellProps<GridColumnData, LabelAndValue>) => {
          const { label } = value;
          return (
            <div style={{ textAlign: 'center' }}>
              <DataDisplay id={`${id}-serviceKind-name`} value={label} />
            </div>
          );
        },
      });
    }

    if (tantouCareManagerValue?.value === '0') {
      commonColumns.push({
        Header: '担当ケアマネ',
        accessor: 'tantouCareManager',
        width: 1,
        minWidth: 100,
        maxWidth: 170,
        disableSortBy: true,
        Cell: ({ value }: CellProps<GridColumnData, LabelAndValue>) => {
          const { label } = value;
          return (
            <div>
              <StyledDataDisplay id={`${id}-tantou-care-manager-name`} value={label} />
            </div>
          );
        },
      });
    }

    if (displayKoumoku) {
      commonColumns.push({
        Header: '項目',
        accessor: 'koumoku',
        width: 1,
        minWidth: 170,
        maxWidth: 2000,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const { serviceKind, youshiki } = original;
          const hide = serviceKind.value === '46' && youshiki === '1';
          return <div>{hide ? <></> : <StyledDataDisplay id={`${id}-koumoku`} value={value} />}</div>;
        },
      });
    }

    commonColumns.push(
      {
        Header: '内容',
        accessor: 'naiyou',
        width: 2.5,
        minWidth: 170,
        maxWidth: 2000,
        disableSortBy: true,
      },
      {
        Header: '加算',
        accessor: 'kasan',
        width: 1,
        minWidth: 160,
        maxWidth: 200,
        disableSortBy: true,
        Cell: ({ value: datas }: CellProps<GridColumnData, LabelAndValue[]>) => {
          if (datas === undefined || !datas.length) {
            return <></>;
          }
          return (
            <div>
              {datas.map((d) => {
                return <DataDisplay id={`${id}-kasan-name`} value={d.label} />;
              })}
            </div>
          );
        },
      }
    );

    return commonColumns;
  }, [displayKoumoku, id, isIkkatu, tantouCareManagerValue]);

  const dataGridValues = useEditableDataGrid<GridColumnData>({
    rowSelect: 'multiple',
    sortable: true,
    defaultData: isKaigo ? defaultKaigoData : isYobou ? defaultYobouData : defaultData, // TODO: 実装時は action-hooks の状態で切り替える
  });

  return (
    <Box mt={1}>
      {isOpenCalendarModal && <ShienkeikaNextHoumonDateTimeEdit id={`${id}-next-houmon-datetime`} setIsOpenModal={setIsOpenCalendarModal} />}
      {isOpenPrintModal && <ShienkeikaPrint id={`${id}-print`} setIsOpenModal={setIsOpenPrintModal} />}
      {isOpenRiyoushaSelectModal && <ShienkeikaRiyoushaSelectForm id={`${id}-riyousha-select`} operationAfterRiyoushaSelect={operationAfterRiyoushaSelect} />}
      {isOpenEditModal && <ShienkeikaForm id={`${id}-form`} setIsOpenModal={setIsOpenEditModal} title={getFormTitle(isMode, isIkkatu)} isKaigo={isKaigo} isYobou={isYobou} isIkkatu={isIkkatu} />}
      <Box ml={1} mr={1} mt={2}>
        <Grid container direction="row" alignItems="center" spacing={2}>
          {!isIkkatu && (
            <Grid item md={2}>
              <OptionButton id={`${id}-servicekind`} name="servicekind" options={serviceKindOptions} value={serviceKindValue} onChange={serviceKindHandleChange} />
            </Grid>
          )}
          <Grid item md={isIkkatu ? 10 : 8}>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <Box ml={2}>
                  <CalendarInput id={`${id}-startDate`} name="startDate" value={startDateValue} onChange={startDateHandleChange} />
                </Box>
              </Grid>
              <Grid item>
                <Box ml={2}>～</Box>
              </Grid>
              <Grid item>
                <Box ml={2}>
                  <CalendarInput id={`${id}-endDate`} name="endDate" value={endDateValue} onChange={endtDateHandleChange} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={2} justify="flex-end">
            <Grid container direction="row" justify="flex-end">
              <Grid item>
                {isIkkatu ? (
                  <PrintCsvButton id={`${id}_print-csv-btn`} onClick={excelDownloadHandleClick} />
                ) : (
                  <GeneralIconButton icon="print" id={`${id}-print-btn`} onClick={printHandleClick} disabled={false}>
                    印刷
                  </GeneralIconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item md={4} lg={3}>
            <ComboBoxField
              id={`${id}-tantou-care-manager`}
              name="tantouCareManager"
              label="担当ケアマネ"
              labelWidth={100}
              options={tantouCareManegerOptions}
              value={tantouCareManagerValue}
              onChange={tantouCareManagerHandleChange}
              clearable={false}
            />
          </Grid>
          <Grid item md={6} lg={4}>
            <TextInputField id={`${id}-searchText`} name="searchText" type="text" label="検索条件" labelWidth={80} placeholder="複数の場合はスペースで区切ってください。" />
          </Grid>
          <Grid item md={2}>
            <GeneralIconButton icon="search" id={`${id}-search-btn`} onClick={searchHandleClick} disabled={false}>
              検索
            </GeneralIconButton>
          </Grid>
        </Grid>
        {!isIkkatu && (
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item md={9} lg={9}>
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item>
                  <Label id={`${id}-zenkai-houmon-date-time-label`}>前回訪問日時</Label>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <DataDisplay id={`${id}-zenkai-houmon-date`} type="date" value={1661932800000} />
                    </Grid>
                    <Grid item>
                      <Box ml={1}>
                        <DataDisplay id={`${id}-zenkai-houmon-time`} type="time" value={53999000} />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Box width={30} />
                </Grid>
                <Grid item>
                  <Label id={`${id}-zenkai-houmon-date-time-label`}>次回訪問日時</Label>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <DataDisplay id={`${id}-next-houmon-date`} type="date" value={1672475400000} />
                    </Grid>
                    <Grid item>
                      <Box ml={1}>
                        <DataDisplay id={`${id}-next-houmon-time`} type="time" value={53999000} />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <IconButton id={`${id}-calendar-icon`} onClick={calendarIconHandleClick}>
                    <CalendarIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={3} lg={3}>
              <Grid container direction="row" alignItems="center" justify="flex-end" spacing={1}>
                <Grid item>
                  <StyledGeneralIconButton icon="add" id={`${id}-add-row-button-header`} onClick={handleClickAdd}>
                    行追加
                  </StyledGeneralIconButton>
                  <GeneralIconButton icon="delete" id={`${id}-remove-row-button-header`} onClick={handleClickDelete}>
                    行削除
                  </GeneralIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
        {isIkkatu && (
          <Grid container direction="row" alignItems="center" justify="flex-end" spacing={1}>
            <Grid item>
              <StyledGeneralIconButton icon="add" id={`${id}-add-row-button-header`} onClick={handleClickAdd}>
                行追加
              </StyledGeneralIconButton>
              <GeneralIconButton icon="delete" id={`${id}-remove-row-button-header`} onClick={handleClickDelete}>
                行削除
              </GeneralIconButton>
            </Grid>
          </Grid>
        )}
        <Box mb={1} />
        <DataGrid id={`${id}-data-grid`} columns={columns} minHeight={330} heightOffset={isIkkatu ? 360 : 380} {...dataGridValues} onClickEdit={handleClickEdit} onClickCopy={handleClickCopy} />
      </Box>
    </Box>
  );
};

export default Shienkeika;
