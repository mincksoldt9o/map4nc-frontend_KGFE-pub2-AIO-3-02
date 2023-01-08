import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Grid, Table, TableBody, TableContainer, TableRow } from '@material-ui/core';
import { LayoutForm } from '@my/components/layouts/Form';
import CheckboxField from '@my/components/molecules/CheckboxField';
import RadioButtonField from '@my/components/molecules/RadioButtonField';
import TextInput from '@my/components/atomic/TextInput';
import FixedIntervalButton from '@my/components/atomic/FixedIntervalButton';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import CalendarInput from '@my/components/molecules/CalendarInput';
import ComboBox from '@my/components/atomic/ComboBox';
import { changeAble } from '@my/containers/pages/Plan/Careplan/SingleCheckboxUtil';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import screenIDs from '@my/screenIDs';
import { RootState, useTypedSelector } from '@my/stores';
import useDebouncedWatch from '@my/hooks/useDebouncedWatch';
import { careplanHeaderFormSchemaDef, CareplanHeaderFormType } from '@my/containers/pages/Common/CareplanHeader/CareplanHeaderInputForm';
import yup, { yupDate } from '@my/yup';
import { useClearApiMessage } from '@my/action-hooks';
import { sakuseiKbnCheckboxes, saniteReasonTypeCheckboxes } from '../Datas';

export type Props = {
  id: string;
  isReadonly: boolean;
  defaultValues?: Plan1InputFormType;
  onSubmit: (data: Plan1InputFormType) => Promise<void>;
};

// フォームの型
export type Plan1InputFormType = {
  sakuseiKbn?: string[];
  ninteiKbn?: string;
  keikakuSakuseiDate?: Date;
  firstSakuseiDate?: Date;
  ninteiDate?: Date;
  ninteiStartDate?: Date | null;
  ninteiEndDate?: Date | null;
  youkaigoKbn?: string;
  seikatsuIkou?: string;
  ikenServiceKindShitei?: string;
  enjoHoushin?: string;
  saniteReasonType?: string[];
  saniteReasonSonota?: string;
} & CareplanHeaderFormType;

// バリデーション
export const plan1InputFormSchema = yup.object({
  // ケアプランヘッダのバリデーション↓↓↓↓↓
  ...careplanHeaderFormSchemaDef,
  // ケアプランヘッダのバリデーション↑↑↑↑↑
  sakuseiKbn: yup.string().label('作成区分'),
  ninteiKbn: yup.string().label('認定状態'),
  keikakuSakuseiDate: yupDate().label('計画作成日'),
  firstSakuseiDate: yupDate().label('初回作成日'),
  ninteiDate: yupDate().label('認定日'),
  ninteiStartDate: yupDate().label('認定有効期間開始日'),
  ninteiEndDate: yupDate().label('認定有効期間終了日'),
  youkaigoKbn: yup.string().label('要介護状態区分'),
  seikatsuIkou: yup.string().label('利用者及び家族の生活に対する意向'),
  ikenServiceKindShitei: yup.string().label('介護認定審査会の意見及びサービスの種類の指定'),
  enjoHoushin: yup.string().label('総合的な援助の方針'),
  saniteReasonType: yup.string().label('生活援助中心の算定理由'),
  saniteReasonSonota: yup.string().label('生活援助中心の算定理由その他'),
});

// 算定理由チェックボックス その他
const SANTEI_REASON_OTHER = '9';

// 認定区分リスト
const ninteiKbnRadios = [
  { id: 'certified', label: '認定済', value: '1' },
  { id: 'applying', label: '申請中', value: '2' },
];

/**
 * L1210-01.居宅サービス計画書(1)
 */
const Plan1InputForm: React.FC<Props> = (props: Props) => {
  const { id, isReadonly, defaultValues, onSubmit } = props;

  const clearApiMessage = useClearApiMessage();

  const youkaigodoList = useTypedSelector((state: RootState) => state.plan1.youkaigodoList);

  const formMethods = useFormContext();
  const { handleSubmit, watch, control, setValue, getValues } = formMethods;

  // console.log('defaultValues = %o', defaultValues);
  useEffect(() => {
    setValue('sakuseiKbn', defaultValues?.sakuseiKbn);
    setValue('ninteiKbn', defaultValues?.ninteiKbn);
    setValue('keikakuSakuseiDate', defaultValues?.keikakuSakuseiDate);
    setValue('firstSakuseiDate', defaultValues?.firstSakuseiDate);
    setValue('ninteiDate', defaultValues?.ninteiDate);
    setValue('ninteiStartDate', defaultValues?.ninteiStartDate);
    setValue('ninteiEndDate', defaultValues?.ninteiEndDate);
    setValue('youkaigoKbn', defaultValues?.youkaigoKbn);
    setValue('seikatsuIkou', defaultValues?.seikatsuIkou);
    setValue('ikenServiceKindShitei', defaultValues?.ikenServiceKindShitei);
    setValue('enjoHoushin', defaultValues?.enjoHoushin);
    setValue('saniteReasonType', defaultValues?.saniteReasonType);
    setValue('saniteReasonSonota', defaultValues?.saniteReasonSonota);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [disableOther, setDisableOther] = React.useState<boolean>(true);

  React.useEffect(() => {
    const santeiReasonCheckFields: string[] = watch('saniteReasonType');
    changeAble(santeiReasonCheckFields, setDisableOther, SANTEI_REASON_OTHER);
  }, [watch]);

  useDebouncedWatch<Date | null | undefined>(
    'ninteiStartDate',
    (selected?: Date | null | undefined) => {
      // eslint-disable-next-line no-console
      console.log(selected);
    },
    { watch }
  );

  // 登録ボタン押下時
  const handleSubmitForm = handleSubmit(async (data) => {
    clearApiMessage(screenIDs.L1210_01.id);
    console.log('onSubmit plan1 data: ', data);
    await onSubmit(data);
  });

  // 半年、1年、2年、3年、4年ボタンが押された時の処理
  const handleClickFixedIntervalButton = (calculatedDate: Date | null) => {
    setValue('ninteiEndDate', calculatedDate);
  };

  // eslint-disable-next-line no-console
  console.log('Plan1InputForm render');

  // eslint-disable-next-line no-console
  console.log("youkaigodoList: ", youkaigodoList);

  return (
    <LayoutForm disableGridLayout>
      {/* ボディー部 */}
      <Box mt={1} ml={1} mr={1}>
        <TableContainer>
          <Table aria-label="table1">
            <TableBody>
              <TableRow>
                <HeaderCell align="inherit" width={200}>
                  作成区分
                </HeaderCell>
                <BodyCell>
                  <CheckboxField
                    id={`${id}-careplan-plan1-sakusei-kbn`}
                    name="sakuseiKbn"
                    label=""
                    labelWidth={13}
                    checkboxes={sakuseiKbnCheckboxes}
                    orientation="horizontal"
                    size="small"
                    defaultValue={defaultValues?.sakuseiKbn}
                    singleCheck
                    control={control}
                  />
                </BodyCell>
                <HeaderCell align="inherit" width={180}>
                  認定区分
                </HeaderCell>
                <BodyCell>
                  <RadioButtonField
                    id={`${id}-careplan-plan1-nintei-kbn`}
                    name="ninteiKbn"
                    label=""
                    labelWidth={0}
                    radios={ninteiKbnRadios}
                    orientation="horizontal"
                    size="small"
                    defaultValue={defaultValues?.ninteiKbn}
                    control={control}
                  />
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">
                  居宅サービス
                  <br />
                  計画作成(変更)日
                </HeaderCell>
                <BodyCell>
                  <CalendarInput id={`${id}-careplan-plan1-keikaku-sakusei-date`} name="keikakuSakuseiDate" variant="table" control={control} />
                </BodyCell>
                <HeaderCell align="inherit">初回サービス計画作成日</HeaderCell>
                <BodyCell>
                  <CalendarInput id={`${id}-careplan-plan1-first-sakusei-date`} name="firstSakuseiDate" variant="table" control={control} />
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">認定日</HeaderCell>
                <BodyCell colSpan={3}>
                  <CalendarInput id={`${id}-careplan-plan1-nintei-date`} name="ninteiDate" variant="table" control={control} />
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">認定有効期間</HeaderCell>
                <BodyCell colSpan={3}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <Box width="170px">
                        <CalendarInput id={`${id}-careplan-plan1-nintei-start-date`} name="ninteiStartDate" variant="table" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box marginLeft="10px" width="200px">
                        <CalendarInput id={`${id}-careplan-plan1-nintei-end-date`} name="ninteiEndDate" variant="table" control={control} />
                      </Box>
                    </Grid>
                    <Grid item>
                      <FixedIntervalButton id="plan1" interval="half-year" referenceDate={getValues('ninteiStartDate')} handleClick={handleClickFixedIntervalButton} />
                    </Grid>
                    <Grid item>
                      <FixedIntervalButton id="plan1" interval="1year" referenceDate={getValues('ninteiStartDate')} handleClick={handleClickFixedIntervalButton} />
                    </Grid>
                    <Grid item>
                      <FixedIntervalButton id="plan1" interval="2years" referenceDate={getValues('ninteiStartDate')} handleClick={handleClickFixedIntervalButton} />
                    </Grid>
                    <Grid item>
                      <FixedIntervalButton id="plan1" interval="3years" referenceDate={getValues('ninteiStartDate')} handleClick={handleClickFixedIntervalButton} />
                    </Grid>
                    <Grid item>
                      <FixedIntervalButton id="plan1" interval="4years" referenceDate={getValues('ninteiStartDate')} handleClick={handleClickFixedIntervalButton} />
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">要介護度</HeaderCell>
                <BodyCell colSpan={3}>
                  <Box width="170px">
                    <ComboBox id={`${id}-careplan-plan1-youkaigodo-kbn`} name="youkaigoKbn" options={youkaigodoList || []} placeholder="" variant="table" control={control} />
                  </Box>
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">利用者及び家族の生活に対する意向を踏まえた課題分析の結果</HeaderCell>
                <BodyCell colSpan={3}>
                  <TextInput id={`${id}-careplan-plan1-seikatsu-ikou`} name="seikatsuIkou" type="textarea" rowsMin={7} rowsMax={7} variant="table" fullWidth control={control} />
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">介護認定審査会の意見及びサービスの種類の指定</HeaderCell>
                <BodyCell colSpan={3}>
                  <TextInput id={`${id}-careplan-plan1-iken-Service-kind-shitei`} name="ikenServiceKindShitei" type="textarea" rowsMin={6} rowsMax={6} variant="table" fullWidth control={control} />
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">総合的な援助の方針</HeaderCell>
                <BodyCell colSpan={3}>
                  <TextInput id={`${id}-careplan-plan1-enjo-houshin`} name="enjoHoushin" type="textarea" rowsMin={8} rowsMax={8} variant="table" fullWidth control={control} />
                </BodyCell>
              </TableRow>
              <TableRow>
                <HeaderCell align="inherit">生活援助中心型の算定理由</HeaderCell>
                <BodyCell colSpan={3}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <CheckboxField
                        id={`${id}-careplan-plan1-sanite-reason-type`}
                        name="saniteReasonType"
                        label=""
                        labelWidth={13}
                        checkboxes={saniteReasonTypeCheckboxes}
                        orientation="horizontal"
                        size="small"
                        singleCheck
                        defaultValue={defaultValues?.saniteReasonType}
                        control={control}
                      />
                    </Grid>
                    <Grid item>
                      (<TextInput id={`${id}-careplan-plan1-sanite-reason-sonota`} name="saniteReasonSonota" type="text" variant="table" disabled={disableOther} control={control} />)
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <GeneralIconFloatingActionButton id="kaigi-form-submit-button" icon="register" onClick={handleSubmitForm} disabled={isReadonly}>
          登録
        </GeneralIconFloatingActionButton>
      </Box>
    </LayoutForm>
  );
};

export default Plan1InputForm;
