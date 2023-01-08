import React, { useEffect } from 'react';
import { Box, Grid } from '@material-ui/core';
import { DialogContent, DialogActions } from '@my/components/atomic/Dialog';
import GeneralIconButton from '@my/components/molecules/GeneralIconButton';
import SwitchButton from '@my/components/atomic/SwitchButton';
import Label from '@my/components/atomic/Label';
import { LayoutItem } from '@my/components/layouts/Form';
import Button from '@my/components/atomic/Button';
import yup from '@my/yup';
import { FormContext, useForm, useFormContext } from 'react-hook-form';
import TextInputField from '@my/components/molecules/TextInputField';
import GlobalMessagePanel from '@my/containers/organisms/GlobalMessagePanel';
import { usePostOutputSetting, useSetDirtyOutputSettingForm } from '@my/action-hooks/plan/careplan';
import { OutputSetting } from 'maps4nc-frontend-web-api/dist/lib/model';

type DouiranContentsType = {
  title: string;
  id: string;
  switchName: string;
  inputName: string;
  textType?: 'text' | 'textarea';
  isDisplaySwitch?: boolean;
  defaultValue: string;
};

type DouiranItemsType = {
  id: string;
  switchName: string;
  statement: string;
  width?: number;
};

export type OutputSettingDialogFormType = {
  isInkanPrint?: boolean;
  /* 居宅サービス計画書（１） */
  isPlanKyotakuServiceKeikakusho1Doui?: boolean;
  planKyotakuServiceKeikakusho1Doui?: string;
  /* 居宅サービス計画書（２） */
  isPlanKyotakuServiceKeikakusho2Doui?: boolean;
  planKyotakuServiceKeikakusho2Doui?: string;
  /* 週間サービス計画書 */
  isPlanShuukanKeikakuhyouDoui?: boolean;
  planShuukanKeikakuhyouDoui?: string;
  /* 介護予防サービス・支援計画書 */
  isPlanKaigoyobouShienkeikakuDoui?: boolean;
  planKaigoyobouShienkeikakuDoui?: string;
  /* 介護予防週間支援計画書 */
  isPlanKaigoyobouShuukanKeikakuhyouDoui?: boolean;
  planKaigoyobouShuukanKeikakuhyouDoui?: string;
  /* 利用者基本情報 */
  planRiyoushaKihonInfoDoui?: string;
  /* 支援経過のデータ作成フラグ */
  isShienkeikaDatasakusei?: boolean;
};

const OutputSettingDialogFormSchema = yup.object({
  isInkanPrint: yup.string().required().label('同意欄の「印」を表示する'),
  planKyotakuServiceKeikakusho1Doui: yup.string().label('居宅サービス計画書（１）'),
  planKyotakuServiceKeikakusho2Doui: yup.string().label('居宅サービス計画書（２）'),
  planShuukanKeikakuhyouDoui: yup.string().label('週間サービス計画表'),
  planKaigoyobouShienkeikakuDoui: yup.string().label('介護予防サービス・支援計画書'),
  planKaigoyobouShuukanKeikakuhyouDoui: yup.string().label('介護予防週間支援計画表'),
  planRiyoushaKihonInfoDoui: yup.string().label('利用者基本情報'),
});

const DouiranContents = (props: DouiranContentsType) => {
  const { title, id, switchName, inputName, textType = 'text', isDisplaySwitch = true, defaultValue } = props;
  const formMethods = useFormContext();
  const { control, setValue, errors } = formMethods;

  const handleReset = () => {
    setValue(`${inputName}`, defaultValue);
  };

  return (
    <>
      <LayoutItem variant="1-item-full">
        <Box mt={2}>
          <Label id={`${id}-label`} width={200}>
            {title}
          </Label>
        </Box>
      </LayoutItem>
      <Grid container justify="flex-start" direction="row">
        <Grid item xs={2}>
          <Box>{isDisplaySwitch && <DouiranItems id={id} switchName={switchName} statement="同意欄を表示" />}</Box>
        </Grid>
        <Grid item xs={8}>
          <Box ml={2} mr={1}>
            <TextInputField
              type={textType}
              id={`${id}-disp-input`}
              name={inputName}
              rowsMin={5}
              fullWidth
              labelWidth={0}
              control={control}
              error={!!errors[`${inputName}`]}
              errorMessage={errors[`${inputName}`]?.message}
            />
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box mt={0.5} minWidth={100}>
            <Button id={`${id}-disp-button`} onClick={handleReset}>
              リセット
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const DouiranItems = (props: DouiranItemsType) => {
  const { id, switchName, statement, width = 100 } = props;
  const formMethods = useFormContext();
  const { control } = formMethods;

  return (
    <>
      <Label id={`${id}-label`} width={width}>
        <SwitchButton id={`${id}-disp-switch`} name={switchName} size="medium" control={control} />
        {statement}
      </Label>
    </>
  );
};

type Props = {
  screenID: string;
  defaultValues: OutputSettingDialogFormType;
};
const OutputSettingDialogContents: React.FC<Props> = (props: Props) => {
  const { screenID, defaultValues } = props;
  const formMethods = useForm<OutputSettingDialogFormType>({
    mode: 'onChange',
    defaultValues,
    validationSchema: OutputSettingDialogFormSchema,
  });
  const postOutputSetting = usePostOutputSetting(screenID);
  const setDirtyOutputSettingForm = useSetDirtyOutputSettingForm();

  const { handleSubmit, formState } = formMethods;
  const { dirty } = formState;

  const handleSubmitForm = handleSubmit(async (data) => {
    const saveData: OutputSetting = {
      officeSeq: 1,
      ...data,
    };
    await postOutputSetting(saveData);
  });

  // dirty制御
  useEffect(() => {
    setDirtyOutputSettingForm(dirty);
  }, [setDirtyOutputSettingForm, dirty]);

  return (
    <>
      <DialogContent>
        <GlobalMessagePanel screenID={screenID} mb={1} />
        <FormContext {...formMethods}>
          <LayoutItem variant="1-item-full">
            <DouiranItems id="douiran-mark" switchName="isInkanPrint" statement="同意欄の「印」を表示する" width={200} />
          </LayoutItem>
          <DouiranContents
            title="居宅サービス計画書（１）"
            id="kyotaku-service-1"
            switchName="isPlanKyotakuServiceKeikakusho1Doui"
            inputName="planKyotakuServiceKeikakusho1Doui"
            defaultValue="計画書の内容を十分理解しましたので、同意いたします。"
          />
          <DouiranContents
            title="居宅サービス計画書（２）"
            id="kyotaku-service-2"
            switchName="isPlanKyotakuServiceKeikakusho2Doui"
            inputName="planKyotakuServiceKeikakusho2Doui"
            defaultValue="計画書の内容を十分理解しましたので、同意いたします。"
          />
          <DouiranContents
            title="週間サービス計画表"
            id="shuukan-service"
            switchName="isPlanShuukanKeikakuhyouDoui"
            inputName="planShuukanKeikakuhyouDoui"
            defaultValue="計画書の内容を十分理解しましたので、同意いたします。"
          />
          <DouiranContents
            title="介護予防サービス・支援計画書"
            id="kaigoyobou-service"
            switchName="isPlanKaigoyobouShienkeikakuDoui"
            inputName="planKaigoyobouShienkeikakuDoui"
            defaultValue="計画書の内容を十分理解しましたので、同意いたします。"
          />
          <DouiranContents
            title="介護予防週間支援計画表"
            id="kaigoyobou-sienn"
            switchName="isPlanKaigoyobouShuukanKeikakuhyouDoui"
            inputName="planKaigoyobouShuukanKeikakuhyouDoui"
            defaultValue="計画書の内容を十分理解しましたので、同意いたします。"
          />
          <DouiranContents
            title="利用者基本情報"
            id="riyousha-jyouhou"
            switchName=""
            inputName="planRiyoushaKihonInfoDoui"
            textType="textarea"
            isDisplaySwitch={false}
            defaultValue="地域包括支援センターが行う事業の実施に当たり、利用者の状況を把握する必要があるときは、基本チェックリスト記入内容、要介護認定・要支援認定に係る調査内容、介護認定審査会による判定結果・意見、及び主治医意見書と同様に、利用者基本情報、アセスメントシートを、居宅介護支援事業者、居宅サービス事業者、総合事業におけるサービス事業等実施者、介護保健施設、主治医その他本事業の実施に必要な範囲で関係する者に提示することに同意します。"
          />
          <LayoutItem variant="1-item-full">
            <Box mt={4}>
              <Label id="rirekisakusei-label" width={200}>
                履歴作成時に支援経過のデータを作成する
              </Label>
            </Box>
            <LayoutItem variant="1-item-full">
              {/* <Label id="tantoshakaigi-label" width={100}>
    <SwitchButton id="checked-switch-button" name="checked-switch-button" size="medium" checked={check} onChange={handleChange} />
    担当者会議の要点、モニタリング、サービス評価表
  </Label> */}
              <DouiranItems id="tantoshakaigi" switchName="isShienkeikaDatasakusei" statement="担当者会議の要点、モニタリング、サービス評価表" width={300} />
            </LayoutItem>
          </LayoutItem>
        </FormContext>
      </DialogContent>
      <DialogActions>
        <GeneralIconButton icon="register" id="rireki-save-button" onClick={handleSubmitForm}>
          登録
        </GeneralIconButton>
      </DialogActions>
    </>
  );
};

export default OutputSettingDialogContents;
