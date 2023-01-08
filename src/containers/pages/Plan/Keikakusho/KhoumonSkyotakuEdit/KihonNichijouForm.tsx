import React, { useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { RootState, useTypedSelector } from '@my/stores';
import { useFetchCaremaneStaffList } from '@my/action-hooks/plan/keikakusho/keikakushoKhoumonSkyotaku';
import { LabelAndValue } from '@my/components/atomic/ComboBox';
import { TableContainer, Table, TableBody, TableRow, Box, Grid } from '@material-ui/core';
import { LayoutItem, InlineFormControl } from '@my/components/layouts/Form';
import DataDisplay from '@my/components/atomic/DataDisplay';
import Label from '@my/components/atomic/Label';
import Title from '@my/components/atomic/Title';
import Button from '@my/components/atomic/Button';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import TextInputField from '@my/components/molecules/TextInputField';
import NumberInputField from '@my/components/molecules/NumberInputField';
import { EditTabProps, CustomThCell, CustomTbCell } from '@my/containers/pages/Plan/Keikakusho';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import SearchRenrakusakiDialog, { SearchRenrakusakiType } from '@my/containers/pages/Common/SearchRenrakusakiDialog';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';

const SexDataDisplay = styled(DataDisplay)<{ sex?: string }>`
  color: ${({ sex }) => (sex === '2' ? '#e40060' : sex === '1' ? '#2196f3' : '#000000')};
`;
const InlineBlockDataDisplay = styled(DataDisplay)`
  display: inline-block;
` as typeof DataDisplay;
// ※ c1140-01.利用者負担と同様の値をもうけること //
const autoCompleteFutanJougenGetsugakuList: number[] = [0, 9300, 37200];

export type KihonNichijouType = {
  keikakuSakuseiStaffName?: string;
  zenkaiKeikakuSakuseiDate: Date | null;
  riyoushaName?: string;
  sexKbn?: LabelAndValue;
  birthDate?: number;
  age?: number;
  address?: string;
  tel1?: string;
  youkaigoKaigodoNinteiDate: Date | null;
  youkaigoShougaiShien?: LabelAndValue;
  futangakuJougen?: number;
  shuKaigoshaName?: string;
  shuKaigoshaTsuzukigaraName?: string;
  shuKaigoshaAddress?: string;
  shuKaigoshaTel1?: string;
  shuKaigoshaTel2?: string;
  kyotakuOfficeName?: string;
  kyotakuOfficeCode?: string;
  careLicenseStaffName?: string;
  shintaiKaigoJikan?: number;
  kajiEnjyoJikan?: number;
  jyuudohoumonKaigoJikan?: number;
  tsuuinJoukouKaijoJikan?: number;
  doukouEngoJikan?: number;
  koudouEngoJikan?: number;
  riyoushaDescriptionDate: Date | null;
  riyoushaDescriptionStaffName?: string;
  nichijouSeikatsuZenpan?: string;
};

const ControlSexDataDisplay = (props: { id: string; value?: LabelAndValue }) => {
  const { id, value = { label: '', value: '' } } = props;
  // const sexName = value === '2' ? '女' : value === '1' ? '女' : '';
  return <SexDataDisplay id={id} sex={value.value} value={value.label} />;
};

const KihonNichijouForm: React.FC<EditTabProps> = (props: EditTabProps) => {
  const { id, headerTabId } = props;

  const fetchCaremaneStaffList = useFetchCaremaneStaffList();
  const { errors, control, getValues, setValue } = useFormContext<KihonNichijouType>();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBunreiOpen, setIsBunreiOpen] = useState<boolean>(false);
  const { kihonInfo, staffList, youkaigodoList, officeList, renrakuList, shougaiSeidoKbnList, caremaneStaffList } = useTypedSelector((state: RootState) => state.keikakushoKhoumonSkyotaku);
  const autoCompleteStaffList = useMemo(() => staffList.map((value) => value.label || ''), [staffList]);
  const cbYoukaigodoList = useMemo(() => youkaigodoList.map((value): LabelAndValue => ({ label: value.youkaigodoName, value: value.youkaigodoCode })), [youkaigodoList]);
  const autoCompleteOfficeList = useMemo(() => officeList.map((value) => value.office.label || ''), [officeList]);
  const autoCompleteRenrakuList = useMemo(() => renrakuList.map((value) => value.label || ''), [renrakuList]);
  const autoCompleteCaremaneStaffList = useMemo(() => caremaneStaffList.map((value) => value.label || ''), [caremaneStaffList]);
  const [kyotakuOfficeName, setKyotakuOfficeName] = useState(getValues('kyotakuOfficeName'));

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };
  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };
  const handleSaveClick = (item: SearchRenrakusakiType) => {
    setValue(
      [
        { shuKaigoshaName: item.renrakuKanjiName },
        { shuKaigoshaTsuzukigaraName: item.tsuzukigaraName || '' },
        { shuKaigoshaAddress: item.address || '' },
        { shuKaigoshaTel1: item.tel1 || '' },
        { shuKaigoshaTel2: item.tel2 || '' },
      ],
      false
    );
    setIsSearchOpen(false);
  };
  const handleBunreiClick = () => {
    setIsBunreiOpen(true);
  };
  const handleBunreiClose = () => {
    setIsBunreiOpen(false);
  };
  const handleBunreiSaveClick = (item: BunreiType) => {
    const nichijouSeikatsuZenpan = getValues('nichijouSeikatsuZenpan') || '';
    setValue('nichijouSeikatsuZenpan', nichijouSeikatsuZenpan + item.bunrei, false);
    setIsBunreiOpen(false);
  };
  const SearchOfficeCode = (searchName: string) => {
    // const searchIndex = officeList.findIndex((value) => value.office.label === searchName);
    return officeList.find((value) => value.office.label === searchName);
  };
  const handleKyotakuOfficeNameBlur = async (officeName: string) => {
    const isOfficeChange = kyotakuOfficeName !== officeName;
    const officeCode = getValues('kyotakuOfficeCode');
    const searchOfficeCode = SearchOfficeCode(officeName);

    if (!officeCode && officeName) {
      if (searchOfficeCode) {
        setValue('kyotakuOfficeCode', searchOfficeCode.officeCode, false);
      }
    }
    if (isOfficeChange) {
      await fetchCaremaneStaffList(searchOfficeCode);
      setKyotakuOfficeName(officeName);
    }
  };

  return (
    <>
      <LayoutItem variant="1-item-full">
        <Box pb={1}>
          <Title id={`${id}-kihon-title`}>利用者基本情報</Title>
        </Box>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <CustomThCell component="th" align="center" width="10%">
                  作成担当者
                </CustomThCell>
                <CustomTbCell colSpan={2} width="26%">
                  <TextInputField
                    id={`${id}-sakusei-staff-txt`}
                    name="keikakuSakuseiStaffName"
                    type="text"
                    autoCompleteOptions={autoCompleteStaffList}
                    imeMode="auto"
                    labelWidth={0}
                    control={control}
                    defaultValue=""
                    maxLength={10}
                  />
                </CustomTbCell>
                <CustomThCell component="th" align="center" colSpan={4}>
                  前回作成年月日
                </CustomThCell>
                <CustomTbCell colSpan={5}>
                  <Box width={220}>
                    <CalendarInputField id={`${id}-zenkai-sakusei-dt`} name="zenkaiKeikakuSakuseiDate" labelWidth={0} control={control} />
                  </Box>
                </CustomTbCell>
              </TableRow>
              <TableRow>
                <CustomThCell component="th" align="center">
                  利用者氏名
                </CustomThCell>
                <CustomTbCell colSpan={2}>
                  <DataDisplay id={`${id}-riyousha-lbl`} value={kihonInfo.riyoushaName} />
                </CustomTbCell>
                <CustomThCell component="th" align="center" colSpan={2} width="6%">
                  性別
                </CustomThCell>
                <CustomTbCell align="center" colSpan={2} width="4%">
                  <ControlSexDataDisplay id={`${id}-sex-lbl`} value={kihonInfo.sexKbn} />
                </CustomTbCell>
                <CustomThCell component="th" align="center" width="6%">
                  住所
                </CustomThCell>
                <CustomTbCell align="right" colSpan={4}>
                  <Box whiteSpace="normal" textAlign="left">
                    <InlineBlockDataDisplay id={`${id}-jusho-lbl`} value={kihonInfo.address} />
                  </Box>
                  <Box display="inline-flex" whiteSpace="nowrap">
                    <InlineFormControl id={`${id}-tel`} label="（電話番号：">
                      <DataDisplay id={`${id}-tel-lbl`} value={kihonInfo.tel1} />
                      <Label id={`${id}-tel-end-lbl`} htmlFor={`${id}-tel`} focused={false} width={15}>
                        ）
                      </Label>
                    </InlineFormControl>
                  </Box>
                </CustomTbCell>
              </TableRow>
              <TableRow>
                <CustomThCell component="th" align="center">
                  生年月日
                </CustomThCell>
                <CustomTbCell width="16%">
                  <InlineBlockDataDisplay id={`${id}-birthday-lbl`} type="date" value={kihonInfo.birthDate} />
                  <InlineBlockDataDisplay id={`${id}-age-lbl`} prefix="（" suffix="歳）" value={kihonInfo.age} />
                </CustomTbCell>
                {headerTabId === '1' ? (
                  <>
                    <CustomThCell component="th" align="center">
                      要介護認定日
                    </CustomThCell>
                    <CustomTbCell align="center" colSpan={5}>
                      <Box width={220}>
                        <CalendarInputField id={`${id}-youkaigo-dt`} name="youkaigoKaigodoNinteiDate" labelWidth={0} control={control} />
                      </Box>
                    </CustomTbCell>
                    <CustomThCell component="th" align="center" width="8%">
                      要介護度
                    </CustomThCell>
                    <CustomTbCell>
                      <Box width={220}>
                        <ComboBoxField id={`${id}-youkaigo-cmb`} name="youkaigoShougaiShien" options={cbYoukaigodoList} multiple={false} clearable labelWidth={0} control={control} />
                      </Box>
                    </CustomTbCell>
                  </>
                ) : (
                  <>
                    <CustomThCell component="th" align="center">
                      障害支援区分
                    </CustomThCell>
                    <CustomTbCell align="center" colSpan={5}>
                      <Box width={220}>
                        <ComboBoxField id={`${id}-shougai-cmb`} name="youkaigoShougaiShien" options={shougaiSeidoKbnList} multiple={false} clearable labelWidth={0} control={control} />
                      </Box>
                    </CustomTbCell>
                    <CustomThCell component="th" align="center" width="10%">
                      負担上限額
                    </CustomThCell>
                    <CustomTbCell>
                      <Box width={220}>
                        <NumberInputField
                          id={`${id}-futan-jougen-txt`}
                          name="futangakuJougen"
                          suffix="円"
                          autoCompleteOptions={autoCompleteFutanJougenGetsugakuList}
                          labelWidth={0}
                          control={control}
                          error={!!errors.futangakuJougen}
                          errorMessage={errors.futangakuJougen?.message}
                          max={99999}
                          defaultValue={null}
                        />
                      </Box>
                    </CustomTbCell>
                  </>
                )}
              </TableRow>
              {headerTabId === '1' ? (
                <>
                  <TableRow>
                    <CustomThCell component="th" align="center">
                      主たる介護者
                      <Button id={`${id}-renraku-saki-btn`} variant="outlined" onClick={handleSearchClick}>
                        連絡先検索
                      </Button>
                    </CustomThCell>
                    <CustomTbCell colSpan={2}>
                      <TextInputField
                        id={`${id}-renraku-saki-name-txt`}
                        name="shuKaigoshaName"
                        type="text"
                        autoCompleteOptions={autoCompleteRenrakuList}
                        imeMode="auto"
                        labelWidth={0}
                        control={control}
                        maxLength={10}
                        defaultValue=""
                      />
                      <TextInputField
                        id={`${id}-renraku-saki-tsuzukigara-txt`}
                        name="shuKaigoshaTsuzukigaraName"
                        type="text"
                        label="続柄"
                        labelWidth={35}
                        control={control}
                        maxLength={20}
                        defaultValue=""
                      />
                    </CustomTbCell>
                    <CustomThCell component="th" align="center" colSpan={4}>
                      連絡先
                    </CustomThCell>
                    <CustomTbCell colSpan={5}>
                      <TextInputField id={`${id}-renraku-saki-jusho-txt`} name="shuKaigoshaAddress" type="text" labelWidth={0} control={control} maxLength={500} defaultValue="" />
                      {/* <TextInputField id={`${id}-renraku-saki-tel-tel1`} name="shuKaigoshaTel1" type="tel" label="電話番号" maxLength={30} imeMode="disabled" control={control} defaultValue="" /> */}
                      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1}>
                        <Grid item xs={6}>
                          <TextInputField
                            id={`${id}-renraku-saki-tel-tel1`}
                            name="shuKaigoshaTel1"
                            type="tel"
                            label="電話番号1"
                            labelWidth={76}
                            maxLength={30}
                            imeMode="disabled"
                            control={control}
                            defaultValue=""
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextInputField
                            id={`${id}-renraku-saki-tel-tel2`}
                            name="shuKaigoshaTel2"
                            type="tel"
                            label="電話番号2"
                            labelWidth={76}
                            maxLength={30}
                            imeMode="disabled"
                            control={control}
                            defaultValue=""
                          />
                        </Grid>
                      </Grid>
                    </CustomTbCell>
                  </TableRow>
                  <TableRow>
                    <CustomThCell component="th" align="center">
                      居宅支援事業所
                      <br />
                      （事業所番号）
                    </CustomThCell>
                    <CustomTbCell colSpan={7}>
                      <TextInputField
                        id={`${id}-office-name-txt`}
                        name="kyotakuOfficeName"
                        type="text"
                        autoCompleteOptions={autoCompleteOfficeList}
                        imeMode="auto"
                        labelWidth={0}
                        onBlur={handleKyotakuOfficeNameBlur}
                        control={control}
                        maxLength={50}
                        defaultValue=""
                      />
                      <TextInputField id={`${id}-office-no-input`} name="kyotakuOfficeCode" type="text" labelWidth={0} control={control} maxLength={10} defaultValue="" />
                    </CustomTbCell>
                    <CustomThCell component="th" align="center" width="10%">
                      介護支援専門員
                    </CustomThCell>
                    <CustomTbCell colSpan={3}>
                      <TextInputField
                        id={`${id}-shien-staff-txt`}
                        name="careLicenseStaffName"
                        type="text"
                        autoCompleteOptions={autoCompleteCaremaneStaffList}
                        imeMode="auto"
                        labelWidth={0}
                        control={control}
                        maxLength={10}
                        defaultValue=""
                      />
                    </CustomTbCell>
                  </TableRow>
                </>
              ) : (
                <>
                  <TableRow>
                    <CustomThCell component="th" align="center" rowSpan={2}>
                      サービス内容
                    </CustomThCell>
                    <CustomTbCell colSpan={10}>
                      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                          <NumberInputField id={`${id}-shintai-txt`} label="身体介護：" name="shintaiKaigoJikan" suffix="時間" max={99999.99} scale={2} control={control} defaultValue={null} />
                        </Grid>
                        <Grid item xs={4}>
                          <NumberInputField id={`${id}-kazoku-txt`} label="家事援助：" name="kajiEnjyoJikan" suffix="時間" max={99999.99} scale={2} control={control} defaultValue={null} />
                        </Grid>
                        <Grid item xs={4}>
                          <NumberInputField id={`${id}-jyuudo-txt`} label="重度訪問介護：" name="jyuudohoumonKaigoJikan" suffix="時間" max={99999.99} scale={2} control={control} defaultValue={null} />
                        </Grid>
                      </Grid>
                    </CustomTbCell>
                  </TableRow>
                  <TableRow>
                    <CustomTbCell colSpan={11}>
                      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
                        <Grid item xs={4}>
                          <NumberInputField id={`${id}-tsuuin-txt`} label="通院介助：" name="tsuuinJoukouKaijoJikan" suffix="時間" max={99999.99} scale={2} control={control} defaultValue={null} />
                        </Grid>
                        <Grid item xs={4}>
                          <NumberInputField id={`${id}-doukou-txt`} label="同行援護：" name="doukouEngoJikan" suffix="時間" max={99999.99} scale={2} control={control} defaultValue={null} />
                        </Grid>
                        <Grid item xs={4}>
                          <NumberInputField id={`${id}-koudou-txt`} label="行動援護：" name="koudouEngoJikan" suffix="時間" max={99999.99} scale={2} control={control} defaultValue={null} />
                        </Grid>
                      </Grid>
                    </CustomTbCell>
                  </TableRow>
                </>
              )}
              <TableRow>
                <CustomThCell component="th" align="center">
                  利用者説明日
                </CustomThCell>
                <CustomTbCell>
                  <Box width={220}>
                    <CalendarInputField id={`${id}-setsumei-dt`} name="riyoushaDescriptionDate" labelWidth={0} control={control} />
                  </Box>
                </CustomTbCell>
                <CustomThCell component="th" align="center">
                  説明担当者
                </CustomThCell>
                <CustomTbCell colSpan={headerTabId === '1' ? 7 : 8}>
                  <TextInputField
                    id={`${id}-setsumei-staff-txt`}
                    name="riyoushaDescriptionStaffName"
                    type="text"
                    autoCompleteOptions={autoCompleteStaffList}
                    imeMode="auto"
                    labelWidth={0}
                    control={control}
                    maxLength={10}
                    defaultValue=""
                  />
                </CustomTbCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </LayoutItem>
      <LayoutItem variant="1-item-full">
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Box pt={1}>
              <Title id={`${id}-nichijou-title`}>日常生活全般の状況</Title>
            </Box>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <GeneralIconButton icon="book" id={`${id}-nichijou-btn`} onClick={handleBunreiClick}>
              文例
            </GeneralIconButton>
          </Grid>
          <Grid item xs={12}>
            <TextInputField id={`${id}-nichijou-input`} name="nichijouSeikatsuZenpan" type="textarea" labelWidth={0} control={control} maxLength={250} defaultValue="" />
          </Grid>
        </Grid>
      </LayoutItem>
      {isSearchOpen && <SearchRenrakusakiDialog onReturnClick={handleSearchClose} onSaveClick={handleSaveClick} />}
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn="1" maxLength={250} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
    </>
  );
};

export default KihonNichijouForm;
