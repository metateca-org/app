/**
 * AuthHelpers.gs — Rotinas Reutilizáveis De Autenticação (Prompt 18)
 *
 * Implementa 11 rotinas padrão de autenticação baseadas em token para a frota.
 * Todas as rotinas são idempotentes e seguem o padrão: token na aba SessoesAuth,
 * nunca em cache de usuário, e nunca em propriedades específicas de usuário.
 *
 * Este arquivo é parte da padronização de autenticação em toda a frota.
 */

// ============================================================================
// Configuração
// ============================================================================

const META_ORG_AUTH_CONFIG_ = {
  SESSION_TTL_SECONDS: 21600, // 6 horas
  TOKEN_LENGTH: 32
};

function authHelpersSessionSheet_() {
  try {
    if (typeof getSessoesAuthSheet_ === 'function') return getSessoesAuthSheet_();
    const ss = getBoundSpreadsheet_();
    let sheet = ss.getSheetByName('SessoesAuth');
    if (!sheet) {
      sheet = ss.insertSheet('SessoesAuth');
      sheet.getRange(1, 1, 1, 6).setValues([['token', 'userId', 'username', 'role', 'expiresAt', 'sessionJson']]);
    }
    return sheet;
  } catch (error) {
    Logger.log("Erro em authHelpersSessionSheet_: " + error.message);
    throw error; // Re-lança para tratamento superior
  }
}

function authHelpersSaveSession_(token, session) {
  try {
    try {
      authHelpersSessionSheet_().appendRow([
        token,
        session.userId,
        session.username,
        session.role,
        session.expiresAt,
        JSON.stringify(session)
      ]);
    } catch (error) {
      Logger.log("Erro em authHelpersSaveSession_: " + error.message);
      throw error; // Re-lança para tratamento superior
    }
  } catch (error) {
    Logger.log("Erro em authHelpersSaveSession_: " + error.message);
    throw error;
  }
}

function authHelpersReadSession_(tok) {
  try {
    try {
      try {
        const normalizedToken = String(tok || '').trim();
        if (!normalizedToken) return null;
        const sheet = authHelpersSessionSheet_();
        const lastRow = sheet.getLastRow();
        if (lastRow < 2) return null;
        const values = sheet.getRange(2, 1, lastRow - 1, Math.max(sheet.getLastColumn(), 6)).getValues();
        for (let i = 0; i < values.length; i++) {
          if (String(values[i][0]).trim() !== normalizedToken) continue;
          const expiresAt = Number(values[i][4]);
          const userId = String(values[i][1] || '').trim();
          if (!userId || !isFinite(expiresAt) || expiresAt <= Date.now()) {
            sheet.deleteRow(i + 2);
            return null;
          }
          try {
            const session = values[i][5] ? JSON.parse(String(values[i][5])) : {
              userId: userId,
              username: values[i][2],
              role: values[i][3],
              expiresAt: expiresAt
            };
            if (!session || Array.isArray(session) ||
                typeof session.userId !== 'string' || !session.userId.trim() ||
                session.userId.trim() !== userId ||
                (session.expiresAt != null &&
                 (typeof session.expiresAt !== 'number' || !isFinite(session.expiresAt) ||
                  session.expiresAt <= Date.now()))) return null;
            return session;
          } catch (e) {
            return null;
          }
        }
        return null;
      } catch (error) {
        Logger.log("Erro em authHelpersReadSession_: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em authHelpersReadSession_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em authHelpersReadSession_: " + error.message);
    throw error;
  }
}

function authHelpersDeleteSession_(tok) {
  try {
    try {
      try {
        if (!tok) return;
        const sheet = authHelpersSessionSheet_();
        const lastRow = sheet.getLastRow();
        if (lastRow < 2) return;
        const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (let i = values.length - 1; i >= 0; i--) {
          if (String(values[i][0]) === String(tok)) sheet.deleteRow(i + 2);
        }
      } catch (error) {
        Logger.log("Erro em authHelpersDeleteSession_: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em authHelpersDeleteSession_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em authHelpersDeleteSession_: " + error.message);
    throw error;
  }
}

// ============================================================================
// Rotina 1: ensureUsuariosSheet_
// ============================================================================

/**
 * Garante que a aba Usuarios existe com os cabecalhos corretos.
 * Idempotente: nao sobrescreve se ja existir.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function ensureUsuariosSheet_() {
  try {
    try {
      const ss = getBoundSpreadsheet_();
      let sheet = ss.getSheetByName('Usuarios');
  
      if (!sheet) {
        sheet = ss.insertSheet('Usuarios');
        sheet.getRange(1, 1, 1, 8).setValues([
          ['ID', 'Username', 'Password', 'PasswordHash', 'Role', 'Nome', 'Email', 'Status']
        ]);
        sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
      }
  
      return sheet;
    } catch (error) {
      Logger.log("Erro em ensureUsuariosSheet_: " + error.message);
      throw error; // Re-lança para tratamento superior
    }
  } catch (error) {
    Logger.log("Erro em ensureUsuariosSheet_: " + error.message);
    throw error;
  }
}

// ============================================================================
// Rotina 2: seedSyntheticAdminUsers_
// ============================================================================

/**
 * Cria admins sinteticos admin01 a admin15, senha admin123.
 * Idempotente: nao duplica usuarios existentes por ID ou username.
 */
function seedSyntheticAdminUsers_() {
  try {
    try {
      try {
        const sheet = ensureUsuariosSheet_();
        const data = sheet.getDataRange().getValues();
        const existingUsernames = data.slice(1).map(row => 
          String(row[1]).toLowerCase()
        );
  
        const toAdd = [];
        for (let i = 1; i <= 15; i++) {
          const username = `admin${String(i).padStart(2, '0')}`;
          if (!existingUsernames.includes(username)) {
            toAdd.push([
              Utilities.getUuid(),
              username,
              'admin123',
              '',
              'Admin',
              `Administrador ${i}`,
              `${username}@synthetic.local`,
              'Active'
            ]);
          }
        }
  
        if (toAdd.length > 0) {
          sheet.getRange(sheet.getLastRow() + 1, 1, toAdd.length, 8).setValues(toAdd);
        }
  
        return { added: toAdd.length, total: 15 };
      } catch (error) {
        Logger.log("Erro em seedSyntheticAdminUsers_: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em seedSyntheticAdminUsers_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em seedSyntheticAdminUsers_: " + error.message);
    throw error;
  }
}

// ============================================================================
// Rotina 3: readUsuariosRows_
// ============================================================================

/**
 * Le cabecalhos e linhas da aba real de usuarios.
 * @returns {{headers: string[], rows: any[][]}}
 */
function readUsuariosRows_() {
  try {
    try {
      const sheet = ensureUsuariosSheet_();
      const data = sheet.getDataRange().getValues();
  
      return {
        headers: data[0],
        rows: data.slice(1)
      };
    } catch (error) {
      Logger.log("Erro em readUsuariosRows_: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em readUsuariosRows_: " + error.message);
    throw error;
  }
}

// ============================================================================
// Rotina 4: findPlaintextUser_
// ============================================================================

/**
 * Encontra usuario por username, normalizado case-insensitive.
 * @param {string} username
 * @returns {?{id: string, username: string, password: string, role: string, nome: string, email: string, active: boolean}}
 */
function findPlaintextUser_(username) {
  try {
    const normalized = String(username).toLowerCase().trim();
    const { headers, rows } = readUsuariosRows_();
  
    const headerMap = {};
    headers.forEach((h, i) => {
      headerMap[String(h).toLowerCase().trim()] = i;
    });
  
    const iId = headerMap['id'];
    const iUser = headerMap['username'];
    const iPass = headerMap['password'];
    const iRole = headerMap['role'];
    const iNome = headerMap['nome'];
    const iEmail = headerMap['email'];
    const iStatus = headerMap['status'];
  
    for (const row of rows) {
      if (String(row[iUser]).toLowerCase().trim() === normalized) {
        const status = iStatus !== undefined ? String(row[iStatus]).toLowerCase() : 'active';
      
        return {
          id: String(row[iId] || row[iUser]),
          username: String(row[iUser]),
          password: String(row[iPass] || ''),
          role: String(row[iRole] || 'Admin'),
          nome: iNome !== undefined ? String(row[iNome]) : String(row[iUser]),
          email: iEmail !== undefined ? String(row[iEmail]) : '',
          active: status === 'active' || status === 'ativo' || status === ''
        };
      }
    }
  
    return null;
  } catch (error) {
    Logger.log("Erro em findPlaintextUser_: " + error.message);
    throw error;
  }
}

// ============================================================================
// Rotina 5: loginWithToken
// ============================================================================

/**
 * Valida senha texto plano, cria token opaco e retorna envelope padrao.
 * @param {string} username
 * @param {string} password
 * @returns {{success: boolean, token?: string, user?: Object, redirectUrl?: string, message: string}}
 */
function loginWithToken(username, password) {
  try {
    try {
      if (!username || username.trim().length === 0) {
        return { success: false, message: 'Usuário não pode estar vazio.' };
      }
      if (!password || password.length === 0) {
        return { success: false, message: 'Senha não pode estar vazia.' };
      }
    
      const user = findPlaintextUser_(username);
      if (!user) {
        return { success: false, message: 'Credenciais inválidas.' };
      }
    
      if (!user.active) {
        return { success: false, message: 'Usuário inativo.' };
      }
    
      if (user.password !== password) {
        return { success: false, message: 'Credenciais inválidas.' };
      }
    
      const token = Utilities.getUuid().replace(/-/g, '');
    
      const session = {
        userId: user.id,
        username: user.username,
        role: user.role,
        nome: user.nome,
        email: user.email,
        issuedAt: Date.now(),
        expiresAt: Date.now() + (META_ORG_AUTH_CONFIG_.SESSION_TTL_SECONDS * 1000)
      };
    
      authHelpersSaveSession_(token, session);
    
      return {
        success: true,
        token: token,
        user: { 
          id: user.id, 
          username: user.username, 
          nome: user.nome,
          email: user.email,
          role: user.role
        },
        redirectUrl: ScriptApp.getService().getUrl() + '?page=app#tok=' + encodeURIComponent(token),
        message: 'Login realizado com sucesso.'
      };
    
    } catch (error) {
      return { success: false, message: String(error.message || error) };
    }
  } catch (error) {
    Logger.log("Erro em loginWithToken: " + error.message);
    throw error;
  }
}

// ============================================================================
// Rotina 6: isAuthenticatedByToken
// ============================================================================

/**
 * Valida token em SessoesAuth e remove sessoes vencidas.
 * @param {string} tok
 * @returns {boolean}
 */
function isAuthenticatedByToken(tok) {
  if (!tok) return false;
  
  return authHelpersReadSession_(tok) !== null;
}

// ============================================================================
// Rotina 7: getSessionUser
// ============================================================================

/**
 * Retorna principal publiko da sessao (sem senha).
 * @param {string} tok
 * @returns {?{userId: string, username: string, role: string, nome: string, email: string}}
 */
function getSessionUser(tok) {
  if (!tok) return null;
  
  const session = authHelpersReadSession_(tok);
  if (!session) return null;
  return {
    userId: session.userId,
    username: session.username,
    role: session.role,
    nome: session.nome || session.username,
    email: session.email || ''
  };
}

// ============================================================================
// Rotina 8: logoutWithToken
// ============================================================================

/**
 * Remove sessao por token.
 * @param {string} tok
 * @returns {{success: boolean, message: string}}
 */
function logoutWithToken(tok) {
  authHelpersDeleteSession_(tok);
  
  return { success: true, message: 'Sessão encerrada.' };
}

// ============================================================================
// Rotina 9: buildAuthenticatedRedirectUrl_
// ============================================================================

/**
 * Monta URL absoluta com token na query string.
 * @param {string} tok
 * @returns {string}
 */
function buildAuthenticatedRedirectUrl_(tok) {
  try {
    return ScriptApp.getService().getUrl() + '?page=app#tok=' + encodeURIComponent(tok);
  } catch (error) {
    Logger.log("Erro em buildAuthenticatedRedirectUrl_: " + error.message);
    throw error;
  }
}

// ============================================================================
// Rotina 10: resolveAuthTokenFromPayload_
// ============================================================================

/**
 * Aceita string, {_authToken} ou {tok}.
 * @param {string|Object} payloadOrToken
 * @returns {?string}
 */
function resolveAuthTokenFromPayload_(payloadOrToken) {
  if (typeof payloadOrToken === 'string') {
    return payloadOrToken || null;
  }
  
  if (typeof payloadOrToken === 'object' && payloadOrToken !== null) {
    return payloadOrToken._authToken || payloadOrToken.tok || null;
  }
  
  return null;
}

// ============================================================================
// Rotina 11: requireAuthenticatedPrincipal_
// ============================================================================

/**
 * Resolve sessao e falha com erro normalizado se ausente.
 * @param {string|Object} payloadOrToken
 * @returns {{userId: string, username: string, role: string, nome: string, email: string}}
 * @throws {Error} Quando sessao nao existe ou expirou
 */
function requireAuthenticatedPrincipal_(payloadOrToken) {
  const token = resolveAuthTokenFromPayload_(payloadOrToken);
  
  if (!token) {
    throw new Error('Sua sessão terminou. Entre novamente.');
  }
  
  const session = getSessionUser(token);
  
  if (!session) {
    throw new Error('Sua sessão terminou. Entre novamente.');
  }
  
  return session;
}
