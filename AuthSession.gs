/**
 * AuthSession.gs — Sessao por token propria da Metateca.org.
 *
 * Contexto: loginWithPassword (Auth.gs) valida credenciais contra a aba
 * 'Usuarios' mas NAO estabelecia sessao — apenas devolvia o usuario. O doPost
 * (Code.gs) espelha a superficie `Api` por HTTP e ficava acionavel por qualquer
 * POST anonimo (addTeamMember, deleteMember, updateMemberProfile...).
 *
 * Este modulo adiciona um token de sessao leve, coerente com a natureza do
 * projeto (sem importar o AuthStandardService da frota): o token e emitido no
 * login e guardado em SessoesAuth (duravel, por instancia), com expiracao
 * propria. O doPost passa a exigir token valido para acoes nao-publicas.
 *
 * google.script.run continua funcionando: aquele transporte so e acionavel a
 * partir da pagina servida (mesma origem) — o vetor aberto era exclusivamente o
 * doPost HTTP, que e o que este gate fecha.
 */

var AUTH_SESS_TTL_SECONDS_ = 21600; // 6h

/**
 * Emite um token de sessao para um usuario autenticado e o persiste.
 * @param {Object} user  Objeto devolvido por loginWithPassword.
 * @return {string} token opaco (hex de 32 chars).
 */
function Auth_issueToken_(user) {
  try {
    var token = Utilities.getUuid().replace(/-/g, '');
    var session = {
      userId:   String(user && user.id != null ? user.id : (user && user.username) || ''),
      username: String(user && user.username || ''),
      role:     String(user && user.role || 'admin'),
      issuedAt: Date.now(),
      exp:      Date.now() + AUTH_SESS_TTL_SECONDS_ * 1000
    };
    Auth_saveSessionRow_(token, session);
    return token;
  } catch (error) {
    Logger.log("Erro em Auth_issueToken_: " + error.message);
    throw error;
  }
}

/**
 * Valida um token e devolve a sessao, ou null se ausente/invalido/expirado.
 * Limpa tokens expirados ao encontra-los.
 * @param {string} token
 * @return {?Object} { userId, username, role, issuedAt, exp }
 */
function Auth_verifyToken_(token) {
  try {
    try {
      var normalizedToken = String(token || '').trim();
      if (!normalizedToken) return null;
      var sheet = getSessoesAuthSheet_();
      var lastRow = sheet.getLastRow();
      if (lastRow < 2) return null;
      var values = sheet.getRange(2, 1, lastRow - 1, Math.max(sheet.getLastColumn(), 6)).getValues();
      for (var i = 0; i < values.length; i++) {
        if (String(values[i][0]).trim() !== normalizedToken) continue;
        var expiresAt = Number(values[i][4]);
        var userId = String(values[i][1] || '').trim();
        if (!userId || !isFinite(expiresAt) || expiresAt <= Date.now()) {
          sheet.deleteRow(i + 2);
          return null;
        }
        try {
          if (values[i][5]) {
            var parsed = JSON.parse(String(values[i][5]));
            var embeddedExpiry = parsed && parsed.exp != null ? Number(parsed.exp) :
              (parsed && parsed.expiresAt != null ? Number(parsed.expiresAt) : expiresAt);
            if (!parsed || Array.isArray(parsed) ||
                String(parsed.userId || '').trim() !== userId ||
                !isFinite(embeddedExpiry) || embeddedExpiry <= Date.now()) return null;
            return parsed;
          }
          return {
            userId: userId,
            username: String(values[i][2] || ''),
            role: String(values[i][3] || 'admin'),
            exp: expiresAt
          };
        } catch (e) {
          return null;
        }
      }
      return null;
    } catch (error) {
      Logger.log("Erro em Auth_verifyToken_: " + error.message);
      throw error; // Re-lança para tratamento superior
    }
  } catch (error) {
    Logger.log("Erro em Auth_verifyToken_: " + error.message);
    throw error;
  }
}

/** Revoga (logout) um token de sessao. */
function Auth_revokeToken_(token) {
  Auth_deleteSessionRow_(token);
  return { success: true };
}

function Auth_saveSessionRow_(token, session) {
  try {
    try {
      try {
        getSessoesAuthSheet_().appendRow([
          token,
          session.userId,
          session.username,
          session.role,
          session.exp,
          JSON.stringify(session)
        ]);
      } catch (error) {
        Logger.log("Erro em Auth_saveSessionRow_: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em Auth_saveSessionRow_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em Auth_saveSessionRow_: " + error.message);
    throw error;
  }
}

function Auth_deleteSessionRow_(token) {
  try {
    try {
      try {
        if (!token) return;
        var sheet = getSessoesAuthSheet_();
        var lastRow = sheet.getLastRow();
        if (lastRow < 2) return;
        var values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = values.length - 1; i >= 0; i--) {
          if (String(values[i][0]) === String(token)) sheet.deleteRow(i + 2);
        }
      } catch (error) {
        Logger.log("Erro em Auth_deleteSessionRow_: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em Auth_deleteSessionRow_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em Auth_deleteSessionRow_: " + error.message);
    throw error;
  }
}
