import React from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { Box, Grid, Table, TableBody, TableContainer, TableRow } from '@material-ui/core';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import TextInput from '@my/components/atomic/TextInput';
import { DataGrid, DataGridColumn, EditableCellProps, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';

const StyledTableRow = styled(TableRow)`
  & > .MuiTableCell-root {
    padding: 0px;
  }
`;

export type Props = {
  id: string;
  defaultValues?: CarePreventionInputFormType;
};

export type CarePreventionInputFormType = {};

type GridColumnData = EditableGridData & {
  time: string;
  himself: string;
  caregiver: string;
};

const imamadeSeikatsuName = 'imamadeSeikatsu';
const oneDaySeikatsuName = 'oneDaySeikatsu';
const shumiTanoshimiTokugiName = 'shumiTanoshimiTokugi';
const yujinChiikiKankeiName = 'yujinChiikiKankei';

const CarePreventionInputForm: React.FC<Props> = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, defaultValues } = props;

  const { control } = useFormContext();
  const data: GridColumnData[] = React.useMemo(
    (): GridColumnData[] =>
      [...Array(8)].map(() => {
        return {
          time: '',
          himself: '',
          caregiver: '',
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }),
    []
  );

  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '時間',
        accessor: 'time',
        fixed: true,
        width: 120,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`seikatsuJoukyouTime${index + 1}`}
              name={`seikatsuJoukyouTime${index + 1}`}
              control={control}
              maxLength={10}
              type="text"
              value={original.time}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'time', value: v }]);
              }}
            />
          );
        },
      },
      {
        Header: '本人',
        accessor: 'himself',
        width: 1,
        minWidth: 300,
        maxWidth: 2000,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.himself`}
              name={`seikatsuJoukyouHonnin${index + 1}`}
              control={control}
              maxLength={17}
              type="text"
              value={original.himself}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'himself', value: v }]);
              }}
            />
          );
        },
      },
      {
        Header: '介護者・家族',
        accessor: 'caregiver',
        width: 1,
        minWidth: 280,
        maxWidth: 2000,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.caregiver`}
              name={`seikatsuJoukyouFamily${index + 1}`}
              control={control}
              maxLength={17}
              type="text"
              value={original.caregiver}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'caregiver', value: v }]);
              }}
            />
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const dataGridValues = useEditableDataGrid<GridColumnData>({
    defaultData: data,
  });

  return (
    <>
      <Box mt={1} ml={1} mr={1}>
        <LayoutForm>
          <LayoutItem variant="1-item-full">
            <TableContainer>
              <Table aria-label="table1">
                <TableBody>
                  <StyledTableRow>
                    <HeaderCell style={{ width: '110px', minWidth: '110px' }}>今までの生活</HeaderCell>
                    <BodyCell colSpan={4} bl bt br>
                      <TextInput id="imamadeSeikatsu" name={imamadeSeikatsuName} control={control} type="textarea" variant="table" rowsMin={3} rowsMax={3} maxLength={117} fullWidth />
                    </BodyCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <HeaderCell rowSpan={4}>現在の生活状況(どんな暮らしを送っていますか)</HeaderCell>
                    <BodyCell bl align="center">
                      一日の生活・すごし方
                    </BodyCell>
                    <BodyCell align="center" rowSpan={4} bl br style={{ verticalAlign: 'top', minWidth: '200px' }}>
                      <Grid container direction="column" justify="flex-start">
                        <Grid item style={{ height: '21px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                          趣味・楽しみ・特技
                        </Grid>
                        <Grid item>
                          <TextInput id="shumiTanoshimiTokugi" name={shumiTanoshimiTokugiName} control={control} maxLength={119} type="textarea" variant="table" rowsMin={7} rowsMax={7} fullWidth />
                        </Grid>
                        <Grid item style={{ height: '21px', borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                          友人・地域との関係
                        </Grid>
                        <Grid item>
                          <TextInput id="yujinChiikiKankei" name={yujinChiikiKankeiName} control={control} maxLength={102} type="textarea" variant="table" rowsMin={6} rowsMax={6} fullWidth />
                        </Grid>
                      </Grid>
                    </BodyCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <BodyCell bl br>
                      <TextInput id="daily-life" name={oneDaySeikatsuName} control={control} maxLength={66} type="textarea" variant="table" rowsMin={7} rowsMax={7} fullWidth />
                    </BodyCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <BodyCell rowSpan={2} bl>
                      <Box minWidth={750}>
                        <LayoutItem variant="1-item-full">
                          <DataGrid id="timetable" columns={columns} minHeight={360} {...dataGridValues} />
                        </LayoutItem>
                      </Box>
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

export default CarePreventionInputForm;
