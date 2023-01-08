import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid } from '@material-ui/core';
import { LayoutItem } from '@my/components/layouts/Form';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import Title from '@my/components/atomic/Title';
import Label from '@my/components/atomic/Label';
import TextInputField from '@my/components/molecules/TextInputField';
import { EditTabProps } from '@my/containers/pages/Plan/Keikakusho';
import BunreiDialog, { BunreiType } from '@my/containers/pages/Common/BunreiDialog';

export type HonninFamilyType = {
  sintaiKaigoNaiyou?: string;
  seikatsuEnjoNaiyou?: string;
  tsuuinJoukouKaijoNaiyou?: string;
  honninFamilyIkou?: string;
  honninFamilyNegai?: string;
};

const HonninFamilyForm: React.FC<EditTabProps> = (props: EditTabProps) => {
  const { id, headerTabId } = props;
  const [{ isBunreiOpen, formName, itemKbn, maxLength: maxStr }, setBunreiOption] = useState<{ isBunreiOpen: boolean; formName: string; itemKbn: string; maxLength?: number }>({
    isBunreiOpen: false,
    formName: '',
    itemKbn: '',
  });
  // itemKbn: 6 ～ 10 //
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
  return (
    <>
      <LayoutItem variant="1-item-full">
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
          {headerTabId === '1' ? (
            <>
              <Grid item xs={12}>
                <Title id={`${id}-ikou-kibou-title`}>本人及び家族の意向・希望</Title>
              </Grid>
              <Grid item xs={6}>
                <Label id={`${id}-sintai-label`} htmlFor={`${id}-sintai-input`} focused={false}>
                  （身体介護に関すること）
                </Label>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <GeneralIconButton
                  icon="book"
                  id={`${id}-sintai-btn`}
                  onClick={() => {
                    handleBunreiClick('sintaiKaigoNaiyou', '6', 200);
                  }}>
                  文例
                </GeneralIconButton>
              </Grid>
              <Grid item xs={12}>
                <TextInputField id={`${id}-sintai-input`} name="sintaiKaigoNaiyou" type="textarea" labelWidth={0} control={control} maxLength={200} />
              </Grid>
              <Grid item xs={6}>
                <Label id={`${id}-seikatsu-label`} htmlFor={`${id}-seikatsu-input`} focused={false}>
                  （生活援助に関すること）
                </Label>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <GeneralIconButton
                  icon="book"
                  id={`${id}-seikatsu-btn`}
                  onClick={() => {
                    handleBunreiClick('seikatsuEnjoNaiyou', '7', 200);
                  }}>
                  文例
                </GeneralIconButton>
              </Grid>
              <Grid item xs={12}>
                <TextInputField id={`${id}-seikatsu-input`} name="seikatsuEnjoNaiyou" type="textarea" labelWidth={0} control={control} maxLength={200} />
              </Grid>
              <Grid item xs={6}>
                <Label id={`${id}-tsuuin-label`} htmlFor={`${id}-tsuuin-input`} focused={false}>
                  （通院乗降介助に関すること）
                </Label>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <GeneralIconButton
                  icon="book"
                  id={`${id}-tsuuin-btn`}
                  onClick={() => {
                    handleBunreiClick('tsuuinJoukouKaijoNaiyou', '8', 200);
                  }}>
                  文例
                </GeneralIconButton>
              </Grid>
              <Grid item xs={12}>
                <TextInputField id={`${id}-tsuuin-input`} name="tsuuinJoukouKaijoNaiyou" type="textarea" labelWidth={0} control={control} maxLength={200} />
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={6}>
                <Title id={`${id}-ikou-kibou-title`}>本人及び家族の意向・希望</Title>
              </Grid>
              <Grid item xs={6} style={{ textAlign: 'right' }}>
                <GeneralIconButton
                  icon="book"
                  id={`${id}-ikou-kibou-btn`}
                  onClick={() => {
                    handleBunreiClick('honninFamilyIkou', '9', 600);
                  }}>
                  文例
                </GeneralIconButton>
              </Grid>
              <Grid item xs={12}>
                <TextInputField id={`${id}-ikou-kibou-input`} name="honninFamilyIkou" type="textarea" labelWidth={0} control={control} maxLength={600} />
              </Grid>
            </>
          )}
        </Grid>
      </LayoutItem>
      <LayoutItem variant="1-item-full">
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Title id={`${id}-onegai-title`}>本人及びご家族様へのお願い</Title>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <GeneralIconButton
              icon="book"
              id={`${id}-onegai-btn`}
              onClick={() => {
                handleBunreiClick('honninFamilyNegai', '10', 200);
              }}>
              文例
            </GeneralIconButton>
          </Grid>
          <Grid item xs={12}>
            <TextInputField id={`${id}-onegai-input`} name="honninFamilyNegai" type="textarea" labelWidth={0} control={control} maxLength={200} />
          </Grid>
        </Grid>
      </LayoutItem>
      {isBunreiOpen && <BunreiDialog gyoumuBunreiSeq={1} itemKbn={itemKbn} maxLength={maxStr} onReturnClick={handleBunreiClose} onSaveClick={handleBunreiSaveClick} />}
    </>
  );
};

export default HonninFamilyForm;
