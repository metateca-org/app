/**
 * CollaborationWorkflow.gs
 *
 * Fluxo autoritativo de formacao de duplas:
 * membro autenticado propoe dois participantes canonicos, um administrador
 * revisa uma unica vez e o historico permanece atribuivel.
 */
var COLLABORATION_WORKFLOW_SHEET_ = 'PropostasColaboracao';
var COLLABORATION_WORKFLOW_HEADERS_ = [
  'ID', 'CriadoEm', 'Autor', 'MembroAId', 'MembroANome', 'MembroBId',
  'MembroBNome', 'Justificativa', 'Status', 'Revisor', 'RevisadoEm', 'NotaRevisao'
];

function collaborationSession_(token) {
  var session = Auth_verifyToken_(String(token || ''));
  return session && session.username ? session : null;
}

function collaborationText_(value, maxLength) {
  return String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function collaborationMembers_() {
  var result = TeamMemberService.getAllMembers();
  if (!result || !result.success || !Array.isArray(result.data)) {
    throw new Error('Não foi possível carregar os membros. Tente novamente.');
  }
  return result.data;
}

function collaborationFindMember_(identifier) {
  var needle = collaborationText_(identifier, 160).toLowerCase();
  if (!needle) return null;
  var matches = collaborationMembers_().filter(function(member) {
    return String(member.email || '').toLowerCase() === needle ||
      String(member.name || '').toLowerCase() === needle;
  });
  return matches.length === 1 ? matches[0] : null;
}

function collaborationSheet_() {
  var ss = Auth_getSpreadsheet_();
  var sheet = ss.getSheetByName(COLLABORATION_WORKFLOW_SHEET_);
  if (!sheet) {
    sheet = ss.insertSheet(COLLABORATION_WORKFLOW_SHEET_);
    sheet.getRange(1, 1, 1, COLLABORATION_WORKFLOW_HEADERS_.length)
      .setValues([COLLABORATION_WORKFLOW_HEADERS_]);
    sheet.setFrozenRows(1);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, COLLABORATION_WORKFLOW_HEADERS_.length)
      .setValues([COLLABORATION_WORKFLOW_HEADERS_]);
    sheet.setFrozenRows(1);
  }
  var headers = sheet.getRange(1, 1, 1, COLLABORATION_WORKFLOW_HEADERS_.length).getValues()[0];
  if (COLLABORATION_WORKFLOW_HEADERS_.some(function(header, index) { return headers[index] !== header; })) {
    throw new Error('Cabeçalhos de PropostasColaboracao incompatíveis. Revise a ordem das colunas antes de gravar.');
  }
  return sheet;
}

function collaborationRows_() {
  var sheet = collaborationSheet_();
  if (sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values[0].map(String);
  return values.slice(1).map(function(row, index) {
    var item = { _row: index + 2 };
    headers.forEach(function(header, column) { item[header] = row[column]; });
    return item;
  });
}

function getCollaborationCandidates(token) {
  if (!collaborationSession_(token)) {
    return { success: false, code: 'UNAUTHORIZED', message: 'Sessao invalida ou expirada.' };
  }
  return {
    success: true,
    data: collaborationMembers_().map(function(member) {
      return { id: String(member.email || member.name || ''), name: String(member.name || member.email || '') };
    }).filter(function(member) { return member.id && member.name; })
  };
}

function proposeCollaboration(token, memberAId, memberBId, rationale) {
  var session = collaborationSession_(token);
  if (!session) {
    return { success: false, code: 'UNAUTHORIZED', message: 'Sessao invalida ou expirada.' };
  }
  var memberA = collaborationFindMember_(memberAId);
  var memberB = collaborationFindMember_(memberBId);
  if (!memberA || !memberB) {
    return { success: false, code: 'MEMBER_NOT_FOUND', message: 'Escolha dois membros cadastrados.' };
  }
  var canonicalA = String(memberA.email || memberA.name || '').toLowerCase();
  var canonicalB = String(memberB.email || memberB.name || '').toLowerCase();
  if (canonicalA === canonicalB) {
    return { success: false, code: 'SAME_MEMBER', message: 'A dupla precisa ter dois membros diferentes.' };
  }
  var normalizedRationale = collaborationText_(rationale, 500);
  if (normalizedRationale.length < 20) {
    return { success: false, code: 'RATIONALE_REQUIRED', message: 'Explique a complementaridade em pelo menos 20 caracteres.' };
  }

  var id = 'COL-' + Utilities.getUuid().replace(/-/g, '').slice(0, 16).toUpperCase();
  var record = {
    ID: id,
    CriadoEm: new Date(),
    Autor: session.username,
    MembroAId: String(memberA.email || memberA.name || ''),
    MembroANome: String(memberA.name || memberA.email || ''),
    MembroBId: String(memberB.email || memberB.name || ''),
    MembroBNome: String(memberB.name || memberB.email || ''),
    Justificativa: normalizedRationale,
    Status: 'pendente',
    Revisor: '',
    RevisadoEm: '',
    NotaRevisao: ''
  };
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return { success: false, code: 'BUSY', message: 'Outra gravação está em andamento. Tente novamente.' };
  try {
    // Reenvio da mesma proposta pendente, inclusive com a dupla invertida.
    var existing = collaborationRows_().filter(function(item) {
      var a = String(item.MembroAId || '').toLowerCase();
      var b = String(item.MembroBId || '').toLowerCase();
      return item.Autor === session.username && item.Status === 'pendente' &&
        item.Justificativa === normalizedRationale &&
        ((a === canonicalA && b === canonicalB) || (a === canonicalB && b === canonicalA));
    })[0];
    if (existing) return { success: true, data: { id: existing.ID, status: 'pendente', reused: true } };
    collaborationSheet_().appendRow(COLLABORATION_WORKFLOW_HEADERS_.map(function(header) {
      return record[header];
    }));
    return { success: true, data: { id: id, status: 'pendente', reused: false } };
  } finally {
    lock.releaseLock();
  }
}

function listCollaborations(token, status) {
  var session = collaborationSession_(token);
  if (!session) {
    return { success: false, code: 'UNAUTHORIZED', message: 'Sessao invalida ou expirada.' };
  }
  var normalizedStatus = collaborationText_(status, 20).toLowerCase();
  var isAdmin = String(session.role || '').toLowerCase() === 'admin';
  var items = collaborationRows_().filter(function(item) {
    var visible = isAdmin || String(item.Autor || '') === String(session.username || '');
    return visible && (!normalizedStatus || String(item.Status || '').toLowerCase() === normalizedStatus);
  }).map(function(item) {
    delete item._row;
    ['CriadoEm', 'RevisadoEm'].forEach(function(key) {
      if (Object.prototype.toString.call(item[key]) === '[object Date]') {
        item[key] = isFinite(item[key].getTime()) ? item[key].toISOString() : '';
      }
    });
    return item;
  });
  return { success: true, data: items };
}

function reviewCollaboration(token, proposalId, decision, note) {
  var session = collaborationSession_(token);
  if (!session || String(session.role || '').toLowerCase() !== 'admin') {
    return { success: false, code: 'FORBIDDEN', message: 'Revisao restrita a administradores.' };
  }
  var id = collaborationText_(proposalId, 80);
  var normalizedDecision = collaborationText_(decision, 20).toLowerCase();
  var normalizedNote = collaborationText_(note, 500);
  if (normalizedDecision !== 'aprovada' && normalizedDecision !== 'rejeitada') {
    return { success: false, code: 'INVALID_DECISION', message: 'Decisao deve ser aprovada ou rejeitada.' };
  }
  if (normalizedDecision === 'rejeitada' && normalizedNote.length < 10) {
    return { success: false, code: 'REJECTION_NOTE_REQUIRED', message: 'Explique a rejeicao em pelo menos 10 caracteres.' };
  }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return { success: false, code: 'BUSY', message: 'Outra revisao esta em andamento. Tente novamente.' };
  }
  try {
    var sheet = collaborationSheet_();
    var rows = collaborationRows_();
    var item = rows.filter(function(row) { return String(row.ID || '') === id; })[0];
    if (!item) return { success: false, code: 'NOT_FOUND', message: 'Proposta nao encontrada.' };
    if (String(item.Status || '').toLowerCase() !== 'pendente') {
      return { success: false, code: 'ALREADY_REVIEWED', message: 'Esta proposta ja foi revisada.' };
    }
    var statusColumn = COLLABORATION_WORKFLOW_HEADERS_.indexOf('Status') + 1;
    // Uma única operação evita status final sem revisor, data ou justificativa.
    sheet.getRange(item._row, statusColumn, 1, 4)
      .setValues([[normalizedDecision, session.username, new Date(), normalizedNote]]);
    return { success: true, data: { id: id, status: normalizedDecision, reviewer: session.username } };
  } finally {
    lock.releaseLock();
  }
}
