import React, { useState } from 'react';
import { DialogContent, DialogActions } from '@my/components/atomic/Dialog';
import { Box } from '@material-ui/core';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import ComboBoxField from '@my/components/molecules/ComboBoxField';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';

type ShienkeikaRiyoushaSelectProps = {
  id: string;
  onNext: () => void;
};

const ShienkeikaRiyoushaSelect: React.FC<ShienkeikaRiyoushaSelectProps> = (props: ShienkeikaRiyoushaSelectProps) => {
  const { id, onNext } = props;

  // 利用者名プルダウン
  const tantoushaPptions: LabelAndValue[] = [
    { value: '1', label: '日本　一郎' },
    { value: '2', label: '日本　二郎' },
  ];
  const [tantoushaValue, setTantoushaValue] = useState<LabelAndValue | undefined>({ value: '1', label: '日本　一郎' });
  const tantoushaHandleChange = (value?: LabelAndValue | Array<LabelAndValue>) => {
    if (value !== undefined && !Array.isArray(value)) {
      setTantoushaValue(value);
    }
  };

  return (
    <>
      <DialogContent>
        <Box width={400}>
          <ComboBoxField
            id={`${id}-tantousha`}
            name="tantousha"
            label="利用者名"
            labelWidth={100}
            options={tantoushaPptions}
            value={tantoushaValue}
            onChange={tantoushaHandleChange}
            clearable={false}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <GeneralIconButton icon="register" id={`${id}-save-button`} onClick={onNext}>
          次へ
        </GeneralIconButton>
      </DialogActions>
    </>
  );
};

export default ShienkeikaRiyoushaSelect;
