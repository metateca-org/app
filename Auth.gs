/**
 * Auth.gs — Login por usuario/senha (texto puro) para a Metateca.
 *
 * O projeto autenticava apenas pela identidade do Apps Script. Este modulo
 * adiciona um login proprio contra a aba 'Usuarios', permitindo autenticar os
 * administradores sinteticos (senha 'admin123'). Comparacao em texto puro,
 * por nome de coluna (case-insensitive), casando por username OU e-mail.
 */

/** Resolve a planilha principal (Script Property, fallback planilha ativa). */
function Auth_getSpreadsheet_() {
  try {
    var props = PropertiesService.getScriptProperties();
    var id = props.getProperty('SPREADSHEET_ID') || props.getProperty('SPREADSHEETS_ID');
    if (id) return SpreadsheetApp.openById(id);
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (error) {
    Logger.log("Erro em Auth_getSpreadsheet_: " + error.message);
    throw error;
  }
}

/**
 * @param {string} username Usuario ou e-mail.
 * @param {string} password Senha em texto puro.
 * @return {{success:boolean, user?:Object, message?:string}}
 */
function loginWithPassword(username, password) {
  try {
    try {
      var u = String(username || '').trim().toLowerCase();
      var p = String(password || '');
      if (!u || !p) return { success: false, message: 'Informe usuario e senha.' };

      var sheet = Auth_getSpreadsheet_().getSheetByName('Usuarios');
      if (!sheet || sheet.getLastRow() < 2) return { success: false, message: 'Credenciais invalidas.' };

      var values = sheet.getDataRange().getValues();
      var headers = values[0].map(function (h) { return String(h || '').trim().toLowerCase(); });
      var iUser = headers.indexOf('username');
      var iPass = headers.indexOf('password');
      var iRole = headers.indexOf('role');
      var iNome = headers.indexOf('nome');
      var iEmail = headers.indexOf('email');
      var iId = headers.indexOf('id');
      var iStatus = headers.indexOf('status');
      if (iUser < 0 || iPass < 0) return { success: false, message: 'Aba Usuarios sem colunas username/password.' };

      for (var r = 1; r < values.length; r++) {
        var row = values[r];
        var rowUser = String(row[iUser] || '').trim().toLowerCase();
        var rowEmail = iEmail >= 0 ? String(row[iEmail] || '').trim().toLowerCase() : '';
        if (rowUser !== u && rowEmail !== u) continue;
        if (String(row[iPass]) !== p) return { success: false, message: 'Credenciais invalidas.' };
        if (iStatus >= 0 && String(row[iStatus]).trim().toLowerCase() === 'inativo') {
          return { success: false, message: 'Usuario inativo.' };
        }
        return {
          success: true,
          user: {
            id: iId >= 0 ? row[iId] : rowUser,
            username: row[iUser],
            nome: iNome >= 0 ? row[iNome] : row[iUser],
            email: iEmail >= 0 ? row[iEmail] : '',
            role: iRole >= 0 ? row[iRole] : 'admin'
          }
        };
      }
      return { success: false, message: 'Credenciais invalidas.' };
    } catch (error) {
      Logger.log("Erro em loginWithPassword: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em loginWithPassword: " + error.message);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Sessoes baseadas em token — armazenadas em aba 'SessoesAuth' em vez de
// ScriptProperties para evitar poluição de configurações e permitir limpeza.
// ---------------------------------------------------------------------------

var AUTH_TOK_TTL_MS_ = 21600 * 1000; // 6 horas

/** Obtem ou cria a aba SessoesAuth para armazenar sessoes. */
function getSessoesAuthSheet_() {
  try {
    try {
      try {
        var ss = Auth_getSpreadsheet_();
        if (!ss) return null;
        var sheet = ss.getSheetByName('SessoesAuth');
        if (!sheet) {
          sheet = ss.insertSheet('SessoesAuth');
          sheet.getRange(1, 1, 1, 5).setValues([['token', 'userId', 'username', 'role', 'expiresAt']]);
        }
        return sheet;
      } catch (error) {
        Logger.log("Erro em getSessoesAuthSheet_: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em getSessoesAuthSheet_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em getSessoesAuthSheet_: " + error.message);
    throw error;
  }
}

/**
 * Valida credenciais e devolve um token unico para o cliente.
 * Armazena sessao na aba 'SessoesAuth'.
 * @return {{success:boolean, token?:string, redirectUrl?:string, message?:string}}
 */
function loginWithToken(username, password) {
  try {
    try {
      if (!String(username || '').trim() || !String(password || '')) {
        return { success: false, message: 'Informe usuario e senha.' };
      }
      var result = loginWithPassword(username, password);
      if (!result.success) return { success: false, message: 'Credenciais invalidas.' };

      var sheet = getSessoesAuthSheet_();
      if (!sheet) return { success: false, message: 'Erro ao criar sessao.' };

      var token = Utilities.getUuid().replace(/-/g, '');
      var expiresAt = new Date().getTime() + AUTH_TOK_TTL_MS_;
      var user = result.user;
      sheet.appendRow([
        token,
        String(user.id || user.username),
        String(user.username),
        String(user.role || 'USER'),
        expiresAt
      ]);

      var baseUrl = '';
      try {
        baseUrl = ScriptApp.getService().getUrl();
      } catch (e) {
        baseUrl = '';
      }

      return {
        success: true,
        token: token,
        redirectUrl: baseUrl ? baseUrl + '?page=app#tok=' + token : ''
      };
    } catch (error) {
      Logger.log("Erro em loginWithToken: " + error.message);
      throw error; // Re-lança para tratamento superior
    }
  } catch (error) {
    Logger.log("Erro em loginWithToken: " + error.message);
    throw error;
  }
}

/**
 * Verifica se o token corresponde a uma sessao valida na aba 'SessoesAuth'.
 * Deleta sessoes expiradas.
 */
function isAuthenticatedByToken(tok) {
  try {
    try {
      try {
        var token = String(tok || '').trim();
        if (!token) return false;
        var sheet = getSessoesAuthSheet_();
        if (!sheet) return false;

        var data = sheet.getDataRange().getValues();
        var now = new Date().getTime();
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]).trim() === token) {
            var userId = String(data[i][1] || '').trim();
            var expiresAt = Number(data[i][4]);
            if (!userId || !isFinite(expiresAt) || expiresAt <= now) {
              sheet.deleteRow(i + 1);
              return false;
            }
            return true;
          }
        }
        return false;
      } catch (error) {
        Logger.log("Erro em isAuthenticatedByToken: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em isAuthenticatedByToken: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em isAuthenticatedByToken: " + error.message);
    throw error;
  }
}

/**
 * Retorna o usuario logado a partir do token.
 * @param {string} tok
 * @return {{ username: string, role: string }|null}
 */
function getSessionUser(tok) {
  try {
    try {
      try {
        var token = String(tok || '').trim();
        if (!token) return null;
        var sheet = getSessoesAuthSheet_();
        if (!sheet) return null;

        var data = sheet.getDataRange().getValues();
        var now = new Date().getTime();
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]).trim() === token) {
            var userId = String(data[i][1] || '').trim();
            var expiresAt = Number(data[i][4]);
            if (!userId || !isFinite(expiresAt) || expiresAt <= now) {
              sheet.deleteRow(i + 1);
              return null;
            }
            return { userId: userId, username: data[i][2], role: data[i][3] || 'USER' };
          }
        }
        return null;
      } catch (error) {
        Logger.log("Erro em getSessionUser: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em getSessionUser: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em getSessionUser: " + error.message);
    throw error;
  }
}

/** Encerra a sessao identificada pelo token. */
function logoutWithToken(tok) {
  try {
    try {
      try {
        if (!tok) return { ok: true };
        var sheet = getSessoesAuthSheet_();
        if (!sheet) return { ok: true };

        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][0]) === String(tok)) {
            sheet.deleteRow(i + 1);
            return { ok: true };
          }
        }
        return { ok: true };
      } catch (error) {
        Logger.log("Erro em logoutWithToken: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em logoutWithToken: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em logoutWithToken: " + error.message);
    throw error;
  }
}

