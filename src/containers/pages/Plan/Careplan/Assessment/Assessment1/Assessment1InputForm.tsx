import React from 'react';
import { useFormContext } from 'react-hook-form';
import { RootState, useTypedSelector } from '@my/stores';
import { Box, Grid, TableContainer, Table, TableBody, TableRow } from '@material-ui/core';
import { LayoutItem } from '@my/components/layouts/Form';
import TextInputField from '@my/components/molecules/TextInputField';
import CalendarInputField from '@my/components/molecules/CalendarInputField';
import CalendarInput from '@my/components/molecules/CalendarInput';
import TextInput from '@my/components/atomic/TextInput';
import DataDisplay from '@my/components/atomic/DataDisplay';
import AddressFieldSet from '@my/components/organisms/AddressFieldSet';
import CheckboxField from '@my/components/molecules/CheckboxField';
import NumberInputField from '@my/components/molecules/NumberInputField';
import OptionButton from '@my/components/atomic/OptionButton';
import AssessmentPageTitleArea from '@my/containers/pages/Plan/Careplan/Assessment/Common/AssessmentPageTitleArea';
import { changeAble, changeDisable, SingleCheckbox } from '@my/containers/pages/Plan/Careplan/SingleCheckboxUtil';
import {
  sexOptions,
  umuCheckboxes,
  sameHonninOptions,
  uketsukeCheckboxes,
  kaigoRiyoushaFutanWariaiCheckboxes,
  koukiKoureishaIryouHokenCheckboxes,
  kougakuKaigoServicehiGaitouCheckboxes,
  youkaigoNinteiNaiyouCheckboxes,
  shougaiKoureishaCheckboxes,
  ninchishouCheckboxes,
  youkaigoNinteiCheckboxes,
} from '@my/containers/pages/Plan/Careplan/Datas';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';

const tableBorderStyle = '1px solid rgba(224, 224, 224, 1)';

type Props = {
  id: string;
  tabName: string;
};

// *************************************************************************************
// ********** データ
// 定数
// 受付区分チェックボックス その他
const UKETSUKE_OTHER = '9';
// 本人に同じチェックボックスON
const SAME_HONNIN = '1';
// 有無チェックボックス 有
const UMU_ARI = 'ari';

// 単一チェックボックスに指定する名前
// 受付区分
const uketsukeCheckName = 'uketsukeCheck';
// (緊急連絡先) 本人に同じ
const kinkyuuSameHonninCheckName = 'kinkyuuSameHonninCheck';
// (相談者) 本人に同じ
const soudanSameHonninCheckName = 'soudanSameHonninCheck';
// 身障手帳
const shinshouTechouCheckName = 'shinshouTechouCheck';
// 療育手帳
const ryouikuTechouCheckName = 'ryouikuTechouCheck';
// 精神障害者 保健福祉手帳
const seishinShougaishaHokenFukushiTechouCheckName = 'seishinShougaishaHokenFukushiTechouCheck';
// 自立支援医療 受給者証の有無
const jiritsushienIryouJukyuushaUmuCheckName = 'jiritsushienIryouJukyuushaUmuCheck';
// 要介護認定
const youkaigoNinteiCheckName = 'youkaigoNinteiCheck';

const Assessment1InputForm: React.FC<Props> = (props: Props) => {
  const { id, tabName } = props;

  const prefectureList = useTypedSelector((state: RootState) => state.common.prefectureList);

  const { control, watch, setValue } = useFormContext();

  // CheckboxField コンポーネントが control 配下の場合 onChange が効かないため watch で変更を検知する
  const [disableUketsukeOther, setDisableUketsukeOther] = React.useState<boolean>(true);
  const [disableKinkyuuAddressArea, setDisableKinkyuuAddressArea] = React.useState<boolean>(false);
  const [disableSoudanAddressArea, setDisableSoudanAddressArea] = React.useState<boolean>(false);
  const [disableYoukaigoNinteiSumiDay, setDisableYoukaigoNinteiSumiDay] = React.useState<boolean>(true);
  const [disableShinshouTechou, setDisableShinshouTechou] = React.useState<boolean>(true);
  const [disableRyouikuTechou, setDisableRyouikuTechou] = React.useState<boolean>(true);
  const [disableSeishinShougaishaHokenFukushiTechou, setDisableSeishinShougaishaHokenFukushiTechou] = React.useState<boolean>(true);
  const [disableJiritsushienIryouJukyuushaUmuText, setDisableJiritsushienIryouJukyuushaUmuText] = React.useState<boolean>(true);
  React.useEffect(() => {
    // 受付区分チェックボックス変更時 その他テキストボックス活性非活性制御 (チェックONで活性)
    const uketsukeCheckFields = watch(uketsukeCheckName);
    changeAble(uketsukeCheckFields, setDisableUketsukeOther, UKETSUKE_OTHER);

    // (緊急連絡先) 本人に同じチェックボックス変更時 住所、電話、携帯テキストボックス活性非活性制御 (チェックONで非活性)
    const kinkyuuSameHonninCheckFields = watch(kinkyuuSameHonninCheckName);
    changeDisable(kinkyuuSameHonninCheckFields, setDisableKinkyuuAddressArea, SAME_HONNIN);

    // (相談者) 本人に同じチェックボックス変更時 住所、電話、携帯テキストボックス活性非活性制御 (チェックONで非活性)
    const soudanSameHonninCheckFields = watch(soudanSameHonninCheckName);
    changeDisable(soudanSameHonninCheckFields, setDisableSoudanAddressArea, SAME_HONNIN);

    // 要介護認定チェックボックス 認定日カレンダー活性非活性制御
    const youkaigoNinteiCheckFields = watch(youkaigoNinteiCheckName);
    setDisableYoukaigoNinteiSumiDay(!youkaigoNinteiCheckFields?.sumi);

    // 身障手帳チェックボックス変更時 以外の入力エリアの活性非活性制御 (チェックONで活性)
    const shinshouTechouCheckFields = watch(shinshouTechouCheckName);
    changeAble(shinshouTechouCheckFields, setDisableShinshouTechou, UMU_ARI);

    // 療育手帳チェックボックス変更時 以外の入力エリアの活性非活性制御 (チェックONで活性)
    const ryouikuTechouCheckFields = watch(ryouikuTechouCheckName);
    changeAble(ryouikuTechouCheckFields, setDisableRyouikuTechou, UMU_ARI);

    // 精神障害者 保健福祉手帳チェックボックス変更時 以外の入力エリアの活性非活性制御 (チェックONで活性)
    const seishinShougaishaHokenFukushiTechouCheckFields = watch(seishinShougaishaHokenFukushiTechouCheckName);
    changeAble(seishinShougaishaHokenFukushiTechouCheckFields, setDisableSeishinShougaishaHokenFukushiTechou, UMU_ARI);

    // 自立支援医療 受給者証の有無チェックボックス変更時 以外の入力エリアの活性非活性制御 (チェックONで活性)
    const jiritsushienIryouJukyuushaUmuCheckFields = watch(jiritsushienIryouJukyuushaUmuCheckName);
    changeAble(jiritsushienIryouJukyuushaUmuCheckFields, setDisableJiritsushienIryouJukyuushaUmuText, UMU_ARI);
  }, [watch]);

  return (
    <>
      {/* アセスメント内のメニュータブ直下 */}
      <AssessmentPageTitleArea title="フェースシート" selectedTab="ASSESSMENT1" />
      {/* 受付日 受付区分 相談受付者 エリア */}
      <LayoutItem variant="1-item-full">
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item>
                <Box maxWidth={290}>
                  <CalendarInputField id={`${id}-uketsuke-date`} name={`${tabName}.uketsukeDate`} label="受付日" required variant="table" labelWidth={130} control={control} />
                </Box>
              </Grid>
              <Grid item>
                <Box ml={3} minWidth={350}>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item>
                      <CheckboxField id={`${id}-uketsuke-check`} name={`${tabName}.${uketsukeCheckName}`} labelWidth={0} checkboxes={uketsukeCheckboxes} size="small" singleCheck control={control} />
                    </Grid>
                    <Grid item>
                      (<TextInput id={`${id}-uketsuke-other`} name={`${tabName}.uketsukeOther`} type="text" disabled={disableUketsukeOther} variant="table" control={control} />)
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item>
                <TextInputField id={`${id}-uketsuke-name`} name={`${tabName}.uketsukeName`} type="text" label="初回相談受付者" variant="table" labelWidth={130} control={control} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </LayoutItem>

      {/* ***** 本人情報 エリア から 居宅サービス計画 作成依頼の届出 エリア までのテーブル col = 4 */}
      {/* 本人情報 エリア */}
      <TableContainer style={{ marginBottom: 5, marginTop: 5 }}>
        {/* テーブル内の列幅を均等にするため table-layout: fixed を指定する */}
        <Table aria-label="kaigi-table" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ minWidth: 130, width: 130 }} />
            <col />
            <col style={{ minWidth: 130, width: 130 }} />
            <col />
          </colgroup>
          <TableBody>
            {/* 本人氏名 */}
            <TableRow>
              <HeaderCell component="th">本人氏名</HeaderCell>
              <BodyCell bt>
                <Grid container direction="row" justify="space-between">
                  <Grid item>
                    <DataDisplay id={`${id}-riyousha-name`} value="ＳＲＡ 一郎" />
                  </Grid>
                  <Grid item>
                    <DataDisplay id={`${id}-sex`} value="男" />
                  </Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th">年齢</HeaderCell>
              <BodyCell bt br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <DataDisplay type="date" id={`${id}-birthday`} value={325954800000} />
                  </Grid>
                  <Grid item>生れ</Grid>
                  <Grid item>
                    <Box ml={2}>
                      <Grid container direction="row" justify="flex-start">
                        <Grid item>(</Grid>
                        <Grid item>
                          <DataDisplay type="age" id={`${id}-age`} value={325954800000} />
                        </Grid>
                        <Grid item>歳)</Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 本人 */}
            <TableRow>
              <HeaderCell component="th">住所</HeaderCell>
              <BodyCell colSpan={3} br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <Box maxWidth={800} mr={1}>
                      <AddressFieldSet
                        id={`${id}-address`}
                        zipName={`${tabName}.zipCode`}
                        stateName={`${tabName}.pref`}
                        address1Name={`${tabName}.address1`}
                        address2Name={`${tabName}.address2`}
                        prefecturesDataList={prefectureList}
                        zipLabel="住所"
                        labelWidth={50}
                        variant="table"
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={200}>
                      <TextInputField id={`${id}-tel1`} name={`${tabName}.tel1`} type="tel" label="電話" imeMode="disabled" variant="table" labelWidth={50} control={control} />
                      <TextInputField id={`${id}-tel2`} name={`${tabName}.tel2`} type="tel" label="携帯" imeMode="disabled" variant="table" labelWidth={50} control={control} />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 緊急連絡先 エリア */}
            <TableRow>
              <HeaderCell component="th" rowSpan={3}>
                緊急連絡先
              </HeaderCell>
              <BodyCell colSpan={3} br>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Box mr={1}>
                      <TextInputField id={`${id}-kinkyuu-riyousha-name`} name={`${tabName}.kinkyuuRiyoushaName`} type="text" label="氏名" labelWidth={50} variant="table" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box minWidth={100} mr={1}>
                      <OptionButton id={`${id}-kinkyuu-sex`} name={`${tabName}.kinkyuuSexKbn`} options={sexOptions} size="small" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={120} mr={1}>
                      <NumberInputField id={`${id}-kinkyuu-age`} name={`${tabName}.kinkyuuAge`} label="年齢" labelWidth={50} variant="table" suffix="歳" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={170}>
                      <TextInputField id={`${id}-kinkyuu-zokugara`} name={`${tabName}.kinkyuuZokugara`} type="text" label="本人との続柄" variant="table" labelWidth={110} control={control} />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            <TableRow>
              <BodyCell colSpan={3} style={{ borderBottom: 'none' }} br>
                <Box pl={1}>
                  <CheckboxField
                    id={`${id}-kinkyuu-same-honnin-check`}
                    name={`${tabName}.${kinkyuuSameHonninCheckName}`}
                    checkboxes={sameHonninOptions}
                    control={control}
                    labelWidth={50}
                    size="small"
                  />
                </Box>
              </BodyCell>
            </TableRow>
            <TableRow>
              <BodyCell colSpan={3} br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <Box maxWidth={800} mr={1}>
                      <AddressFieldSet
                        id={`${id}-kinkyuu-address`}
                        zipName={`${tabName}.kinkyuuZipCode`}
                        stateName={`${tabName}.kinkyuuPref`}
                        address1Name={`${tabName}.kinkyuuAddress1`}
                        address2Name={`${tabName}.kinkyuuAddress2`}
                        prefecturesDataList={prefectureList}
                        zipLabel="住所"
                        disabled={disableKinkyuuAddressArea}
                        labelWidth={50}
                        variant="table"
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={200}>
                      <TextInputField
                        id={`${id}-kinkyuu-tel1`}
                        name={`${tabName}.kinkyuuTel1`}
                        type="tel"
                        label="電話"
                        imeMode="disabled"
                        disabled={disableKinkyuuAddressArea}
                        variant="table"
                        labelWidth={50}
                        control={control}
                      />
                      <TextInputField
                        id={`${id}-kinkyuu-tel2`}
                        name={`${tabName}.kinkyuuTel2`}
                        type="tel"
                        label="携帯"
                        imeMode="disabled"
                        disabled={disableKinkyuuAddressArea}
                        variant="table"
                        labelWidth={50}
                        control={control}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 相談者 エリア */}
            <TableRow>
              <HeaderCell component="th" rowSpan={3}>
                相談者
              </HeaderCell>
              <BodyCell colSpan={3} br>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Box mr={1}>
                      <TextInputField id={`${id}-soudan-riyousha-name`} name={`${tabName}.soudanRiyoushaName`} type="text" label="氏名" labelWidth={50} variant="table" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box minWidth={100} mr={1}>
                      <OptionButton id={`${id}-soudan-sex`} name={`${tabName}.soudanSexKbn`} options={sexOptions} size="small" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={120} mr={1}>
                      <NumberInputField id={`${id}-soudan-age`} name={`${tabName}.soudanAge`} label="年齢" labelWidth={50} variant="table" suffix="歳" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={170}>
                      <TextInputField id={`${id}-soudan-zokugara`} name={`${tabName}.soudanZokugara`} type="text" label="本人との続柄" variant="table" labelWidth={110} control={control} />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            <TableRow>
              <BodyCell colSpan={3} style={{ borderBottom: 'none' }} br>
                <Box pl={1}>
                  <CheckboxField id={`${id}-soudan-same-honnin-check`} name={`${tabName}.${soudanSameHonninCheckName}`} checkboxes={sameHonninOptions} control={control} labelWidth={50} size="small" />
                </Box>
              </BodyCell>
            </TableRow>
            <TableRow>
              <BodyCell colSpan={3} br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <Box maxWidth={800} mr={1}>
                      <AddressFieldSet
                        id={`${id}-soudan-address`}
                        zipName={`${tabName}.soudanZipCode`}
                        stateName={`${tabName}.soudanPref`}
                        address1Name={`${tabName}.soudanAddress1`}
                        address2Name={`${tabName}.soudanAddress2`}
                        prefecturesDataList={prefectureList}
                        zipLabel="住所"
                        disabled={disableSoudanAddressArea}
                        labelWidth={50}
                        variant="table"
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={200}>
                      <TextInputField
                        id={`${id}-soudan-tel1`}
                        name={`${tabName}.soudanTel1`}
                        type="tel"
                        label="電話"
                        imeMode="disabled"
                        disabled={disableSoudanAddressArea}
                        variant="table"
                        labelWidth={50}
                        control={control}
                      />
                      <TextInputField
                        id={`${id}-soudan-tel2`}
                        name={`${tabName}.soudanTel2`}
                        type="tel"
                        label="携帯"
                        imeMode="disabled"
                        disabled={disableSoudanAddressArea}
                        variant="table"
                        labelWidth={50}
                        control={control}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 相談経路 (紹介者) エリア */}
            <TableRow>
              <HeaderCell component="th">
                <>
                  相談経路
                  <br />
                  (紹介者)
                </>
              </HeaderCell>
              <BodyCell colSpan={3} br>
                <Box maxWidth={800}>
                  <TextInput id={`${id}-soudan-keiro`} name={`${tabName}.soudanKeiro`} type="text" fullWidth variant="table" control={control} />
                </Box>
              </BodyCell>
            </TableRow>
            {/* 居宅サービス計画 作成依頼の届出 エリア */}
            <TableRow>
              <HeaderCell component="th">
                <>
                  居宅サービス計画
                  <br />
                  作成依頼の届出
                </>
              </HeaderCell>
              <BodyCell colSpan={3} br>
                <Grid container direction="row" justify="flex-start">
                  <Box maxWidth={250}>
                    <CalendarInputField id={`${id}-sakusei-irai-todokede-date`} name={`${tabName}.sakuseiIraiTodokedeDate`} label="届出年月日" labelWidth={80} variant="table" control={control} />
                  </Box>
                </Grid>
              </BodyCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 相談内容 */}
      <LayoutItem variant="1-item-full">
        <Grid container direction="row" justify="flex-start">
          <DataDisplay id={`${id}-soudan-naiyou-title`} value="■ 相談内容（主訴/本人・家族の希望・困っていることや不安、思い）" />
        </Grid>
        <Grid container direction="row" justify="flex-start">
          <DataDisplay id={`${id}-soudan-naiyou-honnin-title`} value="（本人）" />
        </Grid>
        <Grid container direction="row" justify="flex-start">
          <TextInput id={`${id}-soudan-naiyou-honnin`} name={`${tabName}.soudanNaiyouHonnin`} type="textarea" rowsMin={4} maxLength={500} fullWidth control={control} />
        </Grid>
        <Grid container direction="row" justify="flex-start">
          <DataDisplay id={`${id}-soudan-naiyou-other-title`} value="（介護者・家族）" />
        </Grid>
        <Grid container direction="row" justify="flex-start">
          <TextInput id={`${id}-soudan-naiyou-other`} name={`${tabName}.soudanNaiyouOther`} type="textarea" rowsMin={4} maxLength={500} fullWidth control={control} />
        </Grid>
      </LayoutItem>
      {/* これまでの生活の経過 */}
      <LayoutItem variant="1-item-full">
        <Grid container direction="row" justify="flex-start">
          <DataDisplay id={`${id}-seikatsu-keika-title`} value="■ これまでの生活の経過（主な生活史）" />
        </Grid>
        <Grid container direction="row" justify="flex-start">
          <TextInput id={`${id}-seikatsu-keika`} name={`${tabName}.seikatsuKeika`} type="textarea" rowsMin={4} maxLength={500} fullWidth control={control} />
        </Grid>
      </LayoutItem>

      {/* ***** 介護保険 エリア から 障害福祉サービス 受給者証の有無 エリア までのテーブル col = 9 */}
      <TableContainer style={{ marginBottom: 5, marginTop: 5 }}>
        <Table aria-label="kaigi-table">
          <colgroup>
            {/* 1 : header 項目なので幅固定のため width px 指定 */}
            <col style={{ minWidth: 130, width: 130 }} />
            {/* 2 */}
            <col style={{ minWidth: 50 }} />
            {/* 3 : header 項目なので幅固定のため width px 指定 */}
            <col style={{ minWidth: 50, width: 50 }} />
            {/* 4 */}
            <col style={{ minWidth: 140, width: 140 }} />
            {/* 5 */}
            <col style={{ minWidth: 50 }} />
            {/* 6 : header 項目なので幅固定のため width px 指定 */}
            <col style={{ minWidth: 130, width: 130 }} />
            {/* 7 */}
            <col style={{ minWidth: 80 }} />
            {/* 8 */}
            <col style={{ minWidth: 60 }} />
            {/* 9 */}
            <col style={{ minWidth: 160 }} />
          </colgroup>
          <TableBody>
            {/* 介護保険 */}
            <TableRow>
              <HeaderCell component="th">介護保険</HeaderCell>
              <BodyCell colSpan={4} bt>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <CheckboxField
                      id={`${id}-kaigo-riyousha-futan-wariai-check`}
                      name={`${tabName}.kaigoRiyoushaFutanWariaiCheck`}
                      checkboxes={kaigoRiyoushaFutanWariaiCheckboxes}
                      label="利用者負担割合"
                      size="small"
                      labelWidth={115}
                      singleCheck
                      control={control}
                    />
                  </Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th">
                <>
                  後期高齢者医療
                  <br />
                  保険(75歳以上)
                </>
              </HeaderCell>
              <BodyCell colSpan={3} bt br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <CheckboxField
                      id={`${id}-kouki-koureisha-iryou-hoken-check`}
                      name={`${tabName}.koukiKoureishaIryouHokenCheck`}
                      checkboxes={koukiKoureishaIryouHokenCheckboxes}
                      label="一部負担金"
                      size="small"
                      labelWidth={90}
                      singleCheck
                      control={control}
                    />
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 高額介護 サービス費該当 */}
            <TableRow>
              <HeaderCell component="th">
                <>
                  高額介護
                  <br />
                  サービス費該当
                </>
              </HeaderCell>
              <BodyCell colSpan={8} br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <CheckboxField
                      id={`${id}-kougaku-kaigo-servicehi-gaitou-check`}
                      name={`${tabName}.kougakuKaigoServicehiGaitouCheck`}
                      checkboxes={kougakuKaigoServicehiGaitouCheckboxes}
                      label="利用者負担"
                      size="small"
                      labelWidth={90}
                      singleCheck
                      control={control}
                    />
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 要介護認定 */}
            <TableRow>
              <HeaderCell component="th" rowSpan={2}>
                要介護認定
              </HeaderCell>
              <BodyCell colSpan={6}>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <TableContainer>
                      <Table aria-label="kaigi-table">
                        <colgroup>
                          {/* 未(見込み) ← 半角カッコ分を1pxで調整しているので 111px になっています */}
                          <col style={{ width: 111 }} />
                          <col />
                          <col />
                        </colgroup>
                        <TableBody>
                          <TableRow>
                            <BodyCell style={{ paddingLeft: 0, border: 0 }}>
                              <Box pl={1}>
                                <SingleCheckbox value="sumi" control={control} setValue={setValue} checkboxes={youkaigoNinteiCheckboxes} name={`${tabName}.${youkaigoNinteiCheckName}`} />
                              </Box>
                            </BodyCell>
                            <BodyCell style={{ border: 0 }}>
                              <DataDisplay id={`${id}-youkaigo-nintei-check-sumi-yajirushi`} value="→" />
                            </BodyCell>
                            <BodyCell style={{ border: 0 }}>
                              <Box pl={1}>
                                <CheckboxField
                                  id={`${id}-youkaigo-nintei-naiyou-check-sumi`}
                                  name={`${tabName}.youkaigoNinteiNaiyouCheckSumi`}
                                  checkboxes={youkaigoNinteiNaiyouCheckboxes}
                                  labelWidth={0}
                                  size="small"
                                  singleCheck
                                  control={control}
                                />
                              </Box>
                            </BodyCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th">認定日</HeaderCell>
              <BodyCell br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <CalendarInput id={`${id}-youkaigo-nintei-sumi-date`} name={`${tabName}.youkaigoNinteiSumiDate`} disabled={disableYoukaigoNinteiSumiDay} variant="table" control={control} />
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            <TableRow>
              <BodyCell colSpan={8} br>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <TableContainer>
                      <Table aria-label="kaigi-table">
                        <colgroup>
                          <col style={{ width: 110 }} />
                          <col />
                          <col />
                        </colgroup>
                        <TableBody>
                          <TableRow>
                            <BodyCell style={{ paddingLeft: 0, border: 0 }}>
                              <Box pl={1}>
                                <SingleCheckbox value="misumi" control={control} setValue={setValue} checkboxes={youkaigoNinteiCheckboxes} name={`${tabName}.${youkaigoNinteiCheckName}`} />
                              </Box>
                            </BodyCell>
                            <BodyCell style={{ border: 0 }}>
                              <DataDisplay id={`${id}-youkaigo-nintei-check-misumi-yajirushi`} value="→" />
                            </BodyCell>
                            <BodyCell style={{ border: 0 }}>
                              <Box pl={1}>
                                <CheckboxField
                                  id={`${id}-youkaigo-nintei-naiyou-check-misumi`}
                                  name={`${tabName}.youkaigoNinteiNaiyouCheckMisumi`}
                                  checkboxes={youkaigoNinteiNaiyouCheckboxes}
                                  labelWidth={0}
                                  size="small"
                                  singleCheck
                                  control={control}
                                />
                              </Box>
                            </BodyCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 身障手帳 */}
            <TableRow>
              <HeaderCell component="th">身障手帳</HeaderCell>
              <BodyCell>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Box pl={1}>
                      <CheckboxField
                        id={`${id}-shinshou-techou-check`}
                        name={`${tabName}.${shinshouTechouCheckName}`}
                        checkboxes={umuCheckboxes}
                        control={control}
                        labelWidth={0}
                        size="small"
                        singleCheck
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th">等級</HeaderCell>
              <BodyCell>
                <Grid container direction="row" justify="flex-end" alignItems="center">
                  <Grid item>
                    <Box maxWidth={60}>
                      <TextInput
                        id={`${id}-shinshou-techou-toukyuu-shu`}
                        name={`${tabName}.shinshouTechouToukyuuShu`}
                        type="text"
                        variant="table"
                        suffix="種"
                        disabled={disableShinshouTechou}
                        control={control}
                      />
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box maxWidth={60} ml={1}>
                      <TextInput
                        id={`${id}-shinshou-techou-toukyuu-kyu`}
                        name={`${tabName}.shinshouTechouToukyuuKyu`}
                        type="text"
                        variant="table"
                        suffix="級"
                        disabled={disableShinshouTechou}
                        control={control}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
              <BodyCell>
                <br />
              </BodyCell>
              <BodyCell style={{ borderLeft: tableBorderStyle }} colSpan={2}>
                <TextInput
                  id={`${id}-shinshou-techou-toukyuu-text`}
                  name={`${tabName}.shinshouTechouToukyuuText`}
                  type="textarea"
                  variant="table"
                  rowsMin={2}
                  fullWidth
                  disabled={disableShinshouTechou}
                  control={control}
                />
              </BodyCell>
              <HeaderCell component="th">交付日</HeaderCell>
              <BodyCell br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <CalendarInput id={`${id}-shinshou-techou-toukyuu-date`} name={`${tabName}.shinshouTechouToukyuuDate`} variant="table" disabled={disableShinshouTechou} control={control} />
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 療育手帳 */}
            <TableRow>
              <HeaderCell component="th">療育手帳</HeaderCell>
              <BodyCell>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Box pl={1}>
                      <CheckboxField
                        id={`${id}-ryouiku-techou-check`}
                        name={`${tabName}.${ryouikuTechouCheckName}`}
                        checkboxes={umuCheckboxes}
                        control={control}
                        labelWidth={0}
                        size="small"
                        singleCheck
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th">程度</HeaderCell>
              <BodyCell colSpan={2}>
                <TextInput
                  id={`${id}-ryouiku-techou-teido-text1`}
                  name={`${tabName}.ryouikuTechouTeidoText1`}
                  type="textarea"
                  variant="table"
                  rowsMin={2}
                  fullWidth
                  disabled={disableRyouikuTechou}
                  control={control}
                />
              </BodyCell>
              <BodyCell style={{ borderLeft: tableBorderStyle }} colSpan={2}>
                <TextInput
                  id={`${id}-ryouiku-techou-teido-text2`}
                  name={`${tabName}.ryouikuTechouTeidoText2`}
                  type="textarea"
                  variant="table"
                  rowsMin={2}
                  fullWidth
                  disabled={disableRyouikuTechou}
                  control={control}
                />
              </BodyCell>
              <HeaderCell component="th">交付日</HeaderCell>
              <BodyCell br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <CalendarInput id={`${id}-ryouiku-techou-teido-date`} name={`${tabName}.ryouikuTechouTeidoDate`} variant="table" disabled={disableRyouikuTechou} control={control} />
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 精神障害者 保健福祉手帳 */}
            <TableRow>
              <HeaderCell component="th">
                <>
                  精神障害者
                  <br />
                  保健福祉手帳
                </>
              </HeaderCell>
              <BodyCell>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Box pl={1}>
                      <CheckboxField
                        id={`${id}-seishin-shougaisha-hoken-fukushi-techou-check`}
                        name={`${tabName}.${seishinShougaishaHokenFukushiTechouCheckName}`}
                        checkboxes={umuCheckboxes}
                        control={control}
                        labelWidth={0}
                        size="small"
                        singleCheck
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th">等級</HeaderCell>
              <BodyCell>
                <Grid container direction="row" justify="flex-end" alignItems="center">
                  <Grid item>
                    <Box maxWidth={60}>
                      <TextInput
                        id={`${id}-seishin-shougaisha-hoken-fukushi-techou-toukyuu-kyu`}
                        name={`${tabName}.seishinShougaishaHokenFukushiTechouToukyuuKyu`}
                        type="text"
                        variant="table"
                        suffix="級"
                        disabled={disableSeishinShougaishaHokenFukushiTechou}
                        control={control}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
              <BodyCell>
                <br />
              </BodyCell>
              <BodyCell style={{ borderLeft: tableBorderStyle }} colSpan={2}>
                <TextInput
                  id={`${id}-seishin-shougaisha-hoken-fukushi-techou-toukyuu-text`}
                  name={`${tabName}.seishinShougaishaHokenFukushiTechouToukyuuText`}
                  type="textarea"
                  variant="table"
                  rowsMin={2}
                  fullWidth
                  disabled={disableSeishinShougaishaHokenFukushiTechou}
                  control={control}
                />
              </BodyCell>
              <HeaderCell component="th">交付日</HeaderCell>
              <BodyCell br>
                <Grid container direction="row" justify="flex-start">
                  <Grid item>
                    <CalendarInput
                      id={`${id}-seishin-shougaisha-hoken-fukushi-techou-toukyuu-date`}
                      name={`${tabName}.seishinShougaishaHokenFukushiTechouToukyuuDate`}
                      variant="table"
                      disabled={disableSeishinShougaishaHokenFukushiTechou}
                      control={control}
                    />
                  </Grid>
                </Grid>
              </BodyCell>
            </TableRow>
            {/* 障害福祉サービス 受給者証の有無 */}
            <TableRow>
              <HeaderCell component="th">
                <>
                  障害福祉サービス
                  <br />
                  受給者証の有無
                </>
              </HeaderCell>
              <BodyCell>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Box pl={1}>
                      <CheckboxField
                        id={`${id}-shougai-fukushi-service-jukyuusha-umu-check`}
                        name={`${tabName}.shougaiFukushiServiceJukyuushaUmuCheck`}
                        checkboxes={umuCheckboxes}
                        labelWidth={0}
                        size="small"
                        singleCheck
                        control={control}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th" colSpan={2}>
                <>
                  自立支援医療
                  <br />
                  受給者証の有無
                </>
              </HeaderCell>
              <BodyCell>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>
                    <Box pl={1}>
                      <CheckboxField
                        id={`${id}-jiritsushien-iryou-jukyuusha-umu-check`}
                        name={`${tabName}.${jiritsushienIryouJukyuushaUmuCheckName}`}
                        checkboxes={umuCheckboxes}
                        control={control}
                        labelWidth={0}
                        size="small"
                        singleCheck
                      />
                    </Box>
                  </Grid>
                </Grid>
              </BodyCell>
              <BodyCell style={{ borderLeft: tableBorderStyle }} colSpan={4} br>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>障害支援区分 → (</Grid>
                  <Grid item>
                    <TextInput
                      id={`${id}-jiritsushien-iryou-jukyuusha-umu-text`}
                      name={`${tabName}.jiritsushienIryouJukyuushaUmuText`}
                      type="text"
                      variant="table"
                      disabled={disableJiritsushienIryouJukyuushaUmuText}
                      control={control}
                    />
                  </Grid>
                  <Grid item>)</Grid>
                </Grid>
              </BodyCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* ***** 日常生活自立度 エリア col = 7 */}
      <TableContainer style={{ marginBottom: 10 }}>
        <Table aria-label="kaigi-table">
          <colgroup>
            {/* 1 : header 項目なので幅固定のため width px 指定 */}
            <col style={{ minWidth: 110, width: 110 }} />
            {/* 2 : header 項目なので幅固定のため width px 指定 */}
            <col style={{ borderLeft: tableBorderStyle, minWidth: 85, width: 85 }} />
            {/* 3 */}
            <col style={{ minWidth: 150 }} />
            {/* 4 : header 項目なので幅固定のため width px 指定 */}
            <col style={{ borderLeft: tableBorderStyle, minWidth: 30, width: 30 }} />
            {/* 5 */}
            <col style={{ minWidth: 300 }} />
            {/* 6 : header 項目なので幅固定のため width px 指定 */}
            <col style={{ borderLeft: tableBorderStyle, minWidth: 30, width: 30 }} />
            {/* 7 */}
            <col style={{ minWidth: 160 }} />
          </colgroup>
          <TableBody>
            {/* 日常生活自立度 */}
            {/* 障害高齢者 */}
            <TableRow>
              <HeaderCell component="th" rowSpan={2}>
                日常生活自立度
              </HeaderCell>
              <HeaderCell component="th">障害高齢者</HeaderCell>
              <BodyCell bt>
                <Box pl={1}>
                  <CheckboxField
                    id={`${id}-shougai-koureisha-check`}
                    name={`${tabName}.shougaiKoureishaCheck`}
                    checkboxes={shougaiKoureishaCheckboxes}
                    labelWidth={0}
                    size="small"
                    singleCheck
                    control={control}
                  />
                </Box>
              </BodyCell>
              <HeaderCell component="th" rowSpan={2}>
                判<br />定<br />者
              </HeaderCell>
              <BodyCell bt>
                <TextInput id={`${id}-shougai-koureisha-hanteisha`} name={`${tabName}.shougaiKoureishaHanteisha`} variant="table" type="text" control={control} />
                <br />
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>(機関名</Grid>
                  <Grid item>
                    <Box>
                      <TextInput id={`${id}-shougai-koureisha-hanteisha-kikan-name`} name={`${tabName}.shougaiKoureishaHanteishaKikanName`} variant="table" type="text" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>)</Grid>
                </Grid>
              </BodyCell>
              <HeaderCell component="th" rowSpan={2}>
                判<br />定<br />日
              </HeaderCell>
              <BodyCell bt br>
                <CalendarInput id={`${id}-shougai-koureisha-hanteisha-date`} name={`${tabName}.shougaiKoureishaHanteishaDate`} variant="table" control={control} />
              </BodyCell>
            </TableRow>
            {/* 認知症 */}
            <TableRow>
              <HeaderCell component="th">認知症</HeaderCell>
              <BodyCell>
                <Box pl={1}>
                  <CheckboxField id={`${id}-ninchishou-check`} name={`${tabName}.ninchishouCheck`} checkboxes={ninchishouCheckboxes} labelWidth={0} size="small" singleCheck control={control} />
                </Box>
              </BodyCell>
              <BodyCell>
                <TextInput id={`${id}-ninchishou-hanteisha`} name={`${tabName}.ninchishouHanteisha`} variant="table" type="text" control={control} />
                <br />
                <Grid container direction="row" justify="flex-start" alignItems="center">
                  <Grid item>(機関名</Grid>
                  <Grid item>
                    <Box>
                      <TextInput id={`${id}-ninchishou-hanteisha-kikan-name`} name={`${tabName}.ninchishouHanteishaKikanName`} variant="table" type="text" control={control} />
                    </Box>
                  </Grid>
                  <Grid item>)</Grid>
                </Grid>
              </BodyCell>
              <BodyCell br>
                <CalendarInput id={`${id}-ninchishou-hanteisha-date`} name={`${tabName}.ninchishouHanteishaDate`} variant="table" control={control} />
              </BodyCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* フッター */}
      <Grid container direction="row" justify="flex-end" alignItems="center">
        <Grid item>
          <CalendarInputField
            id={`${id}-assessment-jisshi-shokai-date`}
            name={`${tabName}.assessmentJisshiShokaiDate`}
            label="アセスメント実施日（初回）"
            variant="table"
            labelWidth={200}
            control={control}
          />
        </Grid>
        <Grid item>
          <CalendarInputField id={`${id}-assessment-jisshi-update-date`} name={`${tabName}.assessmentJisshiUpdateDate`} label="（更新）" variant="table" labelWidth={80} control={control} />
        </Grid>
      </Grid>
    </>
  );
};

export default Assessment1InputForm;
