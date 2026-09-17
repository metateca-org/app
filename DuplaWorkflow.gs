/**
 * DuplaWorkflow.gs — Workflow de aprovacao (admin) da Metateca.
 *
 * Administradores listam sugestoes de dupla de colaboracao pendentes e aprovam/
 * rejeitam, registrando revisor e data. Exige login com papel 'admin'. Opera
 * sobre a aba 'SugestoesDupla'.
 */

function metawf_admin_(username, password) {
  try {
    var res = loginWithPassword(username, password);
    if (!res || !res.success || !res.user) return null;
    return String(res.user.role || '').toLowerCase() === 'admin' ? res.user : null;
  } catch (error) {
    Logger.log("Erro em metawf_admin_: " + error.message);
    throw error;
  }
}

function metawf_update_(id, status, revisor, obs) {
  try {
    var sheet = Auth_getSpreadsheet_().getSheetByName('SugestoesDupla');
    if (!sheet || sheet.getLastRow() < 2) return { success: false, message: 'Nenhum registro.' };
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
    ['Revisor', 'RevisadoEm', 'ObsRevisao'].forEach(function (h) {
      if (headers.indexOf(h) === -1) { sheet.getRange(1, headers.length + 1).setValue(h); headers.push(h); }
    });
    var idCol = headers.indexOf('ID'), stCol = headers.indexOf('Status');
    var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
    for (var i = 0; i < values.length; i++) {
      if (String(values[i][idCol]) === String(id)) {
        var row = i + 2;
        sheet.getRange(row, stCol + 1).setValue(status);
        sheet.getRange(row, headers.indexOf('Revisor') + 1).setValue(revisor);
        sheet.getRange(row, headers.indexOf('RevisadoEm') + 1).setValue(new Date());
        sheet.getRange(row, headers.indexOf('ObsRevisao') + 1).setValue(obs || '');
        return { success: true, id: id, status: status };
      }
    }
    return { success: false, message: 'ID nao encontrado: ' + id };
  } catch (error) {
    Logger.log("Erro em metawf_update_: " + error.message);
    throw error; // Re-lança para tratamento superior
  }
}

function metawf_list_(statusFiltro) {
  try {
    try {
      var sheet = Auth_getSpreadsheet_().getSheetByName('SugestoesDupla');
      if (!sheet || sheet.getLastRow() < 2) return [];
      var values = sheet.getDataRange().getValues();
      var headers = values[0].map(String);
      return values.slice(1).map(function (r) { var o = {}; headers.forEach(function (h, i) { o[h] = r[i]; }); return o; })
        .filter(function (o) { return !statusFiltro || String(o.Status || '').toLowerCase() === statusFiltro; });
    } catch (error) {
      Logger.log("Erro em metawf_list_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em metawf_list_: " + error.message);
    throw error;
  }
}

function listarDuplasPendentes(username, password) {
  if (!metawf_admin_(username, password)) return { success: false, message: 'Acesso restrito a administradores.' };
  return { success: true, itens: metawf_list_('sugerido') };
}

function aprovarDupla(username, password, id, observacao) {
  try {
    var admin = metawf_admin_(username, password);
    if (!admin) return { success: false, message: 'Acesso restrito a administradores.' };
    if (!String(id || '').trim()) return { success: false, message: 'Informe o ID.' };
    return metawf_update_(id, 'aprovado', admin.username, observacao);
  } catch (error) {
    Logger.log("Erro em aprovarDupla: " + error.message);
    throw error;
  }
}

function rejeitarDupla(username, password, id, motivo) {
  try {
    var admin = metawf_admin_(username, password);
    if (!admin) return { success: false, message: 'Acesso restrito a administradores.' };
    if (!String(id || '').trim()) return { success: false, message: 'Informe o ID.' };
    if (!String(motivo || '').trim()) return { success: false, message: 'Informe o motivo da rejeicao.' };
    return metawf_update_(id, 'rejeitado', admin.username, motivo);
  } catch (error) {
    Logger.log("Erro em rejeitarDupla: " + error.message);
    throw error;
  }
}
