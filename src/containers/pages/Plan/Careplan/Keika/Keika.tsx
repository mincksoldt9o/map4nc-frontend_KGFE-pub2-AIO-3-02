import React from 'react';
import styled from 'styled-components';
import { Container, Box, Grid, Badge } from '@material-ui/core';
import { DataGrid, DataGridColumn, EditableCellProps, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import TextInputField from '@my/components/molecules/TextInputField';
import PrintPreviewButton from '@my/components/atomic/PrintPreviewButton';
import PrintPdfButton from '@my/components/atomic/PrintPdfButton';
import PrintExcelButton from '@my/components/atomic/PrintExcelButton';
import CalendarInput from '@my/components/molecules/CalendarInput';
import TextInput from '@my/components/atomic/TextInput';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';

const StyledContainer = styled(Container)`
  padding: 0 0 1.5em 0;
` as typeof Container;

type GridColumnData = EditableGridData & {
  day?: Date | null;
  title?: string;
  naiyou?: string;
};

const defaultData: GridColumnData[] = [
  {
    day: null,
  },
];

const Keika: React.FC = () => {
  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '年月日',
        accessor: 'day',
        width: 1,
        minWidth: 100,
        maxWidth: 300,
        Cell: ({ row: { index, original }, value, updateCellValues }: EditableCellProps<GridColumnData, Date | null>) => {
          const [val, setVal] = React.useState(value);
          React.useEffect(() => {
            setVal(value);
          }, [value]);
          return (
            <>
              <Box maxWidth={170}>
                <CalendarInput
                  id={`row.${index}.day`}
                  name={`row[${index}].day`}
                  value={val}
                  variant="table"
                  onChange={(v) => {
                    setVal(v);
                  }}
                />
              </Box>
              <TextInput
                id={`row.${index}.title`}
                name={`row[${index}].title`}
                type="textarea"
                rowsMin={4}
                value={original.title}
                fullWidth
                onChange={(v) => {
                  updateCellValues(index, [{ accessor: 'title', value: v }]);
                }}
              />
            </>
          );
        },
      },
      {
        Header: '内容',
        accessor: 'naiyou',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        Cell: ({ row: { index }, value }: EditableCellProps<GridColumnData, string>) => {
          const [val, setVal] = React.useState(value);
          React.useEffect(() => {
            setVal(value);
          }, [value]);
          return (
            <>
              <TextInput
                id={`row.${index}.title`}
                name={`row[${index}].title`}
                type="textarea"
                rowsMin={4}
                value={val}
                fullWidth
                onChange={(v) => {
                  setVal(v);
                }}
              />
            </>
          );
        },
      },
    ],
    []
  );

  const dataGridValues = useEditableDataGrid<GridColumnData>({
    defaultData,
    draggable: true,
  });

  const {
    append,
    // move,
    remove,
    // insert,
    // selectedRows,
    // sortedBy,
    // data: records,
    // isDirty,
    // onSelectedRowChange: setSelectedRow,
    // onFilterChange: setFilter,
    // onSortByChange: setSortBy,
    // hasDataError,
  } = dataGridValues;

  const handleClickDelete = React.useCallback(
    (rowIndex: number) => {
      remove(rowIndex);
    },
    [remove]
  );

  const handleAddRow = () => {
    append({
      day: null,
    });
  };

  const handleSubmitForm = () => {
    // TODO
  };

  // // 作成者コンボボックス
  // const [sakuseiNameValue, setSakuseiNameValue] = React.useState<LabelAndValue>({ label: '作成 一郎', value: '1' });
  // const sakuseiNameOptionHandleChange = (sakuseiNameOptionValue: LabelAndValue | LabelAndValue[] | undefined) => {
  //   if (sakuseiNameOptionValue && !Array.isArray(sakuseiNameOptionValue)) {
  //     setSakuseiNameValue(sakuseiNameOptionValue);
  //   }
  // };
  // const sakuseiNameOptions = [
  //   { label: '作成 一郎', value: '1' },
  //   { label: '作成 二郎', value: '2' },
  // ];

  // 利用者名コンボボックス
  const [riyoushaNameValue, setRiyoushaNameValue] = React.useState<LabelAndValue>({ label: '利用者　一郎', value: '1' });
  const riyoushaNameOptionHandleChange = (riyoushaNameOptionValue: LabelAndValue | LabelAndValue[] | undefined) => {
    if (riyoushaNameOptionValue && !Array.isArray(riyoushaNameOptionValue)) {
      setRiyoushaNameValue(riyoushaNameOptionValue);
    }
  };
  const riyoushaNameOptions = [
    { label: '利用者　一郎', value: '1' },
    { label: '利用者　二郎', value: '2' },
  ];

  // 居宅サービス計画作成者氏名コンボボックス
  const [planSakuseiNameValue, setPlanSakuseiNameValue] = React.useState<LabelAndValue>({ label: '計画作成　一郎', value: '1' });
  const planSakuseiNameOptionHandleChange = (planSakuseiNameOptionValue: LabelAndValue | LabelAndValue[] | undefined) => {
    if (planSakuseiNameOptionValue && !Array.isArray(planSakuseiNameOptionValue)) {
      setPlanSakuseiNameValue(planSakuseiNameOptionValue);
    }
  };
  const planSakuseiNameOptions = [
    { label: '計画作成　一郎', value: '1' },
    { label: '計画作成　二郎', value: '2' },
  ];

  return (
    <StyledContainer maxWidth={false}>
      {/* 居宅介護支援経過タブ直下 */}
      <Box mt={2} ml={1} mr={1}>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item>
                <Box ml={1}>
                  <CalendarInputField id="sakusei-date" name="sakuseiDate" label="作成年月日" required defaultValue={new Date()} variant="table" />
                </Box>
              </Grid>
              <Grid item>
                <Box mx={1}>
                  <Badge badgeContent={5} color="secondary">
                    <GeneralIconButton icon="search" id="search-button" size="small">
                      履歴検索
                    </GeneralIconButton>
                  </Badge>
                </Box>
              </Grid>
              {/* <Grid item>
                <Box mx={1}>
                  <ComboBoxField
                    id="sakusei-name"
                    name="sakuseiName"
                    label="作成者"
                    options={sakuseiNameOptions}
                    value={sakuseiNameValue}
                    onChange={sakuseiNameOptionHandleChange}
                    required
                    clearable={false}
                    minWidth={220}
                    variant="table"
                  />
                </Box>
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item>
            <Box mt={0.3}>
              <GeneralIconButton icon="add" id="create-button" size="small">
                新規計画書を作成する
              </GeneralIconButton>
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Box ml={1} minWidth={450}>
              <TextInputField id="memo" name="memo" type="text" label="メモ" fullWidth required maxLength={60} variant="table" />
            </Box>
          </Grid>
          <Grid item>
            <Grid item>
              <Box display="flex" justifyContent="right" minWidth={460}>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <PrintPreviewButton id="PrintPreviewButton" onClick={() => console.log('print')} />
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" ml={2}>
                  <PrintPdfButton id="PrintPdfButton" onClick={() => console.log('print')} />
                </Box>
                <Box display="flex" alignItems="center" justifyContent="center" ml={2}>
                  <PrintExcelButton id="PrintExcelButton" onClick={() => console.log('print')} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box m={1}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item>
            <Box ml={1}>
              <ComboBoxField
                id="riyousha-name"
                name="riyoushaName"
                label="利用者名"
                options={riyoushaNameOptions}
                value={riyoushaNameValue}
                onChange={riyoushaNameOptionHandleChange}
                clearable={false}
                minWidth={220}
                variant="table"
              />
            </Box>
          </Grid>
          <Grid item>
            <Box ml={1}>
              <ComboBoxField
                id="kyotaku-service-plan-sakuseisha-name"
                name="kyotakuServicePlanSakuseishaName"
                label="居宅サービス計画作成者氏名"
                options={planSakuseiNameOptions}
                value={planSakuseiNameValue}
                onChange={planSakuseiNameOptionHandleChange}
                clearable={false}
                minWidth={220}
                variant="table"
                labelWidth={200}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item>
            <Box ml={1}>
              <GeneralIconButton icon="add" id="add-row-button-header" size="small" onClick={handleAddRow}>
                行追加
              </GeneralIconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box m={1}>
        {/* max 5行表示 min 3行表示 */}
        <DataGrid id="details" columns={columns} minHeight={510} heightOffset={145} {...dataGridValues} onClickDelete={handleClickDelete} />
      </Box>
      <Box mt={1}>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Grid item>
            <Box ml={1}>
              <GeneralIconButton icon="add" id="add-row-button-footer" size="small" onClick={handleAddRow}>
                行追加
              </GeneralIconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <GeneralIconFloatingActionButton id="kaigi-form-submit-button" icon="register" onClick={handleSubmitForm}>
        登録
      </GeneralIconFloatingActionButton>
    </StyledContainer>
  );
};

export default Keika;
