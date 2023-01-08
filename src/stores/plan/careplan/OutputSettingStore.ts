import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OutputSetting } from 'maps4nc-frontend-web-api/dist/lib/model';

export type OutputSettingState = {
  outputSetting?: OutputSetting;
  loadingStatus: 'NotLoad' | 'Loading' | 'Loaded' | 'Error';
  isDialogOpen: boolean;
  isDirty: boolean;
};

const initialState = (): OutputSettingState => ({
  outputSetting: undefined,
  loadingStatus: 'NotLoad',
  isDialogOpen: false,
  isDirty: false,
});

const outputSettingStore = createSlice({
  name: 'outputSetting',
  initialState: initialState(),
  reducers: {
    loading: (draftState: OutputSettingState) => {
      draftState.loadingStatus = 'Loading';
    },
    errored: (draftState: OutputSettingState) => {
      draftState.loadingStatus = 'Error';
    },
    fetchedOutputSetting: (draftState: OutputSettingState, action: PayloadAction<OutputSetting>) => {
      draftState.loadingStatus = 'Loaded';
      draftState.outputSetting = action.payload;
    },
    clearOutputSetting: (draftState: OutputSettingState) => {
      draftState.loadingStatus = 'NotLoad';
      draftState.outputSetting = undefined;
      draftState.isDialogOpen = false;
      draftState.isDirty = false;
    },
    openOutputSetting: (draftState: OutputSettingState) => {
      draftState.isDialogOpen = true;
    },
    setDirty: (draftState: OutputSettingState, action: PayloadAction<boolean>) => {
      draftState.isDirty = action.payload;
    },
  },
});

export default outputSettingStore;
