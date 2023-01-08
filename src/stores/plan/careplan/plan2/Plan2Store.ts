import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PastContentQuote, PlanKyotakuServiceKeikakusho2 } from 'maps4nc-frontend-web-api/dist/lib/model';

export type Plan2State = {
  pastContentQuote: PastContentQuote[];
  loadingPastContentQuoteStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  plan2: PlanKyotakuServiceKeikakusho2[];
  loadingPlan2Status: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
};

const initialState = (): Plan2State => ({
  pastContentQuote: [],
  loadingPastContentQuoteStatus: 'NotLoad',
  plan2: [],
  loadingPlan2Status: 'NotLoad',
});

const plan2Store = createSlice({
  name: 'Plan2Store',
  initialState: initialState(),
  reducers: {
    loadingPastContentQuoteStatus: (draftState: Plan2State) => {
      draftState.loadingPastContentQuoteStatus = 'Loading';
    },
    erroredPastContentQuoteStatus: (draftState: Plan2State) => {
      draftState.loadingPastContentQuoteStatus = 'Error';
    },
    fetchedPastContentQuote: (draftState: Plan2State, action: PayloadAction<PastContentQuote[]>) => {
      draftState.loadingPastContentQuoteStatus = 'Loaded';
      draftState.pastContentQuote = action.payload;
    },
    loadingPlan2: (draftState: Plan2State) => {
      draftState.loadingPlan2Status = 'Loading';
    },
    erroredPlan2Status: (draftState: Plan2State) => {
      draftState.loadingPlan2Status = 'Error';
    },
    fetchedPlan2: (draftState: Plan2State, action: PayloadAction<PlanKyotakuServiceKeikakusho2[]>) => {
      draftState.loadingPlan2Status = 'Loaded';
      draftState.plan2 = action.payload;
    },
    clearPlan2: (draftState: Plan2State) => {
      draftState.loadingPastContentQuoteStatus = 'NotLoad';
      draftState.pastContentQuote = [];
      draftState.loadingPlan2Status = 'NotLoad';
      draftState.plan2 = [];
    },
    clearPastContentQuote: (draftState: Plan2State) => {
      draftState.loadingPastContentQuoteStatus = 'NotLoad';
      draftState.pastContentQuote = [];
    },
  },
});

export default plan2Store;
