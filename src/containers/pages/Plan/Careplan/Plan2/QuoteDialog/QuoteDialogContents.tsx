import React from 'react';
import { useForm } from 'react-hook-form';
import { DialogActions, DialogContent } from '@my/components/atomic/Dialog';
import { CellProps, DataGrid, DataGridColumn, EditableGridData, useEditableDataGrid, toDataGridIndexNumberArray } from '@my/components/molecules/DataGrid';
import { Box, Container, Grid } from '@material-ui/core';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel/GlobalMessagePanel';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import Label from '@my/components/atomic/Label';
import TextInputField from '@my/components/molecules/TextInputField';
import SwitchButtonField from '@my/components/molecules/SwitchButtonField';
import DataDisplay from '@my/components/atomic/DataDisplay';
import Checkbox from '@my/components/atomic/Checkbox';
import yup from '@my/yup';
import useSnackbar from '@my/components/atomic/Snackbar/useSnackbar';
import Messages from '@my/messages';
import { useClearPastContentQuote, useFetchPastContentQuote } from '@my/action-hooks/plan/careplan/plan2';
import { RootState, useTypedSelector } from '@my/stores';
import { PastContentQuote, PlanKyotakuServiceKeikakusho2, PlanKeikakushoKanriBase } from 'maps4nc-frontend-web-api/dist/lib/model';
import { Plan2TableRow } from '../Plan2InputForm';

type QuoteDialogContentsProps = {
  screenId: string;
  sakuseiDate?: number;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClickSave: (selectedRows: Plan2TableRow[]) => void;
};

type QuoteDialogSearchFormType = {
  searchCriteria?: string;
  isLoginStaffOnly?: boolean;
};
export const quoteDialogSearchFormSchema = yup.object({
  searchCriteria: yup.string().required().label('検索条件'),
  isLoginStaffOnly: yup.boolean().label('ログインスタッフのみ'),
});

type QuoteDialogSaveFormType = {
  dataGridValues: GridColumnData[];
};

const getColoredDiv = (isTarget: boolean, value: any) => {
  if (isTarget) {
    return <div style={{ color: '#0055dd' }}>{value}</div>;
  }
  return <div>{value}</div>;
};

type GridColumnData = EditableGridData & PastContentQuote & PlanKyotakuServiceKeikakusho2 & PlanKeikakushoKanriBase;

let defaultData: GridColumnData[] = [];

/**
 *  過去内容引用ダイアログ(コンテンツ)
 */
const QuoteDialogContents: React.FC<QuoteDialogContentsProps> = (props: QuoteDialogContentsProps) => {
  const { screenId, sakuseiDate, setIsDialogOpen, onClickSave } = props;

  const searchFormMethods = useForm<QuoteDialogSearchFormType>({
    mode: 'onChange',
    validationSchema: quoteDialogSearchFormSchema,
  });
  const { setValue, control, errors: searchErrors, handleSubmit: handleSearchSubmit, watch } = searchFormMethods;

  const [isLoginStaffOnly, setIsLoginStaffOnly] = React.useState(false);

  const showSnackbar = useSnackbar();

  const fetchPastContentQuote = useFetchPastContentQuote(screenId);
  const clearPastContentQuote = useClearPastContentQuote();
  const pastContentQuote = useTypedSelector((state: RootState) => state.plan2.pastContentQuote);

  React.useEffect(() => {
    defaultData = pastContentQuote.map((data) => {
      const dataObj = {
        riyoushaName: data.riyoushaName,
        keikakuSakuseiDate: data.planKeikakushoKanri?.keikakuSakuseiDate,
        kadai: data.planKyotakuServiceKeikakusho2?.kadai,
        choukiMokuhyou: data.planKyotakuServiceKeikakusho2?.choukiMokuhyou,
        tankiMokuhyou: data.planKyotakuServiceKeikakusho2?.tankiMokuhyou,
        enjoServiceNaiyou: data.planKyotakuServiceKeikakusho2?.enjoServiceNaiyou,
        isHokenkyufutaishou: data.planKyotakuServiceKeikakusho2?.isHokenkyufutaishou,
        enjoServiceShubetsu: data.planKyotakuServiceKeikakusho2?.enjoServiceShubetsu,
        officeName: data.planKyotakuServiceKeikakusho2?.officeName,
        serviceHindo: data.planKyotakuServiceKeikakusho2?.serviceHindo,
        isTargetRiyoushaName: data.isTargetRiyoushaName,
        isTargetKeikakuSakuseiDate: data.isTargetKeikakuSakuseiDate,
        isTargetKadai: data.isTargetKadai,
        isTargetChoukiMokuhyou: data.isTargetChoukiMokuhyou,
        isTargetTankiMokuhyou: data.isTargetTankiMokuhyou,
        isTargetEnjoServiceNaiyou: data.isTargetEnjoServiceNaiyou,
        isTargetEnjoServiceShubetsu: data.isTargetEnjoServiceShubetsu,
        isTargetOfficeName: data.isTargetOfficeName,
        isTargetServiceHindo: data.isTargetServiceHindo,
      } as GridColumnData;
      return dataObj;
    });
  }, [pastContentQuote]);

  const onChangedIsLoginStaffOnly = (_event: React.ChangeEvent<HTMLInputElement>, changed: boolean) => {
    // ログインスタッフのみスイッチON/OFF
    setValue('isLoginStaffOnly', changed);
    setIsLoginStaffOnly(changed);
  };

  watch(['isLoginStaffOnly']);

  const saveFormMethods = useForm<QuoteDialogSaveFormType>({
    mode: 'onChange',
  });
  const { handleSubmit: handleSaveSubmit } = saveFormMethods;

  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '利用者名',
        accessor: 'riyoushaName',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetRiyoushaName, value);
        },
      },
      {
        Header: '作成年月日',
        accessor: 'keikakuSakuseiDate',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        Cell: ({ row: { index, original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetKeikakuSakuseiDate, <DataDisplay id={`data.${index}.createDate`} type="date" value={value} />);
        },
      },
      {
        Header: '生活全般の解決すべき課題（ニーズ）',
        accessor: 'kadai',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        wrap: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetKadai, value);
        },
      },
      {
        Header: '長期目標',
        accessor: 'choukiMokuhyou',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        wrap: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetChoukiMokuhyou, value);
        },
      },
      {
        Header: '短期目標',
        accessor: 'tankiMokuhyou',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        wrap: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetTankiMokuhyou, value);
        },
      },
      {
        Header: 'サービス内容',
        accessor: 'enjoServiceNaiyou',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        wrap: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetEnjoServiceNaiyou, value);
        },
      },
      {
        Header: '※1',
        accessor: 'isHokenkyufutaishou',
        width: 40,
        fixed: true,
        Cell: ({ row: { index }, value }: CellProps<GridColumnData, boolean>) => <Checkbox id={`data.${index}.kome1`} name={`data.${index}.kome1`} checked={value} size="small" disabled />,
      },
      {
        Header: 'サービス種別',
        accessor: 'enjoServiceShubetsu',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetEnjoServiceShubetsu, value);
        },
      },
      {
        Header: '※2',
        accessor: 'officeName',
        width: 1,
        minWidth: 100,
        maxWidth: 2000,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetOfficeName, value);
        },
      },
      {
        Header: '頻度',
        accessor: 'serviceHindo',
        width: 80,
        fixed: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          return getColoredDiv(original.isTargetServiceHindo, value);
        },
      },
    ],
    []
  );

  const dataGridValues = useEditableDataGrid<GridColumnData>({
    defaultData,
    rowSelect: 'multiple',
  });

  const { selectedRows } = dataGridValues;

  const handleSubmitSearchForm = handleSearchSubmit(async (data) => {
    // await console.log('search data -> ', data);
    const searchCriteria = data.searchCriteria !== undefined ? data.searchCriteria : '';
    // eslint-disable-next-line no-underscore-dangle
    const _isLoginStaffOnly = data.isLoginStaffOnly !== undefined ? data.isLoginStaffOnly : false;
    clearPastContentQuote();
    await fetchPastContentQuote(searchCriteria, _isLoginStaffOnly, sakuseiDate, sakuseiDate);
  });

  const handleSubmitForm = handleSaveSubmit(() => {
    const indexes: Array<number> = toDataGridIndexNumberArray(selectedRows);
    if (indexes.length === 0) {
      showSnackbar({
        message: Messages.MESSAGE_0071('引用するデータ'),
        type: 'error',
      });
      return;
    }

    // 返却データ生成
    const selectRows: Plan2TableRow[] = [];
    pastContentQuote.forEach((data, index) => {
      if (indexes.indexOf(index) === -1) {
        return;
      }
      const row: Plan2TableRow = {
        deleteFlag: false,
        seq: 1,
        isCheck: false,
        kadai: data.planKyotakuServiceKeikakusho2?.kadai ? data.planKyotakuServiceKeikakusho2?.kadai : '',
        choukiMokuhyou: data.planKyotakuServiceKeikakusho2?.choukiMokuhyou,
        choukiMokuhyouStartDate: data.planKyotakuServiceKeikakusho2?.choukiMokuhyouStartDate ? new Date(data.planKyotakuServiceKeikakusho2?.choukiMokuhyouStartDate) : undefined,
        choukiMokuhyouEndDate: data.planKyotakuServiceKeikakusho2?.choukiMokuhyouEndDate ? new Date(data.planKyotakuServiceKeikakusho2?.choukiMokuhyouEndDate) : undefined,
        tankiMokuhyou: data.planKyotakuServiceKeikakusho2?.tankiMokuhyou,
        tankiMokuhyouStartDate: data.planKyotakuServiceKeikakusho2?.tankiMokuhyouStartDate ? new Date(data.planKyotakuServiceKeikakusho2?.tankiMokuhyouStartDate) : undefined,
        tankiMokuhyouEndDate: data.planKyotakuServiceKeikakusho2?.tankiMokuhyouEndDate ? new Date(data.planKyotakuServiceKeikakusho2?.tankiMokuhyouEndDate) : undefined,
        enjoServiceNaiyou: data.planKyotakuServiceKeikakusho2?.enjoServiceNaiyou,
        isHokenkyufutaishou: data.planKyotakuServiceKeikakusho2?.isHokenkyufutaishou,
        enjoServiceShubetsu: data.planKyotakuServiceKeikakusho2?.enjoServiceShubetsu,
        officeName: data.planKyotakuServiceKeikakusho2?.officeName,
        serviceHindo: data.planKyotakuServiceKeikakusho2?.serviceHindo,
        serviceStartDate: data.planKyotakuServiceKeikakusho2?.serviceStartDate ? new Date(data.planKyotakuServiceKeikakusho2?.serviceStartDate) : undefined,
        serviceEndDate: data.planKyotakuServiceKeikakusho2?.serviceEndDate ? new Date(data.planKyotakuServiceKeikakusho2?.serviceEndDate) : undefined,
      };
      selectRows.push(row);
    });
    // データ返却
    onClickSave(selectRows);
    // ダイアログを閉じる
    setIsDialogOpen(false);
  });

  return (
    <>
      <DialogContent>
        <Container maxWidth={false}>
          <GlobalMessagePanel screenID={screenId} />
        </Container>

        <LayoutForm id="rireki-form">
          <LayoutItem variant="right-margin">
            <Label id="label">直近1年間で過去に登録した内容を引用します。</Label>
          </LayoutItem>
          <LayoutItem variant="1-item-full">
            <Grid container direction="row" justify="flex-start">
              <Grid item>
                <Box width={520} mr={3}>
                  <TextInputField
                    id="searchCriteria"
                    required
                    name="searchCriteria"
                    type="text"
                    label="検索条件"
                    labelWidth={80}
                    placeholder="複数の場合はスペースで区切ってください。"
                    variant="normal"
                    fullWidth
                    control={control}
                    error={!!searchErrors.searchCriteria}
                    errorMessage={searchErrors.searchCriteria?.message}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box width={250} mr={3}>
                  <SwitchButtonField
                    id="is-login-staff-only-switch"
                    name="isLoginStaffOnly"
                    label="ログインスタッフ以外も検索"
                    labelWidth={200}
                    size="medium"
                    control={control}
                    defaultChecked={isLoginStaffOnly}
                    onChange={onChangedIsLoginStaffOnly}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Box mt={0.5}>
                  <GeneralIconButton icon="search" id="search-button" onClick={handleSubmitSearchForm}>
                    検索
                  </GeneralIconButton>
                </Box>
              </Grid>
            </Grid>
          </LayoutItem>
          <LayoutItem variant="1-item-full">
            <DataGrid id="details" columns={columns} minHeight={100} heightOffset={350} {...dataGridValues} />
          </LayoutItem>
        </LayoutForm>
      </DialogContent>

      <DialogActions>
        <GeneralIconButton icon="register" id="rireki-save-button" onClick={handleSubmitForm}>
          決定
        </GeneralIconButton>
      </DialogActions>
    </>
  );
};

export default QuoteDialogContents;
