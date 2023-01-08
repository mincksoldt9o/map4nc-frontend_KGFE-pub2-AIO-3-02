import React from 'react';
import styled from 'styled-components';
import { useFormContext } from 'react-hook-form';
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import TextInputField from '@my/components/molecules/TextInputField';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import TextInput from '@my/components/atomic/TextInput';
import CalendarInput from '@my/components/molecules/CalendarInput';
import Checkbox from '@my/components/atomic/Checkbox';
import ComboBox from '@my/components/atomic/ComboBox';
import CheckboxField from '@my/components/molecules/CheckboxField';
import OptionButtonField from '@my/components/molecules/OptionButtonField';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import { DataGrid, DataGridColumn, EditableCellProps, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import Label from '@my/components/atomic/Label';
import NumberInput from '@my/components/atomic/NumberInput';
import SearchRenrakusakiDialog, { SearchRenrakusakiType } from '@my/containers/pages/Common/SearchRenrakusakiDialog';
import { PlanRiyoushaKihonInfo } from 'maps4nc-frontend-web-api/dist/lib/model';
import ImageUploader from '@my/components/molecules/ImageUploader';
import { changeAble } from '../../SingleCheckboxUtil';
import {
  elderlyPeopleWithDementiaCheckboxes,
  elderlyWithDisabilitiesCheckboxes,
  personalSituationCheckboxes,
  visitCategory1Checkboxes,
  visitCategory2Checkboxes,
  youkaigoOptions,
  zenkaiYoukaigoOptions,
} from '../../Datas';

const HeaderCell = styled(TableCell)<{ minWidth?: string }>`
  background-color: #a49696;
  color: white;
  padding: 7px 5px 7px 5px;
  border-left: 1px solid #e8dac3;
  border-bottom: 1px solid #fff;
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}` : undefined)};
`;

const BodyCell = styled(TableCell)<{ bt?: boolean; br?: boolean; bl?: boolean; minWidth?: string; textAlign?: string }>`
  border-top: ${({ bt }) => (bt ? `1px solid #e8dac3` : undefined)};
  border-right: ${({ br }) => (br ? `1px solid #e8dac3` : undefined)};
  border-left: ${({ bl }) => (bl ? `1px solid #e8dac3` : undefined)};
  padding: 7px 5px 7px 5px;
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}` : undefined)};
  text-align: ${({ textAlign }) => (textAlign ? `${textAlign}` : undefined)};
`;

export type Props = {
  id: string;
  defaultValues?: PlanRiyoushaKihonInfo;
};
export type LabelAndValue = { value: string; label?: string };

type GridColumnData = EditableGridData & {
  renrakusakiName: string;
  tsuzukigaraName: string;
  address: string;
  tel1: string;
  tel2: string;
};

// *************************************************************************************
// ********** データ
// 定数
// 受付区分チェックボックス その他
const VISIT_CATEGORY1_OTHER = '3';
const VISIT_CATEGORY2_SAIRAI = '2';
const PERSONAL_SITUATION_NYUUINNTYUU = '2';
const DISABLE_HONNIN_KYOJUU_JUUTAKUKAI = '0';

// 単一チェックボックスに指定する名前
// チェックリスト1
const soudanDateName = 'soudanDate';
const soudanKbnName = 'soudanKbn';
const soudanSonotaName = 'soudanSonota';
const creationKbnName = 'creationKbn';
const sairaiDateName = 'sairaiDate';

const honninJoukyouKbnName = 'honninJoukyouKbn';
const honninJoukyouDetailName = 'shisetsuName';

const shougaiSeikatsuJiritsudoKbnName = 'shougaiSeikatsuJiritsudoKbn';
const ninchiSeikatsuJiritsudoKbnName = 'ninchiSeikatsuJiritsudoKbn';

const youkaigoKbnName = 'youkaigoKbnValue';
const zenkaiYoukaigoKbnName = 'zenkaiYoukaigoKbnValue';

const ninteiStartDateName = 'ninteiStartDate';
const ninteiEndDateName = 'ninteiEndDate';

const isShougaiNinteiShinshouName = 'isShougaiNinteiShinshou';
const isShougaiNinteiRyouikuName = 'isShougaiNinteiRyouiku';
const isShougaiNinteiSeishinName = 'isShougaiNinteiSeishin';
const isShougaiNinteiNanbyouName = 'isShougaiNinteiNanbyou';
const isShougaiNinteiSonotaName = 'isShougaiNinteiSonota';

const shougaiNinteiShinshouName = 'shougaiNinteiShinshou';
const shougaiNinteiRyouikuName = 'shougaiNinteiRyouiku';
const shougaiNinteiSeishinName = 'shougaiNinteiSeishin';
const shougaiNinteiNanbyouName = 'shougaiNinteiNanbyou';
const shougaiNinteiSonotaName = 'shougaiNinteiSonota';

const isHonninKyojuuJishitsuName = 'isHonninKyojuuJishitsuValue';
const honninKyojuuJuutakuKaiName = 'honninKyojuuJuutakuKai';
const isHonninKyojuuJuutakuKaishuuName = 'isHonninKyojuuJuutakuKaishuuValue';
const isHonninKyojuuHomeName = 'isHonninKyojuuHome';
const isHonninKyojuuShakuyaName = 'isHonninKyojuuShakuya';
const isHonninKyojuuIkkodateName = 'isHonninKyojuuIkkodate';
const isHonninKyojuuShuugouJuutakuName = 'isHonninKyojuuShuugouJuutaku';

const keizaiJoukyouSonotaName = 'keizaiJoukyouSonota';

const isKeizaiJoukyouKokuminnenkinName = 'isKeizaiJoukyouKokuminnenkin';
const isKeizaiJoukyouKouseinenkinName = 'isKeizaiJoukyouKouseinenkin';
const isKeizaiJoukyouShougainenkinName = 'isKeizaiJoukyouShougainenkin';
const isKeizaiJoukyouSeikatsuhogoName = 'isKeizaiJoukyouSeikatsuhogo';
const isKeizaiJoukyouSonotaName = 'isKeizaiJoukyouSonota';

const BasicInfoInputForm: React.FC<Props> = (props: Props) => {
  const { id, defaultValues } = props;

  const { control, watch, setValue } = useFormContext();
  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '氏名',
        accessor: 'renrakusakiName',
        width: 1,
        minWidth: 150,
        maxWidth: 200,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.renrakusakiName`}
              name={`kihonKinkyuuRenrakusaki[${index}].renrakusakiName`}
              control={control}
              maxLength={18}
              type="textarea"
              rowsMin={2}
              rowsMax={2}
              value={original.renrakusakiName}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'renrakusakiName', value: v }]);
              }}
            />
          );
        },
      },
      {
        Header: '続柄',
        accessor: 'tsuzukigaraName',
        width: 1,
        minWidth: 100,
        maxWidth: 150,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.tsuzukigaraName`}
              name={`kihonKinkyuuRenrakusaki[${index}].tsuzukigaraName`}
              control={control}
              maxLength={9}
              type="textarea"
              rowsMin={2}
              rowsMax={2}
              value={original.tsuzukigaraName}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'tsuzukigaraName', value: v }]);
              }}
            />
          );
        },
      },
      {
        Header: '住所・連絡先',
        accessor: 'address',
        width: 1,
        minWidth: 300,
        maxWidth: 2000,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.address`}
              name={`kihonKinkyuuRenrakusaki[${index}].address`}
              control={control}
              maxLength={27}
              type="textarea"
              rowsMin={2}
              rowsMax={2}
              value={original.address}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'address', value: v }]);
              }}
            />
          );
        },
      },
      {
        Header: '電話番号1',
        accessor: 'tel1',
        fixed: true,
        width: 150,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.tel1`}
              name={`kihonKinkyuuRenrakusaki[${index}].tel1`}
              control={control}
              maxLength={30}
              type="tel"
              value={original.tel1}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'tel1', value: v }]);
              }}
            />
          );
        },
      },
      {
        Header: '電話番号2',
        accessor: 'tel2',
        fixed: true,
        width: 150,
        Cell: ({ row: { index, original }, updateCellValues }: EditableCellProps<GridColumnData, string>) => {
          return (
            <TextInput
              id={`row.${index}.tel2`}
              name={`kihonKinkyuuRenrakusaki[${index}].tel2`}
              control={control}
              maxLength={30}
              type="tel"
              value={original.tel2}
              fullWidth
              variant="grid"
              onChange={(v) => {
                updateCellValues(index, [{ accessor: 'tel2', value: v }]);
              }}
            />
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const transformData = function (edit: PlanRiyoushaKihonInfo | undefined): GridColumnData[] {
    if (!edit?.kihonKinkyuuRenrakusaki?.length) {
      return [];
    }
    return edit.kihonKinkyuuRenrakusaki.map(({ renrakusakiName, tsuzukigaraName, address, tel1, tel2 }) => ({
      renrakusakiName: renrakusakiName ?? '',
      tsuzukigaraName: tsuzukigaraName ?? '',
      address: address ?? '',
      tel1: tel1 ?? '',
      tel2: tel2 ?? '',
    }));
  };

  const defaultDataGridData: GridColumnData[] = React.useMemo((): GridColumnData[] => transformData(defaultValues), [defaultValues]);

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
      renrakusakiName: '',
      tsuzukigaraName: '',
      address: '',
      tel1: '',
      tel2: '',
    });
  };

  // CheckboxField コンポーネントが control 配下の場合 onChange が効かないため watch で変更を検知する
  const [disableSoudanOther, setDisableSoudanOther] = React.useState<boolean>(true);
  const [disableSairaiDate, setDisableSairaiDate] = React.useState<boolean>(true);
  const [disablePersonalSituationNyuuinntyuu, setDisablePersonalSituationNyuuinntyuu] = React.useState<boolean>(true);
  const [disableShougaiNinteiShinshou, setDisableShougaiNinteiShinshou] = React.useState<boolean>(true);
  const [disableShougaiNinteiRyouiku, setDisableShougaiNinteiRyouiku] = React.useState<boolean>(true);
  const [disableShougaiNinteiSeishin, setDisableShougaiNinteiSeishin] = React.useState<boolean>(true);
  const [disableShougaiNinteiNanbyou, setDisableShougaiNinteiNanbyou] = React.useState<boolean>(true);
  const [disableShougaiNinteiSonota, setDisableShougaiNinteiSonota] = React.useState<boolean>(true);
  const [disableHonninKyojuuJuutakuKai, setDisableHonninKyojuuJuutakuKai] = React.useState<boolean>(true);
  const [disableEconomyStatusSonota, setDisableEconomyStatusSonota] = React.useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };
  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSaveClick = (item: SearchRenrakusakiType) => {
    setValue('raishoshaRenrkusaki', `${item?.tel1 || `${item?.tel2}` || ''}`);
    setValue('raishoshaName', item?.tsuzukigaraName);
    setValue('raishoshaTsuzukigaraName', item?.renrakuKanjiName);
    setIsSearchOpen(false);
  };

  const checkResetValueField = (values: string[] | null | undefined, valueCheck: string, controlName: string, defaultValue: string | null) => {
    if (!values || !values.includes(valueCheck)) {
      setValue(controlName, defaultValue);
    }
  };

  const handleChangeDisabilityCertification = (controlName: string, value: boolean, setDisableState: (isDisabled: boolean) => void, controlInputName: string) => {
    if (value) {
      const disabilityCertificationNameArr = [isShougaiNinteiShinshouName, isShougaiNinteiRyouikuName, isShougaiNinteiSeishinName, isShougaiNinteiNanbyouName, isShougaiNinteiSonotaName];
      disabilityCertificationNameArr.forEach((name: string) => {
        if (name !== controlName) {
          setValue(name, false);
        }
      });
    } else {
      setValue(controlInputName, '');
    }
    setDisableState(!value);
  };
  const handleChangeEconomicSituation = (controlName: string, value: boolean, controlInputName: string) => {
    if (value) {
      const economicSituationNameArr = [
        isKeizaiJoukyouKokuminnenkinName,
        isKeizaiJoukyouKouseinenkinName,
        isKeizaiJoukyouShougainenkinName,
        isKeizaiJoukyouSeikatsuhogoName,
        isKeizaiJoukyouSonotaName,
      ];
      economicSituationNameArr.forEach((name: string) => {
        if (name !== controlName) {
          setValue(name, false);
        }
      });
    } else {
      setValue(controlInputName, '');
    }
  };
  const handleChangeHonninKyojuu = (controlName: string, value: boolean) => {
    if (value) {
      const honninKyojuuNameArr = [isHonninKyojuuHomeName, isHonninKyojuuShakuyaName, isHonninKyojuuIkkodateName, isHonninKyojuuShuugouJuutakuName];
      honninKyojuuNameArr.forEach((name: string) => {
        if (name !== controlName) {
          setValue(name, false);
        }
      });
    }
  };

  React.useEffect(() => {
    // 訪問区分チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
    const soudanKbnFields = watch(soudanKbnName);
    changeAble(soudanKbnFields, setDisableSoudanOther, VISIT_CATEGORY1_OTHER);
    checkResetValueField(soudanKbnFields, VISIT_CATEGORY1_OTHER, soudanSonotaName, '');
    // 訪問回数区分チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
    const creationKbnFields = watch(creationKbnName);
    changeAble(creationKbnFields, setDisableSairaiDate, VISIT_CATEGORY2_SAIRAI);
    checkResetValueField(creationKbnFields, VISIT_CATEGORY2_SAIRAI, sairaiDateName, null);
    // 訪問回数区分チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
    const honninJoukyouKbnFields = watch(honninJoukyouKbnName);
    changeAble(honninJoukyouKbnFields, setDisablePersonalSituationNyuuinntyuu, PERSONAL_SITUATION_NYUUINNTYUU);
    checkResetValueField(honninJoukyouKbnFields, PERSONAL_SITUATION_NYUUINNTYUU, honninJoukyouDetailName, '');
    //
    const isHonninKyojuuJishitsuField = watch(isHonninKyojuuJishitsuName);
    setDisableHonninKyojuuJuutakuKai(!isHonninKyojuuJishitsuField || isHonninKyojuuJishitsuField === DISABLE_HONNIN_KYOJUU_JUUTAKUKAI);
    // // 経済状況「その他」チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  // 障害等認定「身障」チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
  const isShougaiNinteiShinshouField = watch(isShougaiNinteiShinshouName);
  React.useEffect(() => {
    handleChangeDisabilityCertification(isShougaiNinteiShinshouName, isShougaiNinteiShinshouField, setDisableShougaiNinteiShinshou, shougaiNinteiShinshouName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShougaiNinteiShinshouField]);

  // 障害等認定「療育」チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
  const isShougaiNinteiRyouikuField = watch(isShougaiNinteiRyouikuName);
  React.useEffect(() => {
    handleChangeDisabilityCertification(isShougaiNinteiRyouikuName, isShougaiNinteiRyouikuField, setDisableShougaiNinteiRyouiku, shougaiNinteiRyouikuName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShougaiNinteiRyouikuField]);

  // 障害等認定「精神」チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
  const isShougaiNinteiSeishinField = watch(isShougaiNinteiSeishinName);
  React.useEffect(() => {
    handleChangeDisabilityCertification(isShougaiNinteiSeishinName, isShougaiNinteiSeishinField, setDisableShougaiNinteiSeishin, shougaiNinteiSeishinName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShougaiNinteiSeishinField]);

  // 障害等認定「難病」チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
  const isShougaiNinteiNanbyouField = watch(isShougaiNinteiNanbyouName);
  React.useEffect(() => {
    handleChangeDisabilityCertification(isShougaiNinteiNanbyouName, isShougaiNinteiNanbyouField, setDisableShougaiNinteiNanbyou, shougaiNinteiNanbyouName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShougaiNinteiNanbyouField]);

  // 障害等認定「その他」チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
  const isShougaiNinteiSonotaField = watch(isShougaiNinteiSonotaName);
  React.useEffect(() => {
    handleChangeDisabilityCertification(isShougaiNinteiSonotaName, isShougaiNinteiSonotaField, setDisableShougaiNinteiSonota, shougaiNinteiSonotaName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShougaiNinteiSonotaField]);

  const isKeizaiJoukyouKokuminnenkinField = watch(isKeizaiJoukyouKokuminnenkinName);
  React.useEffect(() => {
    handleChangeEconomicSituation(isKeizaiJoukyouKokuminnenkinName, isKeizaiJoukyouKokuminnenkinField, keizaiJoukyouSonotaName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeizaiJoukyouKokuminnenkinField]);

  const isKeizaiJoukyouKouseinenkinField = watch(isKeizaiJoukyouKouseinenkinName);
  React.useEffect(() => {
    handleChangeEconomicSituation(isKeizaiJoukyouKouseinenkinName, isKeizaiJoukyouKouseinenkinField, keizaiJoukyouSonotaName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeizaiJoukyouKouseinenkinField]);

  const isKeizaiJoukyouShougainenkinField = watch(isKeizaiJoukyouShougainenkinName);
  React.useEffect(() => {
    handleChangeEconomicSituation(isKeizaiJoukyouShougainenkinName, isKeizaiJoukyouShougainenkinField, keizaiJoukyouSonotaName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeizaiJoukyouShougainenkinField]);

  const isKeizaiJoukyouSeikatsuhogoField = watch(isKeizaiJoukyouSeikatsuhogoName);
  React.useEffect(() => {
    handleChangeEconomicSituation(isKeizaiJoukyouSeikatsuhogoName, isKeizaiJoukyouSeikatsuhogoField, keizaiJoukyouSonotaName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeizaiJoukyouSeikatsuhogoField]);

  const isKeizaiJoukyouSonotaField = watch(isKeizaiJoukyouSonotaName);
  React.useEffect(() => {
    handleChangeEconomicSituation(isKeizaiJoukyouSonotaName, isKeizaiJoukyouSonotaField, keizaiJoukyouSonotaName);
    setDisableEconomyStatusSonota(!isKeizaiJoukyouSonotaField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeizaiJoukyouSonotaField]);

  const isHonninKyojuuHomeField = watch(isHonninKyojuuHomeName);
  React.useEffect(() => {
    handleChangeHonninKyojuu(isHonninKyojuuHomeName, isHonninKyojuuHomeField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHonninKyojuuHomeField]);

  const isHonninKyojuuShakuyaField = watch(isHonninKyojuuShakuyaName);
  React.useEffect(() => {
    handleChangeHonninKyojuu(isHonninKyojuuShakuyaName, isHonninKyojuuShakuyaField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHonninKyojuuShakuyaField]);

  const isHonninKyojuuIkkodateField = watch(isHonninKyojuuIkkodateName);
  React.useEffect(() => {
    handleChangeHonninKyojuu(isHonninKyojuuIkkodateName, isHonninKyojuuIkkodateField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHonninKyojuuIkkodateField]);

  const keizaiJoukyouSonotaField = watch(keizaiJoukyouSonotaName);
  React.useEffect(() => {
    handleChangeHonninKyojuu(keizaiJoukyouSonotaName, keizaiJoukyouSonotaField);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keizaiJoukyouSonotaField]);

  return (
    <LayoutForm disableGridLayout>
      <Box mt={1} ml={1} mr={1}>
        <TableContainer style={{ marginBottom: 5, marginTop: 5 }}>
          <Table aria-label="table1">
            <colgroup>
              <col style={{ minWidth: 150, width: 150 }} />
              <col />
            </colgroup>
            <TableBody>
              <TableRow>
                <HeaderCell component="th" rowSpan={2}>
                  相談日
                </HeaderCell>
                <BodyCell rowSpan={2} width={200}>
                  <Box width={180}>
                    <CalendarInput id="soudan-date" name={soudanDateName} defaultValue={new Date()} variant="table" control={control} />
                  </Box>
                </BodyCell>
                <BodyCell>
                  <Box ml={2} minWidth={350}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item>
                        <CheckboxField id={`${id}-visit-category1`} name={soudanKbnName} labelWidth={0} checkboxes={visitCategory1Checkboxes} size="small" singleCheck control={control} />
                      </Grid>
                      <Grid item>
                        <TextInput id={`${id}-visit-category1-sonota-detail`} name={soudanSonotaName} maxLength={16} variant="table" disabled={disableSoudanOther} control={control} type="text" />
                      </Grid>
                    </Grid>
                  </Box>
                </BodyCell>
              </TableRow>
              <TableRow>
                <BodyCell>
                  <Box ml={2} minWidth={300}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item>
                        <CheckboxField id={`${id}-visit-category2`} name={creationKbnName} labelWidth={0} checkboxes={visitCategory2Checkboxes} size="small" singleCheck control={control} />
                      </Grid>
                      <Grid item>
                        <Box width={170}>
                          <CalendarInput id="visit-category2-soudan-date" name={sairaiDateName} defaultValue={null} control={control} disabled={disableSairaiDate} variant="table" />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell>本人の現況</HeaderCell>
                <BodyCell colSpan={2}>
                  <Box ml={2} minWidth={540}>
                    <Grid container direction="row" justify="flex-start" alignItems="center">
                      <Grid item>
                        <CheckboxField
                          id={`${id}-personal-situation`}
                          name={honninJoukyouKbnName}
                          label=""
                          labelWidth={0}
                          checkboxes={personalSituationCheckboxes}
                          size="small"
                          singleCheck
                          control={control}
                        />
                      </Grid>
                      <Grid item>
                        <TextInput
                          id="personal-situation-nyuuinntyuu-detail"
                          name={honninJoukyouDetailName}
                          type="text"
                          maxLength={44}
                          variant="table"
                          disabled={disablePersonalSituationNyuuinntyuu}
                          control={control}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th" rowSpan={2}>
                  日常生活
                  <br />
                  自立度
                </HeaderCell>
                <BodyCell colSpan={2}>
                  <CheckboxField
                    id={`${id}-elderly-with-disabilities`}
                    name={shougaiSeikatsuJiritsudoKbnName}
                    label="障害高齢者の日常生活自立度"
                    labelWidth={230}
                    checkboxes={elderlyWithDisabilitiesCheckboxes}
                    size="small"
                    singleCheck
                    control={control}
                  />
                </BodyCell>
              </TableRow>
              <TableRow>
                <BodyCell colSpan={2}>
                  <CheckboxField
                    id={`${id}-elderly-people-with-dementia`}
                    name={ninchiSeikatsuJiritsudoKbnName}
                    label="認知症高齢者の日常生活自立度"
                    labelWidth={230}
                    checkboxes={elderlyPeopleWithDementiaCheckboxes}
                    size="small"
                    singleCheck
                    control={control}
                  />
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th" rowSpan={2}>
                  認定・
                  <br />
                  総合事業
                  <br />
                  情報
                </HeaderCell>
                <BodyCell colSpan={2}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <ComboBox id="kaigodo" name={youkaigoKbnName} options={youkaigoOptions} variant="table" placeholder="" minWidth={130} control={control} />
                    </Grid>
                    <Grid item>
                      <Box marginLeft="20px">
                        <ComboBoxField
                          id="kaigodo-before"
                          name={zenkaiYoukaigoKbnName}
                          label="前回の介護度"
                          labelWidth={120}
                          options={zenkaiYoukaigoOptions}
                          variant="table"
                          placeholder=""
                          minWidth={130}
                          control={control}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <BodyCell colSpan={2}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <Box width={250}>
                        <CalendarInputField id="validity-period-from" name={ninteiStartDateName} label="有効期限" labelWidth={80} defaultValue={null} variant="table" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box width={220}>
                        <CalendarInputField id="validity-period-to" name={ninteiEndDateName} label="　～" labelWidth={50} defaultValue={null} variant="table" control={control} />
                      </Box>
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th">障害等認定</HeaderCell>
                <BodyCell colSpan={2}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <Box paddingLeft="11px">
                        <Checkbox id={`${id}-disability-certification-shinsyou`} name={isShougaiNinteiShinshouName} label="身障" size="small" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      (
                      <TextInput
                        id="disability-certification-shinsyou-detail"
                        name={shougaiNinteiShinshouName}
                        type="text"
                        maxLength={8}
                        variant="table"
                        disabled={disableShougaiNinteiShinshou}
                        control={control}
                      />
                      )
                    </Grid>
                    <Grid item>
                      <Box paddingLeft="11px">
                        <Checkbox id={`${id}-disability-certification-ryouiku`} name={isShougaiNinteiRyouikuName} label="療育" size="small" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      (
                      <TextInput
                        id="disability-certification-ryouiku-detail"
                        name={shougaiNinteiRyouikuName}
                        type="text"
                        maxLength={8}
                        variant="table"
                        disabled={disableShougaiNinteiRyouiku}
                        control={control}
                      />
                      )
                    </Grid>
                    <Grid item>
                      <Box paddingLeft="11px">
                        <Checkbox id={`${id}-disability-certification-seishin`} name={isShougaiNinteiSeishinName} label="精神" size="small" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      (
                      <TextInput
                        id="disability-certification-seishin"
                        name={shougaiNinteiSeishinName}
                        type="text"
                        maxLength={8}
                        variant="table"
                        disabled={disableShougaiNinteiSeishin}
                        control={control}
                      />
                      )
                    </Grid>
                    <Grid item>
                      <Box paddingLeft="11px">
                        <Checkbox id={`${id}-disability-certification-nanbyou`} name={isShougaiNinteiNanbyouName} label="難病" size="small" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      (
                      <TextInput
                        id="disability-certification-nanbyou-detail"
                        name={shougaiNinteiNanbyouName}
                        type="text"
                        maxLength={8}
                        variant="table"
                        disabled={disableShougaiNinteiNanbyou}
                        control={control}
                      />
                      )
                    </Grid>
                    <Grid item>
                      <Box paddingLeft="11px">
                        <Checkbox id={`${id}-disability-certification-sonota`} name={isShougaiNinteiSonotaName} label="その他" size="small" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      (
                      <TextInput
                        id="disability-certification-sonota-detail"
                        name={shougaiNinteiSonotaName}
                        type="text"
                        maxLength={8}
                        variant="table"
                        disabled={disableShougaiNinteiSonota}
                        control={control}
                      />
                      )
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th">
                  本人の
                  <br />
                  居住環境
                </HeaderCell>
                <BodyCell colSpan={2}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <Box paddingLeft="11px">
                        <Checkbox id="isHonninKyojuuHomeName" name={isHonninKyojuuHomeName} label="自宅" size="small" control={control} />
                        <Checkbox id="isHonninKyojuuShakuyaName" name={isHonninKyojuuShakuyaName} label="借家" size="small" control={control} />
                        <Checkbox id="isHonninKyojuuIkkodateName" name={isHonninKyojuuIkkodateName} label="一戸建て" size="small" control={control} />
                        <Checkbox id="isHonninKyojuuShuugouJuutakuName" name={isHonninKyojuuShuugouJuutakuName} label="集合住宅" size="small" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box width={200} mr={1}>
                        <OptionButtonField
                          id="person-residence-environment-jishitu"
                          name={isHonninKyojuuJishitsuName}
                          label="自室の有無"
                          labelWidth={80}
                          options={[
                            { label: '無', value: '0' },
                            { label: '有', value: '1' },
                          ]}
                          defaultValue="0"
                          control={control}
                        />
                      </Box>
                    </Grid>
                    <Grid item>(</Grid>
                    <Grid item>
                      <Box width={100}>
                        <NumberInput
                          id="person-residence-environment-jishitu-detail"
                          name={honninKyojuuJuutakuKaiName}
                          max={3}
                          variant="table"
                          suffix="階"
                          disabled={disableHonninKyojuuJuutakuKai}
                          control={control}
                        />
                      </Box>
                    </Grid>
                    <Grid item>)&nbsp;&nbsp;</Grid>
                    <Grid item>
                      <Box width={230}>
                        <OptionButtonField
                          id="person-residence-environment-refurbishment"
                          name={isHonninKyojuuJuutakuKaishuuName}
                          label="住宅改修の有無"
                          labelWidth={110}
                          options={[
                            { label: '無', value: '0' },
                            { label: '有', value: '1' },
                          ]}
                          defaultValue="0"
                          control={control}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th">経済状況</HeaderCell>
                <BodyCell colSpan={2}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <Box paddingLeft="11px">
                        <Checkbox id="isKeizaiJoukyouKokuminnenkinName" name={isKeizaiJoukyouKokuminnenkinName} label="国民年金" size="small" control={control} />
                        <Checkbox id="isKeizaiJoukyouKouseinenkinName" name={isKeizaiJoukyouKouseinenkinName} label="厚生年金" size="small" control={control} />
                        <Checkbox id="isKeizaiJoukyouShougainenkinName" name={isKeizaiJoukyouShougainenkinName} label="障害年金" size="small" control={control} />
                        <Checkbox id="isKeizaiJoukyouSeikatsuhogoName" name={isKeizaiJoukyouSeikatsuhogoName} label="生活保護" size="small" control={control} />
                        <Checkbox id="isKeizaiJoukyouSonotaName" name={isKeizaiJoukyouSonotaName} label="その他" size="small" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      (<TextInput id="economy-status-other-detail" name={keizaiJoukyouSonotaName} type="text" maxLength={15} variant="table" disabled={disableEconomyStatusSonota} control={control} />)
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th">
                  <Grid container direction="row" justify="flex-start">
                    <Grid item>
                      来所者
                      <br />
                      (相談者)
                    </Grid>
                    <Grid item>
                      <GeneralIconButton icon="search" id="search-button" size="small" onClick={handleSearchClick}>
                        連絡先検索
                      </GeneralIconButton>
                    </Grid>
                  </Grid>
                </HeaderCell>
                <BodyCell colSpan={2}>
                  <Grid container direction="row" justify="flex-start">
                    <Grid item>
                      <Box width={250}>
                        <TextInput id="visitor" name="raishoshaName" type="textarea" variant="table" rowsMin={1} rowsMax={3} maxLength={9} fullWidth control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box width={220} marginLeft={2}>
                        <TextInputField
                          id="visitor-relationship"
                          name="raishoshaTsuzukigaraName"
                          label="続柄"
                          labelWidth={60}
                          type="textarea"
                          variant="table"
                          rowsMin={1}
                          rowsMax={3}
                          maxLength={62}
                          fullWidth
                          control={control}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th">
                  住所
                  <br />
                  連絡先
                </HeaderCell>
                <BodyCell colSpan={2}>
                  <Box width={616}>
                    <TextInput id="address" name="raishoshaRenrkusaki" type="textarea" variant="table" rowsMin={2} rowsMax={3} maxLength={87} fullWidth control={control} />
                  </Box>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th">
                  <Grid container direction="row" justify="flex-start">
                    <Grid item>緊急連絡先</Grid>
                  </Grid>
                </HeaderCell>
                <BodyCell colSpan={2}>
                  <Grid container direction="column" justify="flex-start">
                    <Grid item>
                      <Grid container direction="row" justify="flex-end">
                        <Grid item>
                          <GeneralIconButton icon="add" id="add-row-button-header" size="small" onClick={handleAddRow}>
                            行追加
                          </GeneralIconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <LayoutItem variant="1-item-full">
                        <DataGrid id="urgency-contact-addres" columns={columns} minHeight={280} heightOffset={700} {...dataGridValues} onClickDelete={handleClickDelete} />
                      </LayoutItem>
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell component="th">家族構成</HeaderCell>
                <BodyCell colSpan={2}>
                  <Grid container direction="column" justify="flex-start" alignItems="flex-start">
                    <Grid item>
                      <div>
                        「◎=本人、○=女性、□=男性
                        <br />
                        ●■=死亡、☆=キーパーソン
                        <br />
                        主介護者に「主」
                        <br />
                        副介護者に「副」
                        <br />
                        （同居家族は○で囲む）」
                      </div>
                      <Box>
                        <ImageUploader id="imageFile" name="imageFile" base64Name="imageFile" imageAreaSize={{ width: 318, height: 318 }} />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Label id="label">家族関係等の状況</Label>
                    </Grid>
                    <Grid item>
                      <Box width={400}>
                        <TextInput id="family-related-etc-status" name="familyKankeiJoukyou" type="textarea" variant="table" rowsMin={3} rowsMax={3} fullWidth control={control} />
                      </Box>
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {isSearchOpen && <SearchRenrakusakiDialog onReturnClick={handleSearchClose} onSaveClick={handleSaveClick} />}
      </Box>
    </LayoutForm>
  );
};

export default BasicInfoInputForm;
