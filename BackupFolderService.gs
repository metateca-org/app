/**
 * BackupFolderService.gs - Backups restauraveis na pasta BACKUP_FOLDER_ID.
 */

function createConfiguredSpreadsheetBackup(spreadsheetId, prefix) {
  try {
    var ssId = spreadsheetId || SpreadsheetApp.getActiveSpreadsheet().getId();
    var sourceFile = DriveApp.getFileById(ssId);
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
    var copy = sourceFile.makeCopy((prefix || 'Spreadsheet_Backup') + '_' + timestamp, getConfiguredBackupFolder());
    return { ok: true, id: copy.getId(), name: copy.getName(), url: copy.getUrl(), folderId: getConfiguredBackupFolderId(), generatedAt: new Date().toISOString() };
  } catch (error) {
    Logger.log("Erro em createConfiguredSpreadsheetBackup: " + error.message);
    throw error;
  }
}

function saveJsonSnapshotToBackupFolder(namePrefix, payload) {
  try {
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
    return createFileInConfiguredBackupFolder((namePrefix || 'snapshot') + '_' + timestamp + '.json', JSON.stringify(payload || {}, null, 2), MimeType.PLAIN_TEXT);
  } catch (error) {
    Logger.log("Erro em saveJsonSnapshotToBackupFolder: " + error.message);
    throw error;
  }
}

function listConfiguredBackups(limit) {
  var files = getConfiguredBackupFolder().getFiles();
  var rows = [];
  var max = Number(limit || 50);
  while (files.hasNext() && rows.length < max) {
    var file = files.next();
    rows.push({ id: file.getId(), name: file.getName(), url: file.getUrl(), createdAt: file.getDateCreated(), updatedAt: file.getLastUpdated() });
  }
  return { ok: true, backups: rows, generatedAt: new Date().toISOString() };
}
