import { useState } from 'react';
import { Settings, SnackbarState, getInitialSettings, createSnackbarMessage } from '../utils/settingsUtils';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(getInitialSettings());
  
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // スイッチ切り替えハンドラ
  const handleSwitchChange = (setting: keyof Settings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked
    });
    
    showSnackbar(createSnackbarMessage(setting, event.target.checked), 'success');
  };
  
  // ネストされた設定項目の切り替えハンドラ
  const handleNestedSwitchChange = (parent: keyof Settings, setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const parentSetting = settings[parent] as Record<string, boolean>;
    setSettings({
      ...settings,
      [parent]: {
        ...parentSetting,
        [setting]: event.target.checked
      }
    });
    
    showSnackbar(createSnackbarMessage(setting, event.target.checked), 'success');
  };

  // セレクト変更ハンドラ
  const handleSelectChange = (setting: keyof Settings) => (event: { target: { value: string } }) => {
    setSettings({
      ...settings,
      [setting]: event.target.value
    });
    
    showSnackbar(createSnackbarMessage(setting, event.target.value), 'success');
  };
    // スライダー変更ハンドラ
  const handleSliderChange = (setting: keyof Settings) => (_event: Event, newValue: number | number[]) => {
    setSettings({
      ...settings,
      [setting]: newValue
    });
  };
    // スライダー変更完了ハンドラ
  const handleSliderChangeCommitted = (_setting: keyof Settings, displayName: string) => (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    showSnackbar(`${displayName}を${newValue}に設定しました`, 'success');
  };

  // スナックバー表示ハンドラ
  const showSnackbar = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };
  
  // スナックバークローズハンドラ
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return {
    settings,
    snackbar,
    handleSwitchChange,
    handleNestedSwitchChange,
    handleSelectChange,
    handleSliderChange,
    handleSliderChangeCommitted,
    showSnackbar,
    handleCloseSnackbar
  };
};
