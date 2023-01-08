import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlanRiyoushaKihonInfo } from 'maps4nc-frontend-web-api/lib/model';

export type KihonState = {
  planRiyoushaKihonInfo?: PlanRiyoushaKihonInfo;
  loadingStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  isDirty: boolean;
};

const initialState = (): KihonState => ({
  planRiyoushaKihonInfo: undefined,
  loadingStatus: 'NotLoad',
  isDirty: false,
});

const careplanKihonStore = createSlice({
  name: 'CareplanKihonStore',
  initialState: initialState(),
  reducers: {
    loading: (draftState: KihonState) => {
      draftState.loadingStatus = 'Loading';
    },
    errored: (draftState: KihonState) => {
      draftState.loadingStatus = 'Error';
    },
    fetchCarePlanKihon: (draftState: KihonState, action: PayloadAction<any>) => {
      draftState.planRiyoushaKihonInfo = action.payload;
      draftState.loadingStatus = 'Loaded';
    },
    clearCarePlanKihon: (draftState: KihonState) => {
      draftState.planRiyoushaKihonInfo = undefined;
      draftState.loadingStatus = 'NotLoad';
      draftState.isDirty = false;
    },
    setDirty: (draftState: KihonState, action: PayloadAction<boolean>) => {
      draftState.isDirty = action.payload;
    },
  },
});

export default careplanKihonStore;
