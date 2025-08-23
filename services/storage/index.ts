export { DatabaseService, databaseService } from './DatabaseService';
export { SettingsService, settingsService } from './SettingsService';

// Initialize database when the module is imported
import { databaseService } from './DatabaseService';
import { settingsService } from './SettingsService';

// Auto-initialize database
databaseService.initialize().catch(error => {
  console.error('Failed to initialize database:', error);
});

export { databaseService as db, settingsService as settings };