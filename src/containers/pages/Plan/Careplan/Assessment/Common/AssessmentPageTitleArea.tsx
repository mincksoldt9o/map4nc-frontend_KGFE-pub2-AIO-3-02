import React from 'react';
import { Box, Grid } from '@material-ui/core';
import Title from '@my/components/atomic/Title';
import OptionButton from '@my/components/atomic/OptionButton';
import Button from '@my/components/atomic/Button';
import CalendarInput from '@my/components/molecules/CalendarInput';
import { AssessmentMenuTabValueType } from './utils';

type AssessmentPageTitleAreaProps = {
  title: string;
  selectedTab: AssessmentMenuTabValueType;
};

const AssessmentPageTitleArea: React.FC<AssessmentPageTitleAreaProps> = (props: AssessmentPageTitleAreaProps) => {
  const { title, selectedTab } = props;
  return (
    <Grid container direction="row" justify="space-between">
      <Grid item>
        <Grid container direction="row" justify="flex-start">
          <Grid item>
            <Title id="assessment-page-title">{title}</Title>
          </Grid>
          <Grid item>
            <Box mt={0.5} minWidth={150}>
              <OptionButton
                id="sakusei-option"
                name="sakuseiOpion"
                options={[
                  { label: '未作成', value: '1' },
                  { label: '作成中', value: '2' },
                  { label: '作成済', value: '3' },
                ]}
                defaultValue="1"
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {selectedTab === 'ASSESSMENT3' ? (
          <Box mt={0.5} minWidth={150}>
            <CalendarInput id="create-date1" name="createDate1" defaultValue={new Date()} variant="table" />
            時点
          </Box>
        ) : (
          <Grid container direction="row" justify="flex-end" alignItems="center">
            {selectedTab === 'ASSESSMENT1' && (
              <Grid item>
                <Box minWidth={200}>
                  <Button id="sansyo-button" variant="outlined">
                    利用者基本情報取り込み
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default AssessmentPageTitleArea;
