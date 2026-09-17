/**
 * DriveArtifactService.gs - Artefatos exportaveis da Metateca.
 */

function exportMetatecaTeamDataToDrive() {
  try {
    var result = AdminFunctions.exportTeamData();
    if (!result || !result.success) return result;
    return createFileInConfiguredOutputFolder('metateca_team_export_' + Date.now() + '.json', JSON.stringify(result.data, null, 2), MimeType.PLAIN_TEXT);
  } catch (error) {
    Logger.log("Erro em exportMetatecaTeamDataToDrive: " + error.message);
    throw error;
  }
}

function exportMetatecaSystemReportToDrive() {
  try {
    var result = AdminFunctions.generateSystemReport();
    if (!result || !result.success) return result;
    return createFileInConfiguredOutputFolder('metateca_system_report_' + Date.now() + '.json', JSON.stringify(result.data, null, 2), MimeType.PLAIN_TEXT);
  } catch (error) {
    Logger.log("Erro em exportMetatecaSystemReportToDrive: " + error.message);
    throw error;
  }
}

function backupMetatecaWorkspaceSnapshot() {
  return saveJsonSnapshotToBackupFolder('metateca_workspace', {
    team: AdminFunctions.exportTeamData(),
    report: AdminFunctions.generateSystemReport()
  });
}
