import React, { useState } from 'react';
import { DialogContent, DialogActions } from '@my/components/atomic/Dialog';
import { Badge, Box, Grid } from '@material-ui/core';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import TimeInputField from '@my/components/molecules/TimeInputField';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import OptionButtonField from '@my/components/molecules/OptionButtonField';
import Checkbox from '@my/components/atomic/Checkbox';
import Label from '@my/components/atomic/Label';
import TextInputField from '@my/components/molecules/TextInputField';

import ShienkeikaKagenzanSettingEditForm from './ShienkeikaKagenzanSettingEditForm';

type ShienkeikaInputFormProps = {
  id: string;
  onSubmit: () => void;
  // onSubmit: (data: RiyoushaKihonBase) => Promise<void>;
  isKaigo: boolean;
  isYobou: boolean;
  isIkkatu: boolean;
};

const ShienkeikaInputForm: React.FC<ShienkeikaInputFormProps> = (props: ShienkeikaInputFormProps) => {
  const { id, onSubmit, isKaigo, isYobou, isIkkatu } = props;

  // 担当ケアマネプルダウン
  const tantouCareManagerOptions: LabelAndValue[] = [
    { value: '1', label: '日本　一郎' },
    { value: '2', label: '日本　二郎' },
  ];
  const [tantouCareManagerValue, setTantouCareManagerValue] = useState<LabelAndValue | undefined>({ value: '1', label: '日本　一郎' });
  const tantouCareManagerHandleChange = (value?: LabelAndValue | Array<LabelAndValue>) => {
    if (value !== undefined && !Array.isArray(value)) {
      setTantouCareManagerValue(value);
    }
  };

  // 介護/予防 オプションボタン
  const serviceKindOptions = [
    { label: '介護', value: '43' },
    { label: '予防', value: '46' },
  ];
  const [serviceKindValue, setServiceKindValue] = useState<string>('43');
  const serviceKindHandleChange = (value: string) => {
    setServiceKindValue(value);
  };

  // 年月日
  const [dateValue, setDateValue] = useState<Date | null>(new Date(1672475400000));
  const dateHandleChange = (value: Date | null) => {
    setDateValue(value);
  };

  // 時間
  const [timeValue, setTimeValue] = useState<string>('17:00');
  const timeHandleChange = (value: string) => {
    setTimeValue(value);
  };

  // 加減算設定ボタン押下時
  const [isOpenKagenzanEditModal, setIsOpenKagenzanEditModal] = useState<boolean>(false);
  const handleClickKagenzanSetting = () => {
    console.log('行削除ボタン押下');
    setIsOpenKagenzanEditModal(true);
  };

  // 項目-文例ボタン押下時
  const handleClickKoumokuBunrei = () => {
    console.log('項目-文例ボタン押下');
  };

  // 内容-文例ボタン押下時
  const handleClickNaiyouBunrei = () => {
    console.log('内容-文例ボタン押下');
  };

  return (
    <>
      {isOpenKagenzanEditModal && (
        <ShienkeikaKagenzanSettingEditForm
          id="shienkeika-kagenzan-edit"
          setIsOpenModal={setIsOpenKagenzanEditModal}
          isKaigo={isKaigo}
          isYobou={isYobou}
          isIkkatu={isIkkatu}
          editServiceKindValue={serviceKindValue}
        />
      )}
      <DialogContent>
        <Grid container direction="row">
          <Grid item>
            <Box mt={1} />
          </Grid>
        </Grid>
        <Grid container direction="row" spacing={2}>
          <Grid item md={5}>
            <ComboBoxField
              id={`${id}-tantousha`}
              name="tantousha"
              label="担当ケアマネ"
              labelWidth={120}
              options={tantouCareManagerOptions}
              value={tantouCareManagerValue}
              onChange={tantouCareManagerHandleChange}
              clearable={false}
              required
            />
          </Grid>
          {isIkkatu && (
            <Grid item md={3}>
              <OptionButtonField id={`${id}-servicekind`} name="servicekind" label="区分" labelWidth={60} options={serviceKindOptions} value={serviceKindValue} onChange={serviceKindHandleChange} />
            </Grid>
          )}
          <Grid item md={isIkkatu ? 4 : 7}>
            <Grid container direction="row" justify="flex-end">
              <Grid item>
                <Badge badgeContent="有" color="primary">
                  <GeneralIconButton icon="edit" id={`${id}-kgenzan-setting-edit`} onClick={handleClickKagenzanSetting}>
                    加減算設定
                  </GeneralIconButton>
                </Badge>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <CalendarInputField required id={`${id}-houmon-date`} name="houmonDate" label="年月日" labelWidth={120} value={dateValue} onChange={dateHandleChange} />
          </Grid>
          <Grid item>
            <TimeInputField id={`${id}-houmon-time`} name="houmonTime" label="時間" labelWidth={60} value={timeValue} onChange={timeHandleChange} />
          </Grid>
          <Grid item>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item>
                <Label id={`${id}-houmon-jisshi-label`}>訪問実施</Label>
              </Grid>
              <Grid item>
                <Checkbox id={`${id}-houmon-jisshi`} name="houmonJisshi" size="medium" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" justify="flex-end" spacing={2}>
          <Grid item>
            <GeneralIconButton icon="book" id={`${id}-koumoku-bunrei`} onClick={handleClickKoumokuBunrei}>
              文例
            </GeneralIconButton>
          </Grid>
        </Grid>
        <Box mb={1} />
        <TextInputField id={`${id}-koumoku`} name="koumoku" type="textarea" label="項目" labelWidth={120} rowsMin={4} fullWidth />
        <Box mb={2} />
        <Grid container direction="row" alignItems="center" justify="flex-end" spacing={2}>
          <Grid item>
            <GeneralIconButton icon="book" id={`${id}-koumoku-naiyou`} onClick={handleClickNaiyouBunrei}>
              文例
            </GeneralIconButton>
          </Grid>
        </Grid>
        <Box mb={1} />
        <TextInputField id={`${id}-naiyou`} name="naiyou" type="textarea" label="内容" labelWidth={120} rowsMin={4} fullWidth />
      </DialogContent>
      <DialogActions>
        <GeneralIconButton icon="register" id={`${id}-save-button`} onClick={onSubmit}>
          登録
        </GeneralIconButton>
      </DialogActions>
    </>
  );
};

export default ShienkeikaInputForm;
