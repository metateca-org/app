/**
 * EquipeFeatures.gs — Funcionalidades autenticadas da Metateca.
 *
 * Justificam o login: usuarios autenticados registram notas sobre membros da
 * equipe e sugerem duplas de colaboracao (com base nos perfis). Toda acao
 * exige credenciais validas (loginWithPassword) e e atribuida ao usuario autor.
 */

function meta_auth_(username, password) {
  var res = loginWithPassword(username, password);
  return (res && res.success) ? res.user : null;
}

function meta_append_(sheetName, headers, obj) {
  try {
    var ss = Auth_getSpreadsheet_();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.setFrozenRows(1);
    }
    var current = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String) : [];
    if (!current.length) { sheet.getRange(1, 1, 1, headers.length).setValues([headers]); current = headers.slice(); }
    sheet.appendRow(current.map(function (h) { return obj[h] !== undefined ? obj[h] : ''; }));
  } catch (error) {
    Logger.log("Erro em meta_append_: " + error.message);
    throw error; // Re-lança para tratamento superior
  }
}

function meta_list_(sheetName) {
  var sheet = Auth_getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values[0].map(String);
  return values.slice(1).map(function (r) { var o = {}; headers.forEach(function (h, i) { o[h] = r[i]; }); return o; });
}

function meta_id_(prefix) { return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000); }

/** Funcionalidade 1 — Registrar nota sobre um membro da equipe. */
function registrarNotaEquipe(username, password, membro, nota) {
  try {
    var user = meta_auth_(username, password);
    if (!user) return { success: false, message: 'Credenciais invalidas.' };
    if (!String(membro || '').trim()) return { success: false, message: 'Informe o membro.' };
    if (!String(nota || '').trim()) return { success: false, message: 'Informe a nota.' };
    var id = meta_id_('NOTA');
    meta_append_('NotasEquipe', ['ID', 'DataHora', 'Autor', 'Membro', 'Nota'], {
      ID: id, DataHora: new Date(), Autor: user.username, Membro: membro, Nota: nota
    });
    return { success: true, id: id };
  } catch (error) {
    Logger.log("Erro em registrarNotaEquipe: " + error.message);
    throw error;
  }
}

/** Funcionalidade 2 — Sugerir dupla de colaboracao entre dois membros. */
function sugerirDuplaColaboracao(username, password, membroA, membroB, motivo) {
  try {
    var user = meta_auth_(username, password);
    if (!user) return { success: false, message: 'Credenciais invalidas.' };
    if (!String(membroA || '').trim() || !String(membroB || '').trim()) {
      return { success: false, message: 'Informe os dois membros da dupla.' };
    }
    var id = meta_id_('DUPLA');
    meta_append_('SugestoesDupla', ['ID', 'DataHora', 'Autor', 'MembroA', 'MembroB', 'Motivo', 'Status'], {
      ID: id, DataHora: new Date(), Autor: user.username, MembroA: membroA, MembroB: membroB, Motivo: motivo || '', Status: 'sugerido'
    });
    return { success: true, id: id };
  } catch (error) {
    Logger.log("Erro em sugerirDuplaColaboracao: " + error.message);
    throw error;
  }
}

function listarNotasEquipe(username, password) {
  if (!meta_auth_(username, password)) return { success: false, message: 'Credenciais invalidas.' };
  return { success: true, itens: meta_list_('NotasEquipe') };
}

function listarSugestoesDupla(username, password) {
  if (!meta_auth_(username, password)) return { success: false, message: 'Credenciais invalidas.' };
  return { success: true, itens: meta_list_('SugestoesDupla') };
}
