import React, { useState } from 'react';
import { DialogContent, DialogActions } from '@my/components/atomic/Dialog';
import { Grid } from '@material-ui/core';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import TimeInputField from '@my/components/molecules/TimeInputField';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';

type ShienkeikaNextHoumonDateTimeInputFormProps = {
  id: string;
  onSubmit: () => void;
};

const ShienkeikaNextHoumonDateTimeInputForm: React.FC<ShienkeikaNextHoumonDateTimeInputFormProps> = (props: ShienkeikaNextHoumonDateTimeInputFormProps) => {
  const { id, onSubmit } = props;

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

  return (
    <>
      <DialogContent>
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <CalendarInputField id={`${id}-houmon-date`} name="houmonDate" label="年月日" labelWidth={80} value={dateValue} onChange={dateHandleChange} />
          </Grid>
          <Grid item>
            <TimeInputField id={`${id}-houmon-time`} name="houmonTime" label="時間" labelWidth={60} value={timeValue} onChange={timeHandleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <GeneralIconButton icon="register" id={`${id}-save-button`} onClick={onSubmit}>
          登録
        </GeneralIconButton>
      </DialogActions>
    </>
  );
};

export default ShienkeikaNextHoumonDateTimeInputForm;
