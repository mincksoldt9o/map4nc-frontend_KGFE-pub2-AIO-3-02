import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Container, Box, Grid } from '@material-ui/core';
import { CellProps, DataGrid, DataGridColumn, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import { TextColumnFilter, DataKindColumnFilter } from '@my/components/molecules/DataGrid/filters';
import { RootState, useTypedSelector } from '@my/stores';
import HihoEdit from '@my/containers/pages/Riyousha/Kaigo/HihoEdit';
import screenIDs from '@my/screenIDs';
import { useStackRiyoushaInfo } from '@my/action-hooks/riyoushaInfo';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import DataDisplay from '@my/components/atomic/DataDisplay';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';
import KengenUtils from '@my/utils/KengenUtils';

const StyledLinkCell = styled.div<{ $limited?: boolean; $readable?: boolean }>`
  cursor: ${(props) => (props.$readable ? 'pointer' : 'default')};
  overflow: hidden;
  text-overflow: ellipsis;
  display: list-item;
  color: ${(props) => (props.$readable ? (props.$limited ? '#ff0000' : '#0044cc') : '')};
  text-decoration: ${(props) => (props.$readable ? 'underline' : 'none')};
`;

const StyledContainer = styled(Container)`
  padding: 0 0 1.5em 0;
` as typeof Container;

type GridColumnData = EditableGridData & {
  riyoushaSeq: number;
  riyoushaNo?: string;
  riyoushaKanjiName?: string;
  riyoushaKanaName?: string;
  riyoushaSexKbn?: LabelAndValue;
  riyoushaBirthDate?: number;
  youkaigodo?: string;
  limitedNinteiDate?: boolean;
  alertNinteiDate?: boolean;
  ninteiStartDate?: number;
  ninteiEndDate?: number;
  careManeger: string;
  chiikiHoukatsuShienCenter: string;
  isGenan: boolean;
  isTeishutsu: boolean;
  limitedAssessmentDate?: boolean;
  assessmentDate?: number;
  limitedKihonInfoDate?: boolean;
  kihonInfoDate?: number;
  limitedKihonCheckDate?: boolean;
  kihonCheckDate?: number;
  limitedShienKeikakuDate?: boolean;
  shienKeikakuDate?: number;
  limitedShuukanShienKeikakuDate?: boolean;
  shuukanShienKeikakuDate?: number;
  limitedKaigiDate?: boolean;
  kaigiDate?: number;
  limitedServiceHyoukaHyouDate?: boolean;
  serviceHyoukaHyouDate?: number;
};

const defaultData: GridColumnData[] = [
  {
    riyoushaSeq: 1,
    riyoushaNo: '0000000201',
    riyoushaKanjiName: 'テストユーザー１',
    riyoushaKanaName: 'テストユーザーイチ',
    riyoushaSexKbn: { label: '男', value: '1' },
    riyoushaBirthDate: 315846000000,
    youkaigodo: '要支援１',
    limitedNinteiDate: true,
    alertNinteiDate: false,
    ninteiStartDate: 1735657200000,
    ninteiEndDate: 1740927600000,
    careManeger: 'SRA',
    chiikiHoukatsuShienCenter: '港区地域包括支援センター',
    isGenan: true,
    isTeishutsu: true,
    limitedAssessmentDate: false,
    assessmentDate: 1680534000000,
    limitedKihonInfoDate: false,
    kihonInfoDate: 1683212400000,
    limitedKihonCheckDate: false,
    kihonCheckDate: 1685977200000,
    limitedShienKeikakuDate: false,
    shienKeikakuDate: 1688655600000,
    limitedShuukanShienKeikakuDate: false,
    shuukanShienKeikakuDate: undefined,
    limitedKaigiDate: false,
    kaigiDate: 1694185200000,
    limitedServiceHyoukaHyouDate: false,
    serviceHyoukaHyouDate: 1699628400000,
  },
  {
    disabled: true,
    riyoushaSeq: 2,
    riyoushaNo: '0000000202',
    riyoushaKanjiName: 'テストユーザー２',
    riyoushaKanaName: 'テストユーザーニ',
    riyoushaSexKbn: { label: '女', value: '2' },
    riyoushaBirthDate: 318524400000,
    youkaigodo: undefined,
    limitedNinteiDate: false,
    alertNinteiDate: true,
    ninteiStartDate: undefined,
    ninteiEndDate: undefined,
    careManeger: 'SRA',
    chiikiHoukatsuShienCenter: '港区地域包括支援センター',
    isGenan: false,
    isTeishutsu: false,
    limitedAssessmentDate: false,
    assessmentDate: undefined,
    limitedKihonInfoDate: false,
    kihonInfoDate: undefined,
    limitedKihonCheckDate: false,
    kihonCheckDate: undefined,
    limitedShienKeikakuDate: false,
    shienKeikakuDate: undefined,
    limitedShuukanShienKeikakuDate: false,
    shuukanShienKeikakuDate: undefined,
    limitedKaigiDate: false,
    kaigiDate: undefined,
    limitedServiceHyoukaHyouDate: false,
    serviceHyoukaHyouDate: undefined,
  },
];

type Prop = {
  handleKeikakushoLinkClick: (tabId: string, riyoushaSeq: number) => void;
};

const Yobolist: React.FC<Prop> = (props: Prop) => {
  const { handleKeikakushoLinkClick } = props;

  const history = useHistory();
  const stackRiyoushaInfo = useStackRiyoushaInfo();
  const openedHihoEditDialog = useTypedSelector((state: RootState) => state.riyoushaKaigoHiho.openedHihoEditDialog);

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const kengenPath = getLoginKengenInfo(['plan', 'careplan', 'yobou']);

  const columns: DataGridColumn<GridColumnData>[] = React.useMemo(
    (): DataGridColumn<GridColumnData>[] => [
      {
        Header: '利用者番号',
        accessor: 'riyoushaNo',
        fixed: true,
        width: 100,
        Filter: TextColumnFilter,
        disableSortBy: true,
      },
      {
        Header: '氏名',
        accessor: 'riyoushaKanjiName',
        width: 1,
        minWidth: 100,
        maxWidth: 170,
        Filter: TextColumnFilter,
        disableSortBy: true,
      },
      {
        Header: '要介護度',
        accessor: 'youkaigodo',
        fixed: true,
        width: 90,
        Filter: DataKindColumnFilter,
        disableSortBy: true,
      },
      {
        Header: '認定有効期間',
        accessor: 'ninteiStartDate',
        fixed: true,
        width: 170,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, number>) => {
          const { riyoushaSeq, riyoushaNo, riyoushaKanjiName, riyoushaKanaName, riyoushaSexKbn: sexKbn, riyoushaBirthDate: birthDate, ninteiEndDate } = original;
          const handleClick = () => {
            stackRiyoushaInfo({ riyoushaSeq, riyoushaNo, riyoushaKanjiName, riyoushaKanaName, sexKbn, birthDate });
            history.push(`/riyousha/kaigo/${riyoushaSeq}/hiho`);
          };
          return (
            <StyledLinkCell onClick={handleClick} $limited={original.limitedNinteiDate} $readable>
              {original.alertNinteiDate ? (
                '×'
              ) : value || value === 0 ? (
                <Grid container alignItems="center">
                  <Grid item>
                    <DataDisplay id="nintei-start-date" type="short-date" value={value} />
                  </Grid>
                  <Grid item>～</Grid>
                  <Grid item>
                    <DataDisplay id="nintei-end-date" type="short-date" value={ninteiEndDate} />
                  </Grid>
                </Grid>
              ) : (
                <></>
              )}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '担当ｹｱﾏﾈ',
        accessor: 'careManeger',
        width: 1,
        minWidth: 100,
        maxWidth: 170,
        Filter: DataKindColumnFilter,
        disableSortBy: true,
      },
      {
        Header: '地域包括支援ｾﾝﾀｰ',
        accessor: 'chiikiHoukatsuShienCenter',
        width: 1,
        minWidth: 225,
        maxWidth: 2000,
        Filter: DataKindColumnFilter,
        disableSortBy: true,
      },
      {
        Header: 'ｱｾｽﾒﾝﾄ',
        accessor: 'assessmentDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('assessment', original.riyoushaSeq);
          };
          const readableAssessment = KengenUtils.isReadable(kengenPath[screenIDs.L1001_01.id]);
          return (
            <StyledLinkCell onClick={readableAssessment ? handleClick : undefined} $limited={original.limitedAssessmentDate} $readable={readableAssessment}>
              {original.assessmentDate ? <DataDisplay id="assessment-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '利用者基本情報',
        accessor: 'kihonInfoDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('kihon', original.riyoushaSeq);
          };
          const readableKihon = KengenUtils.isReadable(kengenPath[screenIDs.L1310_01.id]);
          return (
            <StyledLinkCell onClick={readableKihon ? handleClick : undefined} $limited={original.limitedKihonInfoDate} $readable={readableKihon}>
              {original.kihonInfoDate ? <DataDisplay id="kihonInfo-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '基本ﾁｪｯｸﾘｽﾄ',
        accessor: 'kihonCheckDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('checklist', original.riyoushaSeq);
          };
          const readableChecklist = KengenUtils.isReadable(kengenPath[screenIDs.L1320_01.id]);
          return (
            <StyledLinkCell onClick={readableChecklist ? handleClick : undefined} $limited={original.limitedKihonCheckDate} $readable={readableChecklist}>
              {original.kihonCheckDate ? <DataDisplay id="kihonChec-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '支援計画書',
        accessor: 'shienKeikakuDate',
        alignCell: 'center',
        width: 1,
        minWidth: 100,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('yoboplanKouroushou', original.riyoushaSeq);
          };
          const addGenStr = original.isGenan ? '原' : '';
          const addSumiStr = original.isTeishutsu ? '済' : '';
          const readableYoboplanKouroushou = KengenUtils.isReadable(kengenPath[screenIDs.L1330_01.id]);
          return (
            <StyledLinkCell onClick={readableYoboplanKouroushou ? handleClick : undefined} $limited={original.limitedShienKeikakuDate} $readable={readableYoboplanKouroushou}>
              {original.shienKeikakuDate ? (
                <Grid container justify="center">
                  <DataDisplay id="shienKeikaku-date" type="short-date" value={value} />
                  <>
                    {addGenStr}
                    {addSumiStr}
                  </>
                </Grid>
              ) : (
                '未'
              )}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '週間支援計画表',
        accessor: 'shuukanShienKeikakuDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('yoboweeklyplan', original.riyoushaSeq);
          };
          const readableYoboweeklyplan = KengenUtils.isReadable(kengenPath[screenIDs.L1340_01.id]);
          return (
            <StyledLinkCell onClick={readableYoboweeklyplan ? handleClick : undefined} $limited={original.limitedShuukanShienKeikakuDate} $readable={readableYoboweeklyplan}>
              {original.shuukanShienKeikakuDate ? <DataDisplay id="shuukanShienKeikaku-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '担当者会議の要点',
        accessor: 'kaigiDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('yobokaigi', original.riyoushaSeq);
          };
          const readableYobokaigi = KengenUtils.isReadable(kengenPath[screenIDs.L1350_01.id]);
          return (
            <StyledLinkCell onClick={readableYobokaigi ? handleClick : undefined} $limited={original.limitedKaigiDate} $readable={readableYobokaigi}>
              {original.kaigiDate ? <DataDisplay id="kaigi-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: 'ｻｰﾋﾞｽ評価表',
        accessor: 'serviceHyoukaHyouDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('yobohyoka', original.riyoushaSeq);
          };
          const readableYobohyoka = KengenUtils.isReadable(kengenPath[screenIDs.L1370_01.id]);
          return (
            <StyledLinkCell onClick={readableYobohyoka ? handleClick : undefined} $limited={original.limitedServiceHyoukaHyouDate} $readable={readableYobohyoka}>
              {original.serviceHyoukaHyouDate ? <DataDisplay id="serviceHyoukaHyou-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
    ],
    [handleKeikakushoLinkClick, history, kengenPath, stackRiyoushaInfo]
  );

  const dataGridValues = useEditableDataGrid<GridColumnData>({
    sortable: true,
    defaultData,
  });

  return (
    <>
      <StyledContainer maxWidth={false}>
        <Box m={1}>
          <DataGrid id="details" columns={columns} minHeight={250} heightOffset={200} {...dataGridValues} showSummary />
        </Box>
      </StyledContainer>
      {openedHihoEditDialog && <HihoEdit id="care-plan-edit-dialog" screenId={screenIDs.C1090_02.id} />}
    </>
  );
};

export default Yobolist;
