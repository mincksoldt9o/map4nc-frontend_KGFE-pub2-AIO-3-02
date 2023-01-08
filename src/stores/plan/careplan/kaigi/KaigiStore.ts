import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LabelAndValue, PlanServiseTantoushaKaigi, PlanRiyoushaKihon } from 'maps4nc-frontend-web-api/dist/lib/model';

export type KaigiState = {
  planServiseTantoushaKaigi?: PlanServiseTantoushaKaigi;
  riyoushaKihon?: PlanRiyoushaKihon;
  youkaigodoList?: LabelAndValue[];
  loadingStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  loadingRiyoushaKihonStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  loadingYoukaigodoListStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  isDirty: boolean;
};

const initialState = (): KaigiState => ({
  planServiseTantoushaKaigi: undefined,
  riyoushaKihon: undefined,
  youkaigodoList: [],
  loadingStatus: 'NotLoad',
  loadingRiyoushaKihonStatus: 'NotLoad',
  loadingYoukaigodoListStatus: 'NotLoad',
  isDirty: false,
});

const kaigiStore = createSlice({
  name: 'KaigiStore',
  initialState: initialState(),
  reducers: {
    loading: (draftState: KaigiState) => {
      draftState.loadingStatus = 'Loading';
    },
    loadingRiyoushaKihon: (draftState: KaigiState) => {
      draftState.loadingRiyoushaKihonStatus = 'Loading';
    },
    loadingYoukaigodoList: (draftState: KaigiState) => {
      draftState.loadingYoukaigodoListStatus = 'Loading';
    },
    errored: (draftState: KaigiState) => {
      draftState.loadingStatus = 'Error';
    },
    erroredRiyoushaKihon: (draftState: KaigiState) => {
      draftState.loadingRiyoushaKihonStatus = 'Error';
    },
    erroredYoukaigodoList: (draftState: KaigiState) => {
      draftState.loadingYoukaigodoListStatus = 'Error';
    },
    fetchedPlanServiseTantoushaKaigi: (draftState: KaigiState, action: PayloadAction<PlanServiseTantoushaKaigi>) => {
      draftState.loadingStatus = 'Loaded';
      draftState.planServiseTantoushaKaigi = action.payload;
    },
    fetchedRiyoushaKihon: (draftState: KaigiState, action: PayloadAction<PlanRiyoushaKihon>) => {
      draftState.loadingRiyoushaKihonStatus = 'Loaded';
      draftState.riyoushaKihon = action.payload;
    },
    fetchedYoukaigodoList: (draftState: KaigiState, action: PayloadAction<LabelAndValue[]>) => {
      draftState.loadingYoukaigodoListStatus = 'Loaded';
      draftState.youkaigodoList = action.payload;
    },
    clearKaigi: (draftState: KaigiState) => {
      draftState.loadingStatus = 'NotLoad';
      draftState.loadingRiyoushaKihonStatus = 'NotLoad';
      draftState.loadingYoukaigodoListStatus = 'NotLoad';
      draftState.planServiseTantoushaKaigi = undefined;
      draftState.riyoushaKihon = undefined;
      draftState.youkaigodoList = [];
      draftState.isDirty = false;
    },
    setDirty: (draftState: KaigiState, action: PayloadAction<boolean>) => {
      draftState.isDirty = action.payload;
    },
  },
});

export default kaigiStore;
