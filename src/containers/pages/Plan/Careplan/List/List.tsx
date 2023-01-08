import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Container, Box, Grid } from '@material-ui/core';
import { CellProps, DataGrid, DataGridColumn, EditableGridData, useEditableDataGrid } from '@my/components/molecules/DataGrid';
import { TextColumnFilter, DataKindColumnFilter, includesSomeFilterType } from '@my/components/molecules/DataGrid/filters';
import { RootState, useTypedSelector } from '@my/stores';
import HihoEdit from '@my/containers/pages/Riyousha/Kaigo/HihoEdit';
import screenIDs from '@my/screenIDs';
import { useStackRiyoushaInfo } from '@my/action-hooks/riyoushaInfo';
import { LabelAndValue } from 'maps4nc-frontend-web-api/dist/lib/model';
import DataDisplay from '@my/components/atomic/DataDisplay';
import KengenUtils from '@my/utils/KengenUtils';
import useGetLoginKengenInfo from '@my/hooks/useGetLoginKengenInfo';

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

/* TODO 認定期間のフィルター */
const niinteiFilterItems = [
  { value: '全て', label: '全て' },
  { value: '更新申請日(60日前)', label: '更新申請日(60日前)' },
  { value: '保険証なし', label: '保険証なし' },
];

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
  isGenan: boolean;
  isTeishutsu: boolean;
  limitedAssessmentDate?: boolean;
  assessmentDate?: number;
  limitedKeikakusho1Date?: boolean;
  keikakusho1Date?: number;
  limitedKeikakusho2Date?: boolean;
  keikakusho2Date?: number;
  limitedShuukanServiceDate?: boolean;
  shuukanServiceDate?: number;
  limitedKaigiDate?: boolean;
  kaigiDate?: number;
  limitedMonitoringDate?: boolean;
  monitoringDate?: number;
};

const defaultData: GridColumnData[] = [
  {
    riyoushaSeq: 1,
    riyoushaNo: '0000000201',
    riyoushaKanjiName: 'テストユーザー１１１２',
    riyoushaKanaName: 'テストユーザーイチ',
    riyoushaSexKbn: { label: '男', value: '1' },
    riyoushaBirthDate: 315846000000,
    youkaigodo: '要介護１',
    limitedNinteiDate: false,
    alertNinteiDate: false,
    ninteiStartDate: 1854716400000,
    ninteiEndDate: 1861801200000,
    careManeger: 'SRA',
    isGenan: true,
    isTeishutsu: true,
    limitedAssessmentDate: false,
    assessmentDate: 1648998000000,
    limitedKeikakusho1Date: false,
    keikakusho1Date: 1651676400000,
    limitedKeikakusho2Date: false,
    keikakusho2Date: undefined,
    limitedShuukanServiceDate: false,
    shuukanServiceDate: 1657119600000,
    limitedKaigiDate: true,
    kaigiDate: 1659884400000,
    limitedMonitoringDate: false,
    monitoringDate: 1665327600000,
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
    isGenan: false,
    isTeishutsu: false,
    limitedAssessmentDate: false,
    assessmentDate: 1648998000000,
    limitedKeikakusho1Date: false,
    keikakusho1Date: undefined,
    limitedKeikakusho2Date: false,
    keikakusho2Date: undefined,
    limitedShuukanServiceDate: false,
    shuukanServiceDate: undefined,
    limitedKaigiDate: false,
    kaigiDate: undefined,
    limitedMonitoringDate: false,
    monitoringDate: undefined,
  },
];

type Prop = {
  handleKeikakushoLinkClick: (tabId: string, riyoushaSeq: number) => void;
};

const List: React.FC<Prop> = (props: Prop) => {
  const { handleKeikakushoLinkClick } = props;

  const history = useHistory();
  const stackRiyoushaInfo = useStackRiyoushaInfo();
  const openedHihoEditDialog = useTypedSelector((state: RootState) => state.riyoushaKaigoHiho.openedHihoEditDialog);

  const getLoginKengenInfo = useGetLoginKengenInfo();
  const kengenPath = getLoginKengenInfo(['plan', 'careplan', 'kaigo']);

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
        typeAll: niinteiFilterItems,
        forceTypeAllOnly: true,
        filter: includesSomeFilterType,
        Filter: DataKindColumnFilter,
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
        Header: '担当ｹｱｱﾈ',
        accessor: 'careManeger',
        width: 1,
        minWidth: 100,
        maxWidth: 170,
        Filter: DataKindColumnFilter,
        disableSortBy: true,
      },
      {
        Header: 'ｱｾｽﾒﾝﾄ',
        accessor: 'assessmentDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: DataKindColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('assessment', original.riyoushaSeq);
          };
          const readableAssessment = KengenUtils.isReadable(kengenPath[screenIDs.L1000_01.id]);
          return (
            <StyledLinkCell onClick={readableAssessment ? handleClick : undefined} $limited={original.limitedAssessmentDate} $readable={readableAssessment}>
              {original.assessmentDate ? <DataDisplay id="assessment-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '計画書(1)',
        accessor: 'keikakusho1Date',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('plan1', original.riyoushaSeq);
          };
          const addGenStr = original.isGenan ? '原' : '';
          const readablePlan1 = KengenUtils.isReadable(kengenPath[screenIDs.L1210_01.id]);
          return (
            <StyledLinkCell onClick={readablePlan1 ? handleClick : undefined} $limited={original.limitedKeikakusho1Date} $readable={readablePlan1}>
              {original.keikakusho1Date ? (
                <Grid container justify="center">
                  <DataDisplay id="keikakusho1-date" type="short-date" value={value} />
                  <>{addGenStr}</>
                </Grid>
              ) : (
                '未'
              )}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '計画書(2)',
        accessor: 'keikakusho2Date',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('plan2', original.riyoushaSeq);
          };
          const readablePlan2 = KengenUtils.isReadable(kengenPath[screenIDs.L1220_01.id]);
          return (
            <StyledLinkCell onClick={readablePlan2 ? handleClick : undefined} $limited={original.limitedKeikakusho2Date} $readable={readablePlan2}>
              {original.keikakusho2Date ? <DataDisplay id="keikakusho2-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: '週間ｻｰﾋﾞｽ',
        accessor: 'shuukanServiceDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('weeklyplan', original.riyoushaSeq);
          };
          const readableWeeklyplan = KengenUtils.isReadable(kengenPath[screenIDs.L1230_01.id]);
          return (
            <StyledLinkCell onClick={readableWeeklyplan ? handleClick : undefined} $limited={original.limitedShuukanServiceDate} $readable={readableWeeklyplan}>
              {original.shuukanServiceDate ? <DataDisplay id="shuukanService-date" type="short-date" value={value} /> : '未'}
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
            handleKeikakushoLinkClick('kaigi', original.riyoushaSeq);
          };
          const readableKaigi = KengenUtils.isReadable(kengenPath[screenIDs.L1240_01.id]);
          return (
            <StyledLinkCell onClick={readableKaigi ? handleClick : undefined} $limited={original.limitedKaigiDate} $readable={readableKaigi}>
              {original.kaigiDate ? <DataDisplay id="kaigi-date" type="short-date" value={value} /> : '未'}
            </StyledLinkCell>
          );
        },
      },
      {
        Header: 'ﾓﾆﾀﾘﾝｸﾞ',
        accessor: 'monitoringDate',
        alignCell: 'center',
        width: 1,
        minWidth: 80,
        Filter: TextColumnFilter,
        disableSortBy: true,
        Cell: ({ row: { original }, value }: CellProps<GridColumnData, string>) => {
          const handleClick = () => {
            handleKeikakushoLinkClick('monitoring', original.riyoushaSeq);
          };
          const readableMonitoring = KengenUtils.isReadable(kengenPath[screenIDs.L1260_01.id]);
          return (
            <StyledLinkCell onClick={readableMonitoring ? handleClick : undefined} $limited={original.limitedMonitoringDate} $readable={readableMonitoring}>
              {original.monitoringDate ? <DataDisplay id="monitoring-date" type="short-date" value={value} /> : '未'}
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

export default List;
