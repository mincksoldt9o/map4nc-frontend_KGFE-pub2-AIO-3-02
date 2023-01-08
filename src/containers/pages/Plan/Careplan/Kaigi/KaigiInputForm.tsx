import React, { useEffect, useDebugValue } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Grid, Table, TableBody, TableContainer, TableRow } from '@material-ui/core';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import TextInput from '@my/components/atomic/TextInput';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import TextInputField from '@my/components/molecules/TextInputField';
import NumberInputField from '@my/components/molecules/NumberInputField';
import CustomCell from '@my/components/layouts/Table/CustomCell';
import Button from '@my/components/atomic/Button';
// import { changeAble } from '@my/containers/pages/Plan/Careplan/SingleCheckboxUtil';
import screenIDs from '@my/screenIDs';
import { RootState, useTypedSelector } from '@my/stores';
// import useDebouncedWatch from '@my/hooks/useDebouncedWatch';
import { careplanHeaderFormSchemaDef, CareplanHeaderFormType } from '@my/containers/pages/Common/CareplanHeader/CareplanHeaderInputForm';
import yup, { yupDate } from '@my/yup';
import { useClearApiMessage } from '@my/action-hooks';
// import { sakuseiKbnCheckboxes, saniteReasonTypeCheckboxes } from '../Datas';
// import Label from '@my/components/atomic/Label';
import ShussekishaInyou from './ShussekishaInyou';
import CustomGrid from '../CustomGrid';

// import CheckboxField from '@my/components/molecules/CheckboxField';
// import RadioButtonField from '@my/components/molecules/RadioButtonField';
// import FixedIntervalButton from '@my/components/atomic/FixedIntervalButton';
// import CalendarInput from '@my/components/molecules/CalendarInput';
// import ComboBox from '@my/components/atomic/ComboBox';

export type Props = {
  id: string;
  isReadonly: boolean;
  defaultValues?: KaigiInputFormType;
  onSubmit: (data: KaigiInputFormType) => Promise<void>;
};

export type KaigiInputFormType = {
  //kaisaiDate?: number | string;
  kaisaiDate?: Date;
  kaisaiBasho?: string;
  //kaisaiJikan?: Date | string;
  kaisaiJikan?: Date;
  kaisaiKaisuu?: number | string;
  // minaoshiAlert?: Date | string;
  // minaoshiAlert?: Date;
  // minaoshiDate: Date;
  //
  shozoku1?: string;
  name1?: string;
  shozoku2?: string;
  name2?: string;
  shozoku3?: string;
  name3?: string;
  shozoku4?: string;
  name4?: string;
  shozoku5?: string;
  name5?: string;
  shozoku6?: string;
  name6?: string;
  shozoku7?: string;
  name7?: string;
  shozoku8?: string;
  name8?: string;
  shozoku9?: string;
  name9?: string;
  //
  shussekiHonnin?: string;
  shussekiKazoku?: string;
  shussekiTsuzukigara?: string;
  shussekiBikou?: string;
  //
  kentouKoumoku?: string;
  kentouNaiyou?: string;
  ketsuron?: string;
  kadai?: string;
  updateAt?: number | string;
} & CareplanHeaderFormType;

// バリデーション
export const kaigiInputFormSchema = yup.object({
  // ケアプランヘッダのバリデーション↓↓↓↓↓
  ...careplanHeaderFormSchemaDef,
  kaisaiDate: yupDate().label('開催日'),
  kaisaiBasho: yup.string().label('開催場所'),
  kaisaiJikan: yupDate().label('開催時間'),
  kaisaiKaisuu: yup.string().label('開催回数'),
  minaoshiAlert: yupDate().label('見直しアラート'),
  shozoku1: yup.string(),
  name1: yup.string(),
  shozoku2: yup.string(),
  name2: yup.string(),
  shozoku3: yup.string(),
  name3: yup.string(),
  shozoku4: yup.string(),
  name4: yup.string(),
  shozoku5: yup.string(),
  name5: yup.string(),
  shozoku6: yup.string(),
  name6: yup.string(),
  shozoku7: yup.string(),
  name7: yup.string(),
  shozoku8: yup.string(),
  name8: yup.string(),
  shozoku9: yup.string(),
  name9: yup.string(),
  shussekiHonnin: yup.string(),
  shussekiKazoku: yup.string(),
  shussekiTsuzukigara: yup.string(),
  shussekiBikou: yup.string(),
  kentouKoumoku: yup.string(),
  kentouNaiyou: yup.string(),
  ketsuron: yup.string(),
  kadai: yup.string(),
  updateAt: yupDate(),
});

// // 算定理由チェックボックス その他
// const SANTEI_REASON_OTHER = '9';

// 認定区分リスト
// const ninteiKbnRadios = [
//   { id: 'certified', label: '認定済', value: '1' },
//   { id: 'applying', label: '申請中', value: '2' },
// ];

// start of ShussekisaTable aka attendees-citation Table
const shozokuNameColumns = [{ key: 'shozokuNameColumn1' }, { key: 'shozokuNameColumn2' }, { key: 'shozokuNameColumn3' }];
const shozokuNameRows = [{ key: 'shozokuNameRow1' }, { key: 'shozokuNameRow2' }, { key: 'shozokuNameRow3' }];
const ShussekishaTable: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClickShussekishaInyou = () => {
    setIsDialogOpen(true);
  };
  return (
    <>
      {isDialogOpen && <ShussekishaInyou setIsDialogOpen={setIsDialogOpen} />}
      <HeaderCell component="th" width="10%">
        会議出席者
        <br />
        <Button id="shussekisha-inyou-button" variant="outlined" onClick={handleClickShussekishaInyou}>
          出席者引用
        </Button>
      </HeaderCell>
      {/* タイトル行 */}
      <TableRow>
        {shozokuNameColumns.map(({ key }, i) => {
          return (
            <>
              <HeaderCell key={`${key}-shozoku`} id={`shozoku-title-${i}`} className={`shozokuTitle${i}`}>
                所属(職種)
              </HeaderCell>
              <HeaderCell key={`${key}-name`} id={`name-title-${i}`} className={`nameTitle${i}`}>
                氏名
              </HeaderCell>
            </>
          );
        })}
      </TableRow>
      {shozokuNameRows.map(({ key: rowKey }, row) => {
        return (
          <TableRow key={rowKey}>
            {shozokuNameColumns.map(({ key: columnKey }, column) => {
              return (
                <>
                  <BodyCell key={`${columnKey}-shozoku`} align="center" style={{ width: 2000 }}>
                    <TextInput
                      id={`shozoku${row * 3 + column + 1}`}
                      name={`shozoku${row * 3 + column + 1}`}
                      type="text"
                      imeMode="auto"
                      defaultValue={`shozoku${row * 3 + column + 1}`}
                      fullWidth
                      variant="grid"
                    />
                  </BodyCell>
                  <BodyCell key={`${columnKey}-name`} align="center" style={{ width: 2000 }} br>
                    <TextInput
                      id={`name${row * 3 + column + 1}`}
                      name={`name${row * 3 + column + 1}`}
                      type="text"
                      imeMode="auto"
                      defaultValue={`name${row * 3 + column + 1}`}
                      fullWidth
                      variant="grid"
                    />
                  </BodyCell>
                </>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
};

// end of ShussekisaTable aka attendees-citation Table

/**
 * L1240-01.居宅サービス計画書(1)
 */
const KaigiInputForm: React.FC<Props> = (props: Props) => {
  const { id, isReadonly, defaultValues, onSubmit } = props;

  const clearApiMessage = useClearApiMessage();

  //const youkaigodoList = useTypedSelector((state: RootState) => state.kaigi.youkaigodoList);

  const formMethods = useFormContext();
  const { handleSubmit, watch, control, setValue, getValues } = formMethods;

  // const { control, setValue, getValues, errors } = useForm<Plan2InputFormType>({
  //   mode: 'onChange',
  //   defaultValues,
  //   validationSchema: plan2InputFormSchema,
  // });

  // const formMethods = useFormContext();
  // const { handleSubmit } = formMethods;


  console.log('defaultValues = %o', defaultValues);
  useEffect(() => {
    setValue('kaisaiDate', defaultValues?.kaisaiDate);
    setValue('kaisaiBasho', defaultValues?.kaisaiBasho);
    setValue('kaisaiJikan', defaultValues?.kaisaiJikan);
    setValue('kaisaiKaisuu', defaultValues?.kaisaiKaisuu);
    // setValue('minaoshiAlert', defaultValues?.minaoshiAlert);
    setValue('shussekiHonnin', defaultValues?.shussekiHonnin);
    setValue('shussekiKazoku', defaultValues?.shussekiKazoku);
    setValue('shussekiTsuzukigara', defaultValues?.shussekiTsuzukigara);
    setValue('shussekiBikou', defaultValues?.shussekiBikou);
    setValue('kentouKoumoku', defaultValues?.kentouKoumoku);
    setValue('kentouNaiyou', defaultValues?.kentouNaiyou);
    setValue('ketsuron', defaultValues?.ketsuron);
    setValue('kadai', defaultValues?.kadai);
    setValue('updateAt', defaultValues?.updateAt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSubmitForm = handleSubmit(async (data) => {
    console.log('data form: ', data);
    clearApiMessage(screenIDs.L1240_01.id);
    //if (onSubmit){
      console.log('data form: ', data);
      await onSubmit(data);
    //};
  });

  

  // eslint-disable-next-line no-console
  console.log('KaigiInputForm render');
  console.log('control-object: ', control);
  useDebugValue(control);


  return (
    <LayoutForm id="kaigi-form" disableGridLayout>
      <Box m={1}>
        <LayoutItem variant="1-item-full">
          <CustomGrid direction="row" justify="space-between">
            <CustomGrid direction="row" justify="flex-start">
              <Box maxWidth={270} m={1}>
                <CalendarInputField control={control} id="kaisaiDate" name="kaisaiDate" label="開催日" required defaultValue={new Date()} labelWidth={80} variant="table" />
              </Box>
              <Box maxWidth={400} m={1}>
                <TextInputField control={control} id="kaisaiBasho" name="kaisaiBasho" type="text" label="開催場所" required labelWidth={90} variant="table" />
              </Box>
              <Box maxWidth={400} m={1}>
                <TextInputField control={control} id="kaisaiJikan" name="kaisaiJikan" type="text" label="開催時間" required labelWidth={90} variant="table" />
              </Box>
            </CustomGrid>
            <Grid item>
              <Grid container direction="row" justify="flex-start">
                <Grid item>
                  <Box maxWidth={140} m={1}>
                    <NumberInputField control={control} id="kaisaiKaisuu" name="kaisaiKaisuu" label="開催回数" required labelWidth={90} variant="table" />
                  </Box>
                </Grid>
                <Grid item>
                  <Box maxWidth={280} m={1}>
                    <CalendarInputField control={control} id="minaoshi-alert" name="minaoshiAlert" label="見直しアラート" labelWidth={120} variant="table" />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </CustomGrid>
        </LayoutItem>
        <TableContainer>
          <Table aria-label="kaigi-table">
            <TableBody>
              {/* １行目 */}
              <TableRow>
                <ShussekishaTable />
              </TableRow>
              {/* 2行目 */}
              <TableRow>
                <CustomCell title="利用者・家族の出席">
                  <CustomGrid direction="row" justify="flex-start">
                    <Box mt={0.5} ml={1}>
                      本人：【
                    </Box>
                    <Box maxWidth={20}>
                      <TextInput control={control} id="shussekiHonnin" name="shussekiHonnin" type="text" imeMode="auto" defaultValue={defaultValues?.shussekiHonnin} variant="grid" />
                    </Box>
                    <Box mt={0.5}>】</Box>
                    <Box mt={0.5} ml={1}>
                      家族：【
                    </Box>
                    <Box maxWidth={20}>
                      <TextInput control={control} id="shussekiKazoku" name="shussekiKazoku" type="text" imeMode="auto" defaultValue={defaultValues?.shussekiKazoku} variant="grid" />
                    </Box>
                    <Box mt={0.5}>】</Box>
                    <Box mt={0.5} ml={1}>
                      (続柄：
                    </Box>
                    <Box maxWidth={60}>
                      <TextInput
                        control={control}
                        id="shussekiTsuzukigara"
                        name="shussekiTsuzukigara"
                        type="text"
                        imeMode="auto"
                        defaultValue={defaultValues?.shussekiTsuzukigara}
                        variant="grid"
                        autoCompleteOptions={['夫', '妻', '長男', '長女']}
                      />
                    </Box>
                    <Box mt={0.5}>)</Box>
                    <Box mt={0.5} ml={1}>
                      ※備考：
                    </Box>
                    <Box maxWidth={200}>
                      <TextInput control={control} id="shussekiBikou" name="shussekiBikou" type="text" imeMode="auto" defaultValue={defaultValues?.shussekiBikou} variant="grid" />
                    </Box>
                  </CustomGrid>
                </CustomCell>
              </TableRow>
              {/* 3行目 */}
              <TableRow>
                <CustomCell title="検討した項目">
                  <TextInput
                    control={control}
                    id="kentouKoumoku"
                    name="kentouKoumoku"
                    type="textarea"
                    imeMode="auto"
                    defaultValue={defaultValues?.kentouKoumoku}
                    rowsMin={8}
                    fullWidth
                    variant="table"
                  />
                </CustomCell>
              </TableRow>
              {/* 4行目 */}
              <TableRow>
                <CustomCell title="検討内容">
                  <TextInput control={control} id="kentouNaiyou" name="kentouNaiyou" type="textarea" imeMode="auto" defaultValue={defaultValues?.kentouNaiyou} rowsMin={8} fullWidth variant="table" />
                </CustomCell>
              </TableRow>
              {/* 5行目 */}
              <TableRow>
                <CustomCell title="結論">
                  <TextInput control={control} id="ketsuron" name="ketsuron" type="textarea" imeMode="auto" defaultValue={defaultValues?.ketsuron} rowsMin={8} fullWidth variant="table" />
                </CustomCell>
              </TableRow>
              {/* 6行目 */}
              <TableRow>
                <CustomCell
                  title={
                    <>
                      残された課題
                      <br />
                      (次回の開催時期)
                    </>
                  }>
                  <TextInput control={control} id="kadai" name="kadai" type="textarea" imeMode="auto" defaultValue={defaultValues?.kadai} rowsMin={8} fullWidth variant="table" />
                </CustomCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <GeneralIconFloatingActionButton id="kaigi-form-submit-button" icon="register" onClick={handleSubmitForm}>
          登録
        </GeneralIconFloatingActionButton>
      </Box>
    </LayoutForm>
  );
};

export default KaigiInputForm;
