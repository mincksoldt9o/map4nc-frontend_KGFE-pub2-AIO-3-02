import React from 'react';
import Dialog, { DialogActions, DialogContent } from '@my/components/atomic/Dialog';
import { CellProps, DataGrid, DataGridColumn, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import { Container, Grid } from '@material-ui/core';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel/GlobalMessagePanel';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import DataDisplay from '@my/components/atomic/DataDisplay';

type Props = {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type GridColumnData = EditableGridData & {
  shortTermGoals: string;
  periodFrom: number;
  periodTo: number;
};

const defaultData: GridColumnData[] = [
  {
    shortTermGoals: 'あいうえおあいうえお',
    periodFrom: new Date(2020, 4, 6).getTime(),
    periodTo: new Date(2020, 10, 22).getTime(),
  },
];

const ImportDialog: React.FC<Props> = (props: Props) => {
  const { setIsDialogOpen } = props;
  // TODO
  const screenId = 'dummy';
  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '短期目標',
        accessor: 'shortTermGoals',
        width: 1,
        minWidth: 100,
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
    <Dialog open variant="simple" title="居宅サービス計画書(2)取り込み" onClickReturn={handleClickReturn} selfContentAndActions>
      <DialogContent>
        <Container maxWidth={false}>
          <GlobalMessagePanel screenID={screenId} />
        </Container>

        <LayoutForm id="rireki-form">
          <LayoutItem variant="1-item-full">
            <ComboBoxField
              id="plan-name"
              name="planName"
              label="作成日"
              labelWidth={80}
              options={[
                { label: '令和4年4月21日 メモ', value: '1' },
                { label: '令和4年4月28日 メモ', value: '2' },
              ]}
              defaultValue={{ label: '令和04年04月28日 メモ', value: '2' }}
              clearable={false}
              minWidth={250}
              variant="table"
            />
          </LayoutItem>
          <LayoutItem variant="1-item-full">
            <DataGrid id="details" columns={columns} minHeight={200} heightOffset={400} {...dataGridValues} />
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
