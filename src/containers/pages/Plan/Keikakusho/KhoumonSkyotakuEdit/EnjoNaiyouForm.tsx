import React, { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Grid } from '@material-ui/core';
import { LayoutItem } from '@my/components/layouts/Form';
import { EditTabProps, CustomThCell, CustomTbCell } from '@my/containers/pages/Plan/Keikakusho';
import TextInputField from '@my/components/molecules/TextInputField';
import NumberInputField from '@my/components/molecules/NumberInputField';
import CheckboxField from '@my/components/molecules/CheckboxField';
import TimeInputField from '@my/components/molecules/TimeInputField';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';

const CustomHead = styled(TableHead)`
  & .MuiTableRow-head {
    border-bottom: 1px solid #fff;
  }
  & .MuiTableRow-head {
    height: 59px;
  }
  & .MuiTableCell-head {
    background: #a49696 0 0 no-repeat padding-box;
    color: #fff;
  }
  & .MuiTableCell-head:nth-child(n + 2) {
    border-left: 1px solid #e8dac3;
  }
  & .MuiTableCell-head:first-child {
    border-bottom: 0;
    border-top-left-radius: 14px;
  }
  & .MuiTableCell-head:last-child {
    border-bottom: 0;
    border-top-right-radius: 14px;
  }
` as typeof TableRow;

const weekOptions = [
  {
    label: '月',
    value: '1',
  },
  {
    label: '火',
    value: '2',
  },
  {
    label: '水',
    value: '3',
  },
  {
    label: '木',
    value: '4',
  },
  {
    label: '金',
    value: '5',
  },
  {
    label: '土',
    value: '6',
  },
  {
    label: '日',
    value: '0',
  },
];

export type EnjoNaiyouType = {
  enjoNaiyouSeq: number;
  serviceNaiyouSeq: number;
  serviceKubun?: string;
  serviceNoNaiyou?: string;
  shoyouJikan?: number;
  ryuuiJikou?: string;
  weeks: string[];
  startTime: string;
  endTime: string;
  serviceItemName?: string;
};

const EnjoNaiyouForm: React.FC<EditTabProps> = (props: EditTabProps) => {
  const { id } = props;
  const [{ isBunreiOpen, formName, itemKbn, maxLength: maxStr }, setBunreiOption] = useState<{ isBunreiOpen: boolean; formName: string; itemKbn: string; maxLength?: number }>({
    isBunreiOpen: false,
    formName: '',
    itemKbn: '',
  });
  const { control, getValues, setValue } = useFormContext();
  const handleBunreiClick = (name: string, itemCode: string, maxLength?: number) => {
    if (name && itemCode) {
      setBunreiOption({ isBunreiOpen: true, formName: name, itemKbn: itemCode, maxLength });
    }
  };
  const handleBunreiClose = () => {
    setBunreiOption({ isBunreiOpen: false, formName: '', itemKbn: '' });
  };
  const handleBunreiSaveClick = (item: BunreiType) => {
    if (formName) {
      const bunrei = getValues(formName) || '';
      setValue(formName, bunrei + item.bunrei, false);
      setBunreiOption({ isBunreiOpen: false, formName: '', itemKbn: '' });
    }
  };
  const defaultRows = useMemo(
    () =>
      [...Array(5)]
        .map((_, index) => index)
        .map((numSV) => (
          <React.Fragment key={`${id}-service-${numSV}`}>
            <TableRow>
              <CustomThCell component="th" align="center" rowSpan={8}>
                {`サービス${String.fromCharCode((numSV + 1).toString().charCodeAt(0) + 0xfee0)}`}
              </CustomThCell>
            </TableRow>
            {[...Array(6)]
              .map((_, index) => index + 1)
              .map((numRow) => (
                <TableRow key={`${id}-service-${numSV}-${numRow}`}>
                  <CustomTbCell>
                    <GeneralIconButton
                      icon="book"
                      id={`${id}-serviceKubun-btn-${numSV}-${numRow}`}
                      onClick={() => {
                        handleBunreiClick(`enjoNaiyouList[${numSV * 6 + numRow + numSV}].serviceKubun`, '11', 15);
                      }}>
                      文例
                    </GeneralIconButton>
                    <TextInputField
                      id={`${id}-serviceKubun-input-${numSV}-${numRow}`}
                      name={`enjoNaiyouList[${numSV * 6 + numRow + numSV}].serviceKubun`}
                      type="textarea"
                      rowsMin={2}
                      rowsMax={2}
                      labelWidth={0}
                      control={control}
                      maxLength={15}
                    />
                  </CustomTbCell>
                  <CustomTbCell>
                    <GeneralIconButton
                      icon="book"
                      id={`${id}-serviceNoNaiyou-btn-${numSV}-${numRow}`}
                      onClick={() => {
                        handleBunreiClick(`enjoNaiyouList[${numSV * 6 + numRow + numSV}].serviceNoNaiyou`, '12', 45);
                      }}>
                      文例
                    </GeneralIconButton>
                    <TextInputField
                      id={`${id}-serviceNoNaiyou-input-${numSV}-${numRow}`}
                      name={`enjoNaiyouList[${numSV * 6 + numRow + numSV}].serviceNoNaiyou`}
                      type="textarea"
                      rowsMin={2}
                      rowsMax={2}
                      labelWidth={0}
                      control={control}
                      maxLength={45}
                    />
                  </CustomTbCell>
                  <CustomTbCell>
                    <NumberInputField
                      id={`${id}-shoyou-jikan-input-${numSV}-${numRow}`}
                      name={`enjoNaiyouList[${numSV * 6 + numRow + numSV}].shoyouJikan`}
                      suffix="分"
                      labelWidth={0}
                      control={control}
                      max={9999}
                      defaultValue={null}
                    />
                  </CustomTbCell>
                  {numRow === 1 && (
                    <CustomTbCell rowSpan={6} style={{ verticalAlign: 'middle' }}>
                      <TextInputField
                        id={`${id}-ryuuiJikou-input-${numSV * 7}`}
                        name={`enjoNaiyouList[${numSV * 7}].ryuuiJikou`}
                        type="textarea"
                        rowsMin={27}
                        rowsMax={27}
                        labelWidth={0}
                        control={control}
                        maxLength={1140}
                      />
                    </CustomTbCell>
                  )}
                </TableRow>
              ))}
            <TableRow>
              <CustomThCell component="th" align="center" bl={1}>
                サービス
                <br />
                提供曜日
              </CustomThCell>
              <CustomTbCell>
                <CheckboxField id={`${id}-weeks-${numSV * 7}`} name={`enjoNaiyouList[${numSV * 7}].weeks`} checkboxes={weekOptions} orientation="horizontal" labelWidth={0} control={control} />
              </CustomTbCell>
              <CustomThCell component="th" align="center">
                サービス
                <br />
                提供時間
              </CustomThCell>
              <CustomTbCell>
                <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
                  <Grid item>
                    <TimeInputField id={`${id}-start-time-${numSV * 7}`} name={`enjoNaiyouList[${numSV * 7}].startTime`} label="実施時刻" labelWidth={100} control={control} defaultValue="" />
                  </Grid>
                  <Grid item>
                    <TimeInputField id={`${id}-end-time-${numSV * 7}`} name={`enjoNaiyouList[${numSV * 7}].endTime`} label="～" labelWidth={30} control={control} defaultValue="" />
                  </Grid>
                  <Grid item xs style={{ whiteSpace: 'nowrap' }}>
                    <GeneralIconButton
                      icon="book"
                      id={`${id}-serviceItemName-btn-${numSV}`}
                      onClick={() => {
                        handleBunreiClick(`enjoNaiyouList[${numSV * 7}].serviceItemName`, '13', 22);
                      }}>
                      文例
                    </GeneralIconButton>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <TextInputField
                    id={`${id}-service-name-input-${numSV * 7}`}
                    name={`enjoNaiyouList[${numSV * 7}].serviceItemName`}
                    type="textarea"
                    rowsMin={1}
                    rowsMax={2}
                    label="サービス種類"
                    labelWidth={100}
                    control={control}
                    maxLength={22}
                  />
                </Grid>
              </CustomTbCell>
            </TableRow>
          </React.Fragment>
        )),
    [id, control]
  );
  return (
    <>
      <LayoutItem variant="1-item-full">
        <TableContainer>
          {/* <Table stickyHeader> */}
          <Table style={{ tableLayout: 'fixed' }}>
            <CustomHead>
              <TableRow>
                <TableCell align="center" width="10%" />
                <TableCell align="center" width="14%">
                  サービス区分
                </TableCell>
                <TableCell align="center" width="26%">
                  サービス内容
                </TableCell>
                <TableCell align="center" width="14%">
                  所要時間
                </TableCell>
                <TableCell align="center">留意事項</TableCell>
              </TableRow>
            </CustomHead>
            <TableBody>{defaultRows}</TableBody>
          </Table>
        </TableContainer>
      </LayoutItem>
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn={itemKbn} maxLength={maxStr} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
    </>
  );
};

export default EnjoNaiyouForm;
