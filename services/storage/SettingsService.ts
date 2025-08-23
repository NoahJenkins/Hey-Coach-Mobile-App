import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '@/types';

const SETTINGS_KEY = 'user_settings';

export class SettingsService {
  private defaultSettings: UserSettings = {
    id: 'default',
    weightUnit: 'lbs',
    distanceUnit: 'miles',
    autoSaveMode: true,
    confirmationLevel: 'complex',
    defaultRestTime: 90, // seconds
    soundEffects: true,
    voiceConfirmation: true,
  };

  async getSettings(): Promise<UserSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_KEY);
      if (settingsJson) {
        const settings = JSON.parse(settingsJson);
        // Merge with defaults to ensure all fields are present
        return { ...this.defaultSettings, ...settings };
      }
      return this.defaultSettings;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.defaultSettings;
    }
  }

  async saveSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  async updateSetting<K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): Promise<void> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
      throw error;
    }
  }

  async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(this.defaultSettings));
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }

  // Convenience methods for specific settings
  async getWeightUnit(): Promise<'lbs' | 'kg'> {
    const settings = await this.getSettings();
    return settings.weightUnit;
  }

  async setWeightUnit(unit: 'lbs' | 'kg'): Promise<void> {
    await this.updateSetting('weightUnit', unit);
  }

  async getDistanceUnit(): Promise<'miles' | 'km'> {
    const settings = await this.getSettings();
    return settings.distanceUnit;
  }

  async setDistanceUnit(unit: 'miles' | 'km'): Promise<void> {
    await this.updateSetting('distanceUnit', unit);
  }

  async getAutoSaveMode(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.autoSaveMode;
  }

  async setAutoSaveMode(enabled: boolean): Promise<void> {
    await this.updateSetting('autoSaveMode', enabled);
  }

  async getSoundEffects(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.soundEffects;
  }

  async setSoundEffects(enabled: boolean): Promise<void> {
    await this.updateSetting('soundEffects', enabled);
  }

  async getVoiceConfirmation(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.voiceConfirmation;
  }

  async setVoiceConfirmation(enabled: boolean): Promise<void> {
    await this.updateSetting('voiceConfirmation', enabled);
  }

  async getDefaultRestTime(): Promise<number> {
    const settings = await this.getSettings();
    return settings.defaultRestTime;
  }

  async setDefaultRestTime(seconds: number): Promise<void> {
    await this.updateSetting('defaultRestTime', seconds);
  }
}

export const settingsService = new SettingsService();