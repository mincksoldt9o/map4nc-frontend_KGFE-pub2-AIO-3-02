import React from 'react';
import { Control, FieldValues, useForm } from 'react-hook-form';
import { Box, Grid, TableContainer, Table, TableBody, TableRow } from '@material-ui/core';
import { LayoutForm, LayoutItem } from '@my/components/layouts/Form';
import GeneralIconFloatingActionButton from '@my/components/molecules/GeneralIconFloatingActionButton';
import TextInput from '@my/components/atomic/TextInput';
import NumberInputField from '@my/components/molecules/NumberInputField';
import Label from '@my/components/atomic/Label';
import CheckboxField from '@my/components/molecules/CheckboxField';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';

import { SingleCheckboxLabelAndValue } from '@my/hooks/useSingleCheckbox';
import { checklist1Checkboxes, checklist2Checkboxes } from '../Datas';

export type ChecklistInputFormType = {
  checklist1: string[];
  checklist2: string[];
  checklist3: string[];
  checklist4: string[];
  checklist5: string[];
  checklist6: string[];
  checklist7: string[];
  checklist8: string[];
  checklist9: string[];
  checklist10: string[];
  checklist11: string[];
  checklist12: string[];
  checklist13: string[];
  checklist14: string[];
  checklist15: string[];
  checklist16: string[];
  checklist17: string[];
  checklist18: string[];
  checklist19: string[];
  checklist20: string[];
  checklist21: string[];
  checklist22: string[];
  checklist23: string[];
  checklist24: string[];
  checklist25: string[];
};

// *************************************************************************************
// ********** データ
// 定数

// 単一チェックボックスに指定する名前
// チェックリスト1
const checklist1Name = 'checklist1';
const checklist2Name = 'checklist2';
const checklist3Name = 'checklist3';
const checklist4Name = 'checklist4';
const checklist5Name = 'checklist5';
const checklist6Name = 'checklist6';
const checklist7Name = 'checklist7';
const checklist8Name = 'checklist8';
const checklist9Name = 'checklist9';
const checklist10Name = 'checklist10';
const checklist11Name = 'checklist11';
// const checklist12Name = 'checklist12';
const checklist13Name = 'checklist13';
const checklist14Name = 'checklist14';
const checklist15Name = 'checklist15';
const checklist16Name = 'checklist16';
const checklist17Name = 'checklist17';
const checklist18Name = 'checklist18';
const checklist19Name = 'checklist19';
const checklist20Name = 'checklist20';
const checklist21Name = 'checklist21';
const checklist22Name = 'checklist22';
const checklist23Name = 'checklist23';
const checklist24Name = 'checklist24';
const checklist25Name = 'checklist25';

type CheckBoxTableRowProps = {
  title: string;
  id: string;
  name: string;
  checkboxes: SingleCheckboxLabelAndValue[];
  control: Control<FieldValues>;
};

const CheckBoxTableRow = (props: CheckBoxTableRowProps) => {
  const { title, id, name, checkboxes, control } = props;
  return (
    <TableRow>
      <HeaderCell id={`${id}-title`} align="left" style={{ width: '480px' }} colSpan={9}>
        {title}
      </HeaderCell>
      <BodyCell align="center" style={{ textAlign: 'right' }} br bt>
        <CheckboxField id={id} name={name} labelWidth={15} checkboxes={checkboxes} size="small" singleCheck control={control} />
      </BodyCell>
    </TableRow>
  );
};

type Props = {
  id: string;
  defaultValues?: ChecklistInputFormType;
};
const ChecklistInputForm: React.FC<Props> = (props: Props) => {
  const { id, defaultValues } = props;

  const formMethods = useForm<ChecklistInputFormType>({
    mode: 'onChange',
    defaultValues,
  });

  const { handleSubmit, control } = formMethods;
  // // CheckboxField コンポーネントが control 配下の場合 onChange が効かないため watch で変更を検知する
  // React.useEffect(() => {
  // }, [watch]);

  // 登録ボタン押下時
  const handleSubmitForm = handleSubmit((data) => {
    console.log('***** data -> ', data);
  });

  return (
    <LayoutForm id="basic-checklist-form" disableGridLayout>
      <Box m={1}>
        <TableContainer>
          <Table aria-label={`${id}-table`} style={{ width: '1120px' }}>
            <TableBody>
              <TableRow>
                <HeaderCell id="title1" className="title1" style={{ width: '160px' }}>
                  生活機能評価
                </HeaderCell>
                <HeaderCell id="title2" className="title2" style={{ width: '160px' }}>
                  運動器の機能向上
                </HeaderCell>
                <HeaderCell id="title3" className="title3" style={{ width: '160px' }}>
                  栄養改善
                </HeaderCell>
                <HeaderCell id="title4" className="title4" style={{ width: '160px' }}>
                  口腔機能の向上
                </HeaderCell>
                <HeaderCell id="title5" className="title5" style={{ width: '160px' }}>
                  閉じこもり予防・支援
                </HeaderCell>
                <HeaderCell id="title6" className="title6" style={{ width: '160px' }}>
                  認知症予防・支援
                </HeaderCell>
                <HeaderCell id="title7" className="title7" style={{ width: '160px' }}>
                  うつ予防・支援
                </HeaderCell>
              </TableRow>
              <TableRow>
                <BodyCell id="title1" className="title1" align="center" style={{ textAlign: 'right' }} bl br>
                  0/20
                </BodyCell>
                <BodyCell id="title2" className="title2" align="center" style={{ textAlign: 'right' }} br>
                  0/5
                </BodyCell>
                <BodyCell id="title3" className="title3" align="center" style={{ textAlign: 'right' }} br>
                  0/2
                </BodyCell>
                <BodyCell id="title4" className="title4" align="center" style={{ textAlign: 'right' }} br>
                  0/3
                </BodyCell>
                <BodyCell id="title5" className="title5" align="center" style={{ textAlign: 'right' }} br>
                  0/1
                </BodyCell>
                <BodyCell id="title6" className="title6" align="center" style={{ textAlign: 'right' }} br>
                  0/3
                </BodyCell>
                <BodyCell id="title7" className="title7" align="center" style={{ textAlign: 'right' }} br>
                  0/5
                </BodyCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box m={1}>
        <TableContainer>
          <Table aria-label={`${id}-table`} style={{ width: '680px' }}>
            <TableBody>
              <CheckBoxTableRow title="1.バスや電車で１人で外出していますか" id={`${id}-checklist1`} name={checklist1Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="2.日用品の買物をしていますか" id={`${id}-checklist2`} name={checklist2Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="3.預貯金の出し入れをしていますか" id={`${id}-checklist3`} name={checklist3Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="4.友人の家を訪ねていますか" id={`${id}-checklist4`} name={checklist4Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="5.家族や友人の相談にのっていますか" id={`${id}-checklist5`} name={checklist5Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="6.階段を手すりや壁をつたわらずに昇っていますか" id={`${id}-checklist6`} name={checklist6Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="7.椅子に座った状態から何もつかまらずに立ち上がっていますか" id={`${id}-checklist7`} name={checklist7Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="8.１５分位続けて歩いていますか" id={`${id}-checklist8`} name={checklist8Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="9.この１年間に転んだことがありますか" id={`${id}-checklist9`} name={checklist9Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow title="10.転倒に対する不安は大きいですか" id={`${id}-checklist10`} name={checklist10Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow title="11.６ヵ月間で２～３kg以上の体重減少がありましたか" id={`${id}-checklist11`} name={checklist11Name} checkboxes={checklist2Checkboxes} control={control} />
              <TableRow>
                <HeaderCell id="memo1-title" align="left" style={{ width: '20px' }}>
                  12.
                </HeaderCell>
                <BodyCell align="center" style={{ textAlign: 'left' }} bl br colSpan={9}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <Box width={180}>
                        <NumberInputField id="memo1" name="memo1" label="身長" labelWidth={50} variant="table" suffix="cm" />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box marginLeft={4} width={160}>
                        <NumberInputField id="memo1" name="memo1" label="体重" labelWidth={50} variant="table" suffix="kg" />
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box marginLeft={4} width={180}>
                        <Grid container direction="row" justify="flex-start" alignItems="center">
                          <Grid item>
                            <Label id="label1">（BMI＝</Label>
                          </Grid>
                          <Grid item>
                            <Box width={60}>
                              <TextInput id="memo1" name="memo1" type="text" variant="table" disabled />
                            </Box>
                          </Grid>
                          <Grid item>
                            <Label id="label2">）（注）</Label>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                </BodyCell>
              </TableRow>
              <CheckBoxTableRow title="13.半年前に比べて固いものが食べにくくなりましたか" id={`${id}-checklist13`} name={checklist13Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow title="14.お茶や汁物等でむせることがありますか" id={`${id}-checklist14`} name={checklist14Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow title="15.口の渇きが気になりますか" id={`${id}-checklist15`} name={checklist15Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow title="16.週に１回以上は外出していますか" id={`${id}-checklist16`} name={checklist16Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="17.昨年と比べて外出の回数が減っていますか" id={`${id}-checklist17`} name={checklist17Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow
                title="18.周りの人から｢いつも同じ事を聞く｣などの物忘れがあると言われますか"
                id={`${id}-checklist18`}
                name={checklist18Name}
                checkboxes={checklist2Checkboxes}
                control={control}
              />
              <CheckBoxTableRow title="19.自分で電話番号を調べて、電話をかけることをしていますか" id={`${id}-checklist19`} name={checklist19Name} checkboxes={checklist1Checkboxes} control={control} />
              <CheckBoxTableRow title="20.今日が何月何日かわからない時がありますか" id={`${id}-checklist20`} name={checklist20Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow title="21.(ここ２週間)毎日の生活に充実感がない" id={`${id}-checklist21`} name={checklist21Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow
                title="22.(ここ２週間)これまで楽しんでやれていたことが楽しめなくなった"
                id={`${id}-checklist22`}
                name={checklist22Name}
                checkboxes={checklist2Checkboxes}
                control={control}
              />
              <CheckBoxTableRow
                title="23.(ここ２週間)以前は楽にできていたことが今ではおっくうに感じられる"
                id={`${id}-checklist23`}
                name={checklist23Name}
                checkboxes={checklist2Checkboxes}
                control={control}
              />
              <CheckBoxTableRow title="24.(ここ２週間)自分が役に立つ人間だと思えない" id={`${id}-checklist24`} name={checklist24Name} checkboxes={checklist2Checkboxes} control={control} />
              <CheckBoxTableRow title="25.(ここ２週間)わけもなく疲れたような感じがする" id={`${id}-checklist25`} name={checklist25Name} checkboxes={checklist2Checkboxes} control={control} />
            </TableBody>
          </Table>
        </TableContainer>
        <LayoutItem variant="1-item-full">
          <Label id="label2">(注) BMI＝体重(kg) ÷身長(m) ÷身長(m) が18.5未満の場合に該当とする。</Label>
        </LayoutItem>
      </Box>
      <GeneralIconFloatingActionButton id="form-submit-button" icon="register" onClick={handleSubmitForm}>
        登録
      </GeneralIconFloatingActionButton>
    </LayoutForm>
  );
};

export default ChecklistInputForm;
