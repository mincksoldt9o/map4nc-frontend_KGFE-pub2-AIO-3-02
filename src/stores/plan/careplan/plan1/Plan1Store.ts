import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabelAndValue, PlanKyotakuServiceKeikakusho1, PlanRiyoushaKihon } from 'maps4nc-frontend-web-api/dist/lib/model';

export type Plan1State = {
  planKyotakuServiceKeikakusho1?: PlanKyotakuServiceKeikakusho1;
  riyoushaKihon?: PlanRiyoushaKihon;
  youkaigodoList?: LabelAndValue[];
  loadingStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  loadingRiyoushaKihonStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  loadingYoukaigodoListStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  isDirty: boolean;
};

const initialState = (): Plan1State => ({
  planKyotakuServiceKeikakusho1: undefined,
  riyoushaKihon: undefined,
  youkaigodoList: [],
  loadingStatus: 'NotLoad',
  loadingRiyoushaKihonStatus: 'NotLoad',
  loadingYoukaigodoListStatus: 'NotLoad',
  isDirty: false,
});

const plan1Store = createSlice({
  name: 'Plan1Store',
  initialState: initialState(),
  reducers: {
    loading: (draftState: Plan1State) => {
      draftState.loadingStatus = 'Loading';
    },
    loadingRiyoushaKihon: (draftState: Plan1State) => {
      draftState.loadingRiyoushaKihonStatus = 'Loading';
    },
    loadingYoukaigodoList: (draftState: Plan1State) => {
      draftState.loadingYoukaigodoListStatus = 'Loading';
    },
    errored: (draftState: Plan1State) => {
      draftState.loadingStatus = 'Error';
    },
    erroredRiyoushaKihon: (draftState: Plan1State) => {
      draftState.loadingRiyoushaKihonStatus = 'Error';
    },
    erroredYoukaigodoList: (draftState: Plan1State) => {
      draftState.loadingYoukaigodoListStatus = 'Error';
    },
    fetchedPlanKyotakuServiceKeikakusho1: (draftState: Plan1State, action: PayloadAction<PlanKyotakuServiceKeikakusho1>) => {
      draftState.loadingStatus = 'Loaded';
      draftState.planKyotakuServiceKeikakusho1 = action.payload;
    },
    fetchedRiyoushaKihon: (draftState: Plan1State, action: PayloadAction<PlanRiyoushaKihon>) => {
      draftState.loadingRiyoushaKihonStatus = 'Loaded';
      draftState.riyoushaKihon = action.payload;
    },
    fetchedYoukaigodoList: (draftState: Plan1State, action: PayloadAction<LabelAndValue[]>) => {
      draftState.loadingYoukaigodoListStatus = 'Loaded';
      draftState.youkaigodoList = action.payload;
    },
    clearPlan1: (draftState: Plan1State) => {
      draftState.loadingStatus = 'NotLoad';
      draftState.loadingRiyoushaKihonStatus = 'NotLoad';
      draftState.loadingYoukaigodoListStatus = 'NotLoad';
      draftState.planKyotakuServiceKeikakusho1 = undefined;
      draftState.riyoushaKihon = undefined;
      draftState.youkaigodoList = [];
      draftState.isDirty = false;
    },
    setDirty: (draftState: Plan1State, action: PayloadAction<boolean>) => {
      draftState.isDirty = action.payload;
    },
  },
});

export default plan1Store;
