import React from 'react';
import Dialog, { DialogActions, DialogContent } from '@my/components/atomic/Dialog';
import { CellProps, DataGrid, DataGridColumn, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import { Container, Grid } from '@material-ui/core';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel/GlobalMessagePanel';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import DataDisplay from '@my/components/atomic/DataDisplay';
import ComboBoxField from '@my/components/molecules/ComboBoxField';

type Props = {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type GridColumnData = EditableGridData & {
  target: string;
  periodFrom: number;
  periodTo: number;
};

const defaultData: GridColumnData[] = [
  {
    target: '歩行器を使わないでベッドからトイレまで歩けるようになる。',
    periodFrom: new Date(2022, 5, 26, 10, 0, 0).getTime(),
    periodTo: new Date(2022, 5, 27, 10, 0, 0).getTime(),
  },
  {
    target: '歩行器を使わないでベッドからトイレまで歩けるようになる。',
    periodFrom: new Date(2022, 6, 26, 10, 0, 0).getTime(),
    periodTo: new Date(2022, 6, 28, 10, 0, 0).getTime(),
  },
];

const ImportDialog: React.FC<Props> = (props: Props) => {
  const { setIsDialogOpen } = props;
  // TODO
  const screenId = 'dummy';
  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '目標',
        accessor: 'target',
        width: 1,
        minWidth: 200,
        maxWidth: 2000,
      },
      {
        Header: '期間',
        accessor: 'periodFrom',
        fixed: true,
        width: 150,
        Cell: ({ row: { index, original } }: CellProps<GridColumnData, number>) => {
          return (
            <Grid container direction="column" justify="flex-start">
              <Grid item>
                <DataDisplay id={`data.${index}.periodFrom`} type="date" value={original.periodFrom} />
              </Grid>
              <Grid item>～</Grid>
              <Grid item>
                <DataDisplay id={`data.${index}.periodTo`} type="date" value={original.periodTo} />
              </Grid>
            </Grid>
          );
        },
      },
    ],
    []
  );

  const dataGridValues = useEditableDataGrid<GridColumnData>({
    defaultData,
  });

  const handleSubmitForm = () => {
    setIsDialogOpen(false);
  };

  /** 戻るボタンをクリックした時の処理 */
  const handleClickReturn = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open variant="simple" title="支援計画書取り込み" onClickReturn={handleClickReturn} fullWidth fullHeight selfContentAndActions>
      <DialogContent>
        <Container maxWidth={false}>
          <GlobalMessagePanel screenID={screenId} />
        </Container>

        <LayoutForm id="rireki-form">
          <LayoutItem variant="1-item-full">
            <ComboBoxField
              id="create-date"
              name="createDate"
              label="作成日"
              labelWidth={120}
              options={[
                { label: '[厚労省]令和02年06月01日　メモ', value: '1' },
                { label: '[東京都]令和02年06月01日　メモ', value: '2' },
              ]}
              defaultValue={{ label: '[厚労省]令和02年06月01日　メモ', value: '1' }}
              required
              clearable={false}
              minWidth={220}
              variant="table"
            />
          </LayoutItem>
          <LayoutItem variant="1-item-full">
            <DataGrid id="details" columns={columns} minHeight={300} heightOffset={350} {...dataGridValues} />
          </LayoutItem>
        </LayoutForm>
      </DialogContent>

      <DialogActions>
        <GeneralIconButton icon="register" id="rireki-save-button" onClick={handleSubmitForm}>
          決定
        </GeneralIconButton>
      </DialogActions>
    </Dialog>
  );
};

export default ImportDialog;
