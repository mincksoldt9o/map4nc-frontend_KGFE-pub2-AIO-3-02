import React from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { Box, Grid, Table, TableBody, TableContainer, TableRow } from '@material-ui/core';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import TextInput from '@my/components/atomic/TextInput';
import { DataGrid, DataGridColumn, EditableCellProps, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import CalendarInput from '@my/components/molecules/CalendarInput';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import OptionButton from '@my/components/atomic/OptionButton';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import { LabelAndValue, PlanKihonKioureki } from 'maps4nc-frontend-web-api/dist/lib/model';
import ComboBoxField from '@my/components/molecules/ComboBoxField';

const StyledTableRow = styled(TableRow)`
  & > .MuiTableCell-root {
    padding: 0px;
  }
`;

export type Props = {
  id: string;
  defaultValues?: PlanKihonKioureki[];
};

type GridColumnData = EditableGridData & PlanKihonKioureki & { keikaKbnValue?: LabelAndValue };

const elapsedOptions = [
  { label: '治療中', value: '1' },
  { label: '経過観察中', value: '2' },
  { label: 'その他', value: '3' },
];

const CurrentMedicalHistoryInputForm: React.FC<Props> = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultValues } = props;
  const { control } = useFormContext();

  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '年月日',
        accessor: 'hasshoujiki',
        fixed: true,
        width: 150,
        Cell: ({ row: { index }, value }: EditableCellProps<GridColumnData, Date | null>) => {
          const [val, setVal] = React.useState(value);
          React.useEffect(() => {
            setVal(value);
          }, [value]);
          return (
            <CalendarInput
              id={`row.${index}.hasshoujikiTime`}
              name={`kihonKioureki[${index}].hasshoujikiTime`}
              control={control}
              value={val}
              variant="grid"
              onChange={(v) => {
                setVal(v);
              }}
            />
          );
        },
      },
      {
        Header: '病名',
        accessor: 'byoumeiName',
        width: 1,
        minWidth: 150,
        maxWidth: 200,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.byoumeiName`}
              name={`kihonKioureki[${index}].byoumeiName`}
              maxLength={28}
              control={control}
              type="textarea"
              rowsMin={2}
              rowsMax={2}
              value={original.byoumeiName}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'byoumeiName', value: v }]);
              }}
            />
          );
        },
      },
      {
        Header: '医療機関',
        accessor: 'iryoukikanName',
        width: 1,
        minWidth: 160,
        maxWidth: 200,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.iryoukikanName`}
              name={`kihonKioureki[${index}].iryoukikanName`}
              maxLength={50}
              control={control}
              type="text"
              value={original.iryoukikanName}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'iryoukikanName', value: v }]);
              }}
              autoCompleteOptions={['セコメディック病院', '徳洲会病院']}
            />
          );
        },
      },
      {
        Header: '医師名',
        accessor: 'doctorName',
        width: 1,
        minWidth: 140,
        maxWidth: 200,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.doctor-name`}
              name={`kihonKioureki[${index}].doctorName`}
              maxLength={20}
              control={control}
              type="text"
              value={original.doctorName}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'doctorName', value: v }]);
              }}
              autoCompleteOptions={['直江　康介', '間黒　男']}
            />
          );
        },
      },
      {
        Header: '主治医意見作成者',
        accessor: 'isShuDoctor',
        fixed: true,
        width: 90,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, boolean>) => {
          return (
            <OptionButton
              id={`row.${index}.isShuDoctor`}
              name={`kihonKioureki[${index}].isShuDoctor`}
              control={control}
              options={[
                { label: '', value: 'false' },
                { label: '☆', value: 'true' },
              ]}
              value={original.isShuDoctor ? 'true' : 'false'}
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'isShuDoctor', value: v === 'true' }]);
              }}
            />
          );
        },
      },

      {
        Header: '電話番号',
        accessor: 'tel',
        fixed: true,
        width: 150,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.tel`}
              name={`kihonKioureki[${index}].tel`}
              control={control}
              type="tel"
              value={original.tel}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'tel', value: v }]);
              }}
              autoCompleteOptions={['090-1111-2222', '090-2222-3333']}
            />
          );
        },
      },
      {
        Header: '経過',
        accessor: 'keikaKbnValue',
        fixed: true,
        width: 220,
        Cell: ({ row: { index } }: EditableCellProps<GridColumnData, string[] | undefined>) => {
          return (
            <Box marginLeft="20px">
              <ComboBoxField
                id={`row.${index}.keikaKbnValue`}
                name={`kihonKioureki[${index}].keikaKbnValue`}
                control={control}
                labelWidth={0}
                options={elapsedOptions}
                variant="table"
                placeholder=""
                minWidth={130}
              />
            </Box>
          );
        },
      },
      {
        Header: '治療中の場合の内容',
        accessor: 'chiryouNaiyou',
        width: 1,
        minWidth: 200,
        maxWidth: 2000,
        Cell: ({ row: { index }, value, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.chiryouNaiyou`}
              name={`kihonKioureki[${index}].chiryouNaiyou`}
              control={control}
              type="textarea"
              rowsMin={2}
              rowsMax={2}
              value={value}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'chiryouNaiyou', value: v }]);
              }}
            />
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const transformData = function (edit: PlanKihonKioureki[] | []): GridColumnData[] {
    if (!edit.length) {
      return [];
    }
    return [];
    // return edit.map((emergencyContact: PlanKihonKioureki) => ({
    //   ...emergencyContact,
    //   hasshoujikiTime: new Date(),
    //   keikaKbnValue: elapsedOptions.find((item: LabelAndValue) => {
    //     return item.value === '1';
    //   }),
    // }));
  };
  const defaultDataGridData: GridColumnData[] = React.useMemo((): GridColumnData[] => transformData(defaultValues || []), [defaultValues]);

  const dataGridValues = useEditableDataGrid<GridColumnData>({
    defaultData: defaultDataGridData,
    rowSelect: 'multiple',
  });

  const { append, remove } = dataGridValues;

  const handleClickDelete = React.useCallback(
    (rowIndex: number) => {
      remove(rowIndex);
    },
    [remove]
  );

  const handleAddRow = () => {
    append({
      isShuDoctor: false,
      displayOrder: 1,
    });
  };

  return (
    <>
      <Box mt={1} ml={1} mr={1}>
        <Grid container direction="row" justify="flex-end">
          <Grid item>
            <Box ml={1}>
              <GeneralIconButton icon="add" id="add-row-button-header" size="small" onClick={handleAddRow}>
                行追加
              </GeneralIconButton>
            </Box>
          </Grid>
        </Grid>
        <LayoutForm>
          <LayoutItem variant="1-item-full">
            {/* max 5行表示 min 3行表示 */}
            <DataGrid id="details" columns={columns} minHeight={210} heightOffset={570} {...dataGridValues} onClickDelete={handleClickDelete} />
          </LayoutItem>
          <LayoutItem variant="1-item-full">
            <TableContainer>
              <Table aria-label="table1">
                <TableBody>
                  <StyledTableRow>
                    <HeaderCell align="left">公的サービス</HeaderCell>
                    <HeaderCell align="left">非公的サービス</HeaderCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <BodyCell bl br>
                      <TextInput id="public-service" name="koutekiService" control={control} type="textarea" variant="table" rowsMin={3} rowsMax={3} fullWidth />
                    </BodyCell>
                    <BodyCell bl br>
                      <TextInput id="unpublic-service" name="hikoutekiService" control={control} type="textarea" variant="table" rowsMin={3} rowsMax={3} fullWidth />
                    </BodyCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </LayoutItem>
        </LayoutForm>
      </Box>
    </>
  );
};

export default CurrentMedicalHistoryInputForm;
