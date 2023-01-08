import React from 'react';
import { Box, TableContainer, Table, TableBody, TableRow, TableHead } from '@material-ui/core';
import { LayoutForm } from '@my/components/layouts/Form';
import TextInput from '@my/components/atomic/TextInput';
import ComboBox, { LabelAndValue } from '@my/components/atomic/ComboBox';
import Checkbox from '@my/components/atomic/Checkbox';
import { BodyCell, HeaderCell } from '@my/components/layouts/Table';
import AssessmentPageTitleArea from '../Common/AssessmentPageTitleArea';

const seikatsuRhythmComboOptionList: LabelAndValue[] = [
  { value: '', label: '　' },
  { value: '1', label: '◎' },
  { value: '2', label: '◎排便' },
  { value: '3', label: '〇' },
  { value: '4', label: '〇排尿' },
  { value: '5', label: '□' },
  { value: '6', label: '□起床' },
  { value: '7', label: '△' },
  { value: '8', label: '△食事' },
  { value: '9', label: '△朝食' },
  { value: '10', label: '△昼食' },
  { value: '11', label: '△夕食' },
  { value: '12', label: '☆' },
  { value: '13', label: '☆入浴' },
  { value: '14', label: '■' },
  { value: '15', label: '■就寝' },
];

type BodyContentsType = {
  id: string;
  title: string;
  span: JSX.Element[];
};

const Hours = (start: number, hours: number) => {
  const hurs: JSX.Element[] = [];
  for (let i = 0; i < hours; i += 1) {
    let startHour = start + i;
    let endHour = startHour + 1;
    if (startHour >= 24) {
      startHour -= 24;
    }
    if (endHour >= 24) {
      endHour -= 24;
    }
    hurs.push(
      <Box>
        {`${startHour}:00`}
        <br /> ~ <br />
        {`${endHour}:00`}
      </Box>
    );
  }
  return hurs;
};

const bodyContents: BodyContentsType[] = [
  { id: 'shinya', title: '深夜', span: Hours(4, 2) },
  { id: 'sochou', title: '早朝', span: Hours(6, 2) },
  { id: 'gozen', title: '午前', span: Hours(8, 4) },
  { id: 'gogo', title: '午後', span: Hours(12, 6) },
  { id: 'yakan', title: '夜間', span: Hours(18, 4) },
  { id: 'shinya', title: '深夜', span: Hours(22, 6) },
];

const Schedule: React.FC = () => {
  return (
    <LayoutForm id="schedule-form" disableGridLayout>
      <AssessmentPageTitleArea title="１日のスケジュール" selectedTab="SCHEDULE" />
      <TableContainer>
        <Table className="schedule-table">
          <TableHead>
            <TableRow>
              <HeaderCell colSpan={2} rowSpan={2} />
              <HeaderCell colSpan={2} rowSpan={2}>
                本人の生活リズム
              </HeaderCell>
              <HeaderCell rowSpan={2}>
                ①本人が自分でしていること
                <br />
                ②したいと思っていること(好み)
              </HeaderCell>
              <HeaderCell colSpan={2}>援助の現状</HeaderCell>
              <HeaderCell width={12} rowSpan={2}>
                援助✓
              </HeaderCell>
              <HeaderCell width={12} rowSpan={2}>
                計画〇
              </HeaderCell>
            </TableRow>
            <TableRow>
              <HeaderCell>家族実施</HeaderCell>
              <HeaderCell>サービス実施</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bodyContents.map((contents) => (
              <>
                <TableRow>
                  <HeaderCell component="th" rowSpan={contents.span.length + 1} width={10}>
                    {contents.title}
                  </HeaderCell>
                </TableRow>
                {contents.span.map((span, row) => (
                  <TableRow>
                    <HeaderCell width={20}>{span}</HeaderCell>
                    <BodyCell align="center">
                      <Box mb={1} minWidth={80}>
                        <ComboBox
                          id={`seikatsu-rhythm-combo-${contents.id}-${row}-1`}
                          name={`seikatsuRhythmCombo${contents.id}${row}1`}
                          placeholder=""
                          options={seikatsuRhythmComboOptionList}
                          variant="table"
                        />
                      </Box>
                      <ComboBox
                        id={`seikatsu-rhythm-combo-${contents.id}-${row}-2`}
                        name={`seikatsuRhythmCombo${contents.id}${row}2`}
                        placeholder=""
                        options={seikatsuRhythmComboOptionList}
                        variant="table"
                      />
                    </BodyCell>
                    <BodyCell br>
                      <Box mb={1}>
                        <TextInput
                          id={`seikatsu-rhythm-text-${contents.id}-${row}-1`}
                          name={`seikatsuRhythmText${contents.id}${row}1`}
                          type="text"
                          imeMode="auto"
                          defaultValue=""
                          fullWidth
                          variant="table"
                        />
                      </Box>
                      <TextInput
                        id={`seikatsu-rhythm-text-${contents.id}-${row}-2`}
                        name={`seikatsuRhythmText${contents.id}${row}2`}
                        type="text"
                        imeMode="auto"
                        defaultValue=""
                        fullWidth
                        variant="table"
                      />
                    </BodyCell>
                    <BodyCell br>
                      <TextInput
                        id={`self-action-${contents.id}-${row}`}
                        name={`selfAction${contents.id}${row}`}
                        type="textarea"
                        imeMode="auto"
                        defaultValue=""
                        rowsMin={3}
                        fullWidth
                        variant="table"
                      />
                    </BodyCell>
                    <BodyCell br>
                      <TextInput
                        id={`kazokuzissi-${contents.id}-${row}`}
                        name={`kazokuzissi${contents.id}${row}`}
                        type="textarea"
                        imeMode="auto"
                        defaultValue=""
                        rowsMin={3}
                        fullWidth
                        variant="table"
                      />
                    </BodyCell>
                    <BodyCell br>
                      <TextInput
                        id={`servicezissi-${contents.id}-${row}`}
                        name={`servicezissi${contents.id}${row}`}
                        type="textarea"
                        imeMode="auto"
                        defaultValue=""
                        rowsMin={3}
                        fullWidth
                        variant="table"
                      />
                    </BodyCell>
                    <BodyCell align="center" br>
                      <Checkbox id={`enjo-${contents.id}-${row}`} name={`enjo${contents.id}${row}`} size="small" />
                    </BodyCell>
                    <BodyCell align="center" br>
                      <Checkbox id={`plan-${contents.id}-${row}`} name={`plan${contents.id}${row}`} size="small" />
                    </BodyCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </LayoutForm>
  );
};

export default Schedule;
