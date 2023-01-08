import React, { useState, useMemo } from 'react';
import { useFormContext, ErrorMessage } from 'react-hook-form';
// import moment from 'moment';
import { TableContainer, Table, TableBody, TableRow, Box } from '@material-ui/core';
import { LayoutItem } from '@my/components/layouts/Form';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import Label from '@my/components/atomic/Label';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import NumberInputField from '@my/components/molecules/NumberInputField';
import TextInputField from '@my/components/molecules/TextInputField';
import { EditTabProps, CustomThCell, CustomTbCell } from '@my/containers/pages/Plan/Keikakusho';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';

export type EnjoMokuhyouType = {
  rowIndex: number;
  enjoMokuhyouType: string;
  enjoMokuhyouSeq: number;
  mokuhyou?: string;
  mokuhyouStartDate: Date | null;
  mokuhyouEndDate: Date | null;
  mokuhyouGekkan?: number;
  mokuhyouMinaoshiDate: Date | null;
  mokuhyouMinaoshiShiten?: string;
  startEndDate?: string;
};

const DiffGekkan = (startDate: Date, endDate: Date): number[] => {
  let gekkanYear: number;
  let gekkanMonth: number;
  const dtEnd = new Date(endDate.getTime());
  dtEnd.setDate(dtEnd.getDate() + 1);
  const dtGekkan = new Date(startDate.getFullYear(), 0, startDate.getDate());
  dtGekkan.setTime(dtEnd.getTime() - dtGekkan.getTime());
  gekkanYear = dtEnd.getFullYear() - startDate.getFullYear();
  gekkanMonth = dtGekkan.getMonth() - startDate.getMonth();
  if (gekkanMonth < 0) {
    gekkanYear -= 1;
    gekkanMonth += 12;
  }
  return [gekkanYear * 12 + gekkanMonth, gekkanYear, gekkanMonth, dtGekkan.getDate()];
};

const EnjoMokuhyouForm: React.FC<EditTabProps> = (props: EditTabProps) => {
  const { id } = props;
  const [{ isBunreiOpen, formName, itemKbn, maxLength: maxStr }, setBunreiOption] = useState<{ isBunreiOpen: boolean; formName: string; itemKbn: string; maxLength?: number }>({
    isBunreiOpen: false,
    formName: '',
    itemKbn: '',
  });
  const { control, getValues, watch, setValue, errors } = useFormContext();
  // console.log(errors);
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
  const tableData = useMemo(
    () =>
      [...Array(2)]
        .map((_, index) => index)
        .map((numMokuhyou) => (
          <React.Fragment key={`${id}-mokuhyou-${numMokuhyou}`}>
            <TableRow>
              <CustomThCell component="th" align="center" rowSpan={4} width="8%">
                {numMokuhyou ? '短期目標' : '長期目標'}
              </CustomThCell>
            </TableRow>
            {[...Array(3)]
              .map((_, index) => index)
              .map((numRow) => (
                <TableRow key={`${id}-mokuhyou-${numMokuhyou}-${numRow}`}>
                  <CustomTbCell width="27%">
                    <GeneralIconButton
                      icon="book"
                      id={`${id}-mokuhyou-btn-${numMokuhyou}-${numRow}`}
                      onClick={() => {
                        handleBunreiClick(`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyou`, `${(numMokuhyou + 1) * 2}`, 90);
                      }}>
                      文例
                    </GeneralIconButton>
                    <TextInputField
                      id={`${id}-mokuhyou-input-${numMokuhyou}-${numRow}`}
                      name={`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyou`}
                      type="textarea"
                      labelWidth={0}
                      maxLength={90}
                      control={control}
                    />
                  </CustomTbCell>
                  <CustomTbCell width={270}>
                    <Label id={`${id}-gekkan-lbl-${numMokuhyou}-${numRow}`} focused={false}>
                      （期間）
                    </Label>
                    <Box display="inline-block" color="#f58484">
                      <ErrorMessage errors={errors} name={`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].startEndDate`}>
                        {({ message }) => message}
                      </ErrorMessage>
                      {/* {(errors.enjoMokuhyouList && errors.enjoMokuhyouList.length > numMokuhyou * 3 + numRow && errors.enjoMokuhyouList[numMokuhyou * 3 + numRow]?.startEndDate?.message) || undefined} */}
                    </Box>
                    <Box width={270}>
                      <CalendarInputField
                        id={`${id}-mokuhyou-s-dt-${numMokuhyou}-${numRow}`}
                        name={`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouStartDate`}
                        label="自："
                        labelWidth={40}
                        control={control}
                        onChange={(dtStart: Date | null) => {
                          const { mokuhyouEndDate, mokuhyouGekkan: oldMokuhyouGekkan }: { mokuhyouEndDate?: Date | null; mokuhyouGekkan?: number | null } = watch(
                            `enjoMokuhyouList[${numMokuhyou * 3 + numRow}]`
                          );
                          let mokuhyouGekkan: number | null = null;
                          if (!(oldMokuhyouGekkan !== undefined && oldMokuhyouGekkan !== null)) {
                            if (dtStart && mokuhyouEndDate instanceof Date && dtStart.getTime() < mokuhyouEndDate.getTime()) {
                              [mokuhyouGekkan] = DiffGekkan(dtStart, mokuhyouEndDate);
                            }
                            if (mokuhyouGekkan && mokuhyouGekkan > 0) {
                              // setValue([{ [`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouGekkan`]: mokuhyouGekkan }], false);
                              setValue(`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouGekkan`, mokuhyouGekkan, false);
                            }
                          }
                        }}
                      />
                      <CalendarInputField
                        id={`${id}-mokuhyou-e-dt-${numMokuhyou}-${numRow}`}
                        name={`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouEndDate`}
                        label="至："
                        labelWidth={40}
                        control={control}
                        onChange={(dtEnd: Date | null) => {
                          const { mokuhyouStartDate, mokuhyouGekkan: oldMokuhyouGekkan }: { mokuhyouStartDate?: Date | null; mokuhyouGekkan?: number | null } = watch(
                            `enjoMokuhyouList[${numMokuhyou * 3 + numRow}]`
                          );
                          let mokuhyouGekkan: number | null = null;
                          if (!(oldMokuhyouGekkan !== undefined && oldMokuhyouGekkan !== null)) {
                            if (dtEnd && mokuhyouStartDate instanceof Date && mokuhyouStartDate.getTime() < dtEnd.getTime()) {
                              [mokuhyouGekkan] = DiffGekkan(mokuhyouStartDate, dtEnd);
                            }
                            if (mokuhyouGekkan && mokuhyouGekkan > 0) {
                              // setValue([{ [`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouGekkan`]: mokuhyouGekkan }], false);
                              setValue(`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouGekkan`, mokuhyouGekkan, false);
                            }
                          }
                        }}
                      />
                    </Box>
                    <Box display="inline-flex" alignItems="center">
                      <NumberInputField
                        id={`${id}-gekkan-input-${numMokuhyou}-${numRow}`}
                        name={`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouGekkan`}
                        suffix="月間"
                        label="期間：（"
                        labelWidth={57}
                        control={control}
                        max={9999}
                        defaultValue={null}
                      />
                      <Label id={`${id}-gekkan-${numMokuhyou}-${numRow}-label`} htmlFor={`${id}-gekkan-${numMokuhyou}-${numRow}`} focused={false} width={15}>
                        ）
                      </Label>
                    </Box>
                  </CustomTbCell>
                  <CustomTbCell>
                    <Label id={`${id}-minaosh-lbl-${numMokuhyou}-${numRow}`} focused={false}>
                      （見直しの時期及び視点）
                    </Label>
                    <Box width={215}>
                      <CalendarInputField
                        id={`${id}-minaosh-dt-${numMokuhyou}-${numRow}`}
                        name={`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouMinaoshiDate`}
                        labelWidth={0}
                        control={control}
                      />
                    </Box>
                    <GeneralIconButton
                      icon="book"
                      id={`${id}-minaosh-btn-${numMokuhyou}-${numRow}`}
                      onClick={() => {
                        handleBunreiClick(`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouMinaoshiShiten`, `${(numMokuhyou + 1) * 2 + 1}`, 50);
                      }}>
                      文例
                    </GeneralIconButton>
                    <TextInputField
                      id={`${id}-minaosh-input-${numMokuhyou}-${numRow}`}
                      name={`enjoMokuhyouList[${numMokuhyou * 3 + numRow}].mokuhyouMinaoshiShiten`}
                      type="textarea"
                      labelWidth={0}
                      maxLength={50}
                      control={control}
                    />
                  </CustomTbCell>
                </TableRow>
              ))}
          </React.Fragment>
        )),
    [id, control, errors, watch, setValue]
  );
  return (
    <>
      <LayoutItem variant="1-item-full">
        <TableContainer>
          <Table>
            <TableBody>{tableData}</TableBody>
          </Table>
        </TableContainer>
      </LayoutItem>
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn={itemKbn} maxLength={maxStr} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
    </>
  );
};

export default EnjoMokuhyouForm;
