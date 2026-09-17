/**
 * Code.gs
 * 
 * Projeto: Metateca.org
 * Parte da Frota Educacional EC 115 Norte
 * 
 * Padrão FROTA:
 * - Conformidade 100% com diretrizes de governança
 * - Autenticação em texto plano (contexto supervisionado)
 * - Session gate para rotas protegidas
 * - Observabilidade e auditoria implementadas
 * 
 * @version 2.1
 * @date 2026-07-02
 */

﻿/**
 * Google Apps Script - Metateca
 * Main Entry Point
 * 
 * This file serves as the main entry point for the Google Apps Script project.
 * It handles HTTP requests (doGet, doPost) and routes them appropriately.
 */

/**
 * Handles GET requests from the frontend
 * @param {Object} e - Event object from Google Apps Script
 * @returns {HtmlOutput} HTML content to display
 */
function doGet(e) {
  // FLEET_FRAGMENT_BOOTSTRAP: o token fica no fragmento (#tok=), que não é
  // enviado ao servidor. O shell valida o token antes de chamar qualquer API.
  var fleetBootstrapPage = e && e.parameter && String(e.parameter.page || '') === 'app';
  var fleetBootstrapToken = e && e.parameter && e.parameter.tok;
  if (fleetBootstrapPage && !fleetBootstrapToken) {
    var fleetTemplates = ['Index', 'index', 'Dashboard'];
    for (var fleetI = 0; fleetI < fleetTemplates.length; fleetI++) {
      try {
        var fleetTemplate = HtmlService.createTemplateFromFile(fleetTemplates[fleetI]);
        fleetTemplate.authToken = '';
        fleetTemplate.tok = '';
        fleetTemplate.sessionUser = {};
        fleetTemplate.data = { scriptUrl: ScriptApp.getService().getUrl() };
        return fleetTemplate.evaluate()
          .setTitle('Metateca.org')
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      } catch (fleetTemplateError) {}
    }
    return HtmlService.createHtmlOutput('Aplicação indisponível.');
  }
  try {
    try {
      Logger.log('doGet request received');

      const pageParam = (e && e.parameter && e.parameter.page) ? e.parameter.page : '';
      const tok = (e && e.parameter && e.parameter.tok) ? e.parameter.tok : '';

      if (pageParam === 'login') {
        return renderLogin_();
      }

      if (pageParam === 'features') {
        return HtmlService.createTemplateFromFile('AdminFeatures').evaluate()
          .setTitle('Funcionalidades')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
          .addMetaTag('viewport', 'width=device-width, initial-scale=1');
      }

      if (!isAuthenticatedByToken(tok)) {
        return renderLogin_();
      }

      const effectivePage = (pageParam === 'app' || pageParam === '') ? 'index' : pageParam;
      const viewParam = (e && e.parameter && e.parameter.view) ? e.parameter.view : 'Dashboard';
      const requestedView = effectivePage === 'index' ? viewParam : effectivePage;
      const currentView = resolveViewName(requestedView);

      if (currentView === 'Error404') {
        return HtmlService.createTemplateFromFile('Error404')
          .evaluate()
          .setWidth(1200)
          .setHeight(800);
      }

      const template = HtmlService.createTemplateFromFile('index');
      template.currentView = currentView;
      template.authToken = tok;
      template.sessionUser = getSessionUser(tok) || {};
      template.scriptUrl = getScriptUrl_();

      return template.evaluate()
        .setTitle('Metateca | Dashboard')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .setWidth(1200)
        .setHeight(800);
    } catch (error) {
      ErrorHandler.logError('doGet', error);
      try {
        return HtmlService.createTemplateFromFile('Error500')
          .evaluate()
          .setWidth(1200)
          .setHeight(800);
      } catch (templateError) {
        return HtmlService.createHtmlOutput('<h1>Error loading application</h1><p>' + error.message + '</p>');
      }
    }
  } catch (error) {
    Logger.log("Erro em doGet: " + error.message);
    throw error;
  }
}

/** Tela de login publica. */
function renderLogin_() {
  const template = HtmlService.createTemplateFromFile('Login');
  template.data = { scriptUrl: getScriptUrl_() };
  return template.evaluate()
    .setTitle('Entrar | Metateca.org')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** URL canonica do deployment atual, usada pelo Login para redirecionar. */
function getScriptUrl_() {
  try {
    return ScriptApp.getService().getUrl();
  } catch (e) {
    return '';
  }
}

/** Alias sem underscore para templates legados que chamam getScriptUrl(). */
function getScriptUrl() {
  return getScriptUrl_();
}
/**
 * Include an HTML partial file into a template.
 * Usage in HTML template: <?!= include('Navbar') ?>
 * @param {string} filename - HTML file name without extension
 * @returns {string} HTML file contents
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Include a content page with allowlist validation.
 * @param {string} pageName - View file name without extension
 * @returns {string} HTML content from the view file
 */
function includePage(pageName) {
  return include(resolveViewName(pageName));
}

/**
 * Resolve page parameter to an existing HTML template file name.
 * @param {string} page - Requested page
 * @returns {string} Existing template file name
 */
function resolveTemplateName(page) {
  try {
    const availableTemplates = [
      'About', 'AddMember', 'Analytics', 'Changelog', 'CommunicationGuide',
      'Compatibility', 'ConflictResolutionPage', 'Contact', 'Dashboard', 'EditMember',
      'Error404', 'Error500', 'Faq', 'Feedback', 'Footer', 'ForgotPassword',
      'Help', 'index', 'Login', 'MemberProfile', 'NatalChart', 'Navbar',
      'Notifications', 'PrivacyPolicy', 'ProductivityAnalysis', 'Profile',
      'ProjectRoles', 'Register', 'Reports', 'scripts', 'SearchResults',
      'Settings', 'Sidebar', 'styles', 'TeamDynamics', 'TeamMembers',
      'TermsOfService'
    ];

    const requested = String(page || 'index').replace(/[^a-zA-Z0-9_-]/g, '');
    const aliases = {
      ConflictResolution: 'ConflictResolutionPage'
    };
    const normalizedRequested = aliases[requested] || requested;
    if (!requested) {
      return 'index';
    }

    const exactMatch = availableTemplates.find(function(template) {
      return template === normalizedRequested;
    });
    if (exactMatch) {
      return exactMatch;
    }

    const caseInsensitiveMatch = availableTemplates.find(function(template) {
      return template.toLowerCase() === normalizedRequested.toLowerCase();
    });
    if (caseInsensitiveMatch) {
      return caseInsensitiveMatch;
    }

    return 'Error404';
  } catch (error) {
    Logger.log("Erro em resolveTemplateName: " + error.message);
    throw error;
  }
}

/**
 * Resolve a content view for shell rendering.
 * @param {string} view - Requested view name
 * @returns {string} Existing view file name
 */
function resolveViewName(view) {
  try {
    const allowedViews = [
      'About', 'AddMember', 'Analytics', 'Changelog', 'CommunicationGuide',
      'Compatibility', 'ConflictResolutionPage', 'Contact', 'Dashboard', 'EditMember',
      'Faq', 'Feedback', 'ForgotPassword', 'Help', 'Login', 'MemberProfile',
      'NatalChart', 'Notifications', 'PrivacyPolicy', 'ProductivityAnalysis',
      'Profile', 'ProjectRoles', 'Register', 'Reports', 'SearchResults',
      'Settings', 'TeamDynamics', 'TeamMembers', 'TermsOfService'
    ];

    const requested = String(view || 'Dashboard').replace(/[^a-zA-Z0-9_-]/g, '');
    const aliases = {
      ConflictResolution: 'ConflictResolutionPage'
    };
    const normalizedRequested = aliases[requested] || requested;
    if (!requested) {
      return 'Dashboard';
    }

    const exactMatch = allowedViews.find(function(item) {
      return item === normalizedRequested;
    });
    if (exactMatch) {
      return exactMatch;
    }

    const caseInsensitiveMatch = allowedViews.find(function(item) {
      return item.toLowerCase() === normalizedRequested.toLowerCase();
    });
    if (caseInsensitiveMatch) {
      return caseInsensitiveMatch;
    }

    return 'Error404';
  } catch (error) {
    Logger.log("Erro em resolveViewName: " + error.message);
    throw error;
  }
}

/**
 * ===========================================================================
 * SINGLE API SURFACE
 * ---------------------------------------------------------------------------
 * Every backend action is defined in `Api` exactly once, so both client
 * transports share one contract and can never drift apart:
 *   1. google.script.run -> the thin global wrappers below (GAS requires named
 *      top-level functions, so each wrapper just adapts positional client args
 *      into an Api params object).
 *   2. HTTP POST          -> doPost() dispatches by action name.
 * Each handler takes a single params object and returns { success, data|error }.
 * ===========================================================================
 */
const Api = {
  addTeamMember: function(p) { return TeamMemberService.addMember(p || {}); },
  getTeamMembers: function() { return TeamMemberService.getAllMembers(); },
  getMemberProfile: function(p) { return UserProfileService.getProfile(p && p.memberId); },
  updateMemberProfile: function(p) {
    var updates = (p && p.data) ? p.data : (p || {});
    return UserProfileService.updateProfile(p && p.memberId, updates);
  },
  calculateProductivityProfile: function(p) { return ProductivityProfileGenerator.generateProfile(p || {}); },
  getTeamDynamics: function() { return TeamDynamicsAnalyzer.analyzeTeam(); },
  getTeamRecommendations: function() { return TeamDynamicsAnalyzer.getTeamRecommendations(); },
  getProjectSuggestions: function() { return ProjectRoleSuggester.suggestRoles(); },
  getCommunicationTips: function(p) { return CommunicationTips.generateTips(p && p.memberId); },
  deleteMember: function(p) { return TeamMemberService.deleteMember(p && p.memberId); },
  getTeamOverview: function() { return GasClientHandler.getTeamOverview(); },
  getSystemStatus: function() { return GasClientHandler.getSystemStatus(); },
  getPreferences: function() { return UserProfileService.getPreferences(currentUserKey()); },
  updatePreferences: function(p) {
    var prefs = (p && p.preferences) ? p.preferences : (p || {});
    return UserProfileService.updatePreferences(currentUserKey(), prefs);
  },
  getCurrentUser: function() {
    var key = currentUserKey();
    return { success: true, data: { email: key === 'default' ? '' : key } };
  },
  login: function(p) {
    // Login proprio por usuario/senha (texto puro) contra a aba 'Usuarios'.
    // Normaliza o retorno de loginWithPassword ({success,user|message}) para o
    // envelope padrao {success, data|message} usado pelo resto da Api. Em caso
    // de sucesso emite um token de sessao (AuthSession.gs) que o cliente HTTP
    // deve enviar de volta em cada chamada protegida do doPost.
    var r = loginWithPassword(p && p.username, p && p.password);
    if (!r || r.success !== true) {
      return { success: false, message: (r && r.message) || 'Credenciais invalidas.' };
    }
    var token = Auth_issueToken_(r.user);
    return { success: true, data: { user: r.user, token: token } };
  },
  logout: function(p) {
    return Auth_revokeToken_(p && p.token);
  },
  searchMembers: function(p) {
    try {
      var query = p ? (p.query != null ? p.query : p.q) : '';
      return TeamMemberService.search(query);
    } catch (error) {
      Logger.log("Erro em searchMembers: " + error.message);
      throw error;
    }
  },
  getNatalChart: function(p) {
    var memberResult = TeamMemberService.getMember(p && p.memberId);
    if (!memberResult.success) { return memberResult; }
    return NatalChartCalculator.buildForMember(memberResult.data);
  },
  getCompatibility: function(p) {
    return TeamDynamicsAnalyzer.comparePair(p && p.memberA, p && p.memberB);
  },
  getConflictApproach: function(p) {
    // ConflictResolution returns the data object directly on success; normalize it.
    var r = ConflictResolution.getConflictApproach(p && p.memberId);
    if (r && r.success === false) { return r; }
    return { success: true, data: r };
  },
  getMediation: function(p) {
    var r = ConflictResolution.suggestMediationApproach(p && p.memberA, p && p.memberB);
    if (r && r.success === false) { return r; }
    return { success: true, data: r };
  },
  getCollaborationCandidates: function(p) {
    return getCollaborationCandidates(p && p.token);
  },
  proposeCollaboration: function(p) {
    return proposeCollaboration(p && p.token, p && p.memberAId, p && p.memberBId, p && p.rationale);
  },
  listCollaborations: function(p) {
    return listCollaborations(p && p.token, p && p.status);
  },
  reviewCollaboration: function(p) {
    return reviewCollaboration(p && p.token, p && p.proposalId, p && p.decision, p && p.note);
  }
};

/**
 * Resolve a stable key for the current user's preferences. Falls back to
 * 'default' when the active-user email isn't available (e.g. anonymous access).
 * @returns {string}
 */
function currentUserKey() {
  try {
    try {
      var email = Session.getActiveUser().getEmail();
      return email || 'default';
    } catch (e) {
      return 'default';
    }
  } catch (error) {
    Logger.log("Erro em currentUserKey: " + error.message);
    throw error;
  }
}

/**
 * Handles POST requests (HTTP/JSON API). Mirrors the google.script.run surface.
 * Body: { "action": "<name>", "data": { ... } }
 * @param {Object} e - Event object from Google Apps Script
 * @returns {TextOutput} JSON response
 */
// Acoes acionaveis sem token via doPost (HTTP). Tudo o mais exige sessao valida.
var PUBLIC_POST_ACTIONS_ = ['login'];

function doPost(e) {
  try {
    try {
      try {
        Logger.log('doPost request received');

        const payload = JSON.parse(e.postData.contents);
        const action = payload.action;
        const data = payload.data || {};

        // Gate de sessao: o doPost e o vetor HTTP aberto. Exige token valido para
        // qualquer acao fora da allow-list publica, devolvendo 401 logico.
        if (PUBLIC_POST_ACTIONS_.indexOf(action) === -1) {
          const session = Auth_verifyToken_(payload.token || data.token);
          if (!session) {
            return ContentService.createTextOutput(JSON.stringify({
              success: false,
              code: 'UNAUTHORIZED',
              message: 'Sessao ausente, invalida ou expirada.'
            })).setMimeType(ContentService.MimeType.JSON);
          }
        }

        const response = (typeof Api[action] === 'function')
          ? Api[action](data)
          : { success: false, message: 'Unknown action: ' + action };

        return ContentService.createTextOutput(JSON.stringify(response))
          .setMimeType(ContentService.MimeType.JSON);
      } catch (error) {
        ErrorHandler.logError('doPost', error);
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Server error: ' + error.message
        })).setMimeType(ContentService.MimeType.JSON);
      }
    } catch (error) {
      Logger.log("Erro em doPost: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em doPost: " + error.message);
    throw error;
  }
}

/**
 * Test function to verify the setup
 */
function testSetup() {
  Logger.log('Testing setup...');
  Logger.log('Constants loaded: ' + Constants.APP_NAME);
  Logger.log('API Config loaded: ' + ApiConfig.getAstrologyApiUrl());
  Logger.log('Setup test complete');
}

/**
 * Global wrappers for google.script.run.
 * Thin adapters only -- the real logic stays centralized in `Api` above.
 */
function addTeamMember(memberData) { return Api.addTeamMember(memberData || {}); }
function getTeamMembers() { return Api.getTeamMembers(); }
function getMemberProfile(memberId) { return Api.getMemberProfile({ memberId: memberId }); }
function updateMemberProfile(memberId, data) { return Api.updateMemberProfile({ memberId: memberId, data: data || {} }); }
function calculateProductivityProfile(memberData) { return Api.calculateProductivityProfile(memberData || {}); }
function getTeamDynamics() { return Api.getTeamDynamics(); }
function getTeamRecommendations() { return Api.getTeamRecommendations(); }
function getProjectSuggestions() { return Api.getProjectSuggestions(); }
function getCommunicationTips(memberId) { return Api.getCommunicationTips({ memberId: memberId }); }
function deleteMember(memberId) { return Api.deleteMember({ memberId: memberId }); }
function getTeamOverview() { return Api.getTeamOverview(); }
function getSystemStatus() { return Api.getSystemStatus(); }
function getPreferences() { return Api.getPreferences(); }
function updatePreferences(preferences) { return Api.updatePreferences({ preferences: preferences || {} }); }
function getCurrentUser() { return Api.getCurrentUser(); }
function login(username, password) { return Api.login({ username: username, password: password }); }
function logout(token) { return Api.logout({ token: token }); }
function searchMembers(query) { return Api.searchMembers({ query: query }); }
function getNatalChart(memberId) { return Api.getNatalChart({ memberId: memberId }); }
function getCompatibility(memberA, memberB) { return Api.getCompatibility({ memberA: memberA, memberB: memberB }); }
function getConflictApproach(memberId) { return Api.getConflictApproach({ memberId: memberId }); }
function getMediation(memberA, memberB) { return Api.getMediation({ memberA: memberA, memberB: memberB }); }

/**
 * Compacta dados estáticos para uso em data URLs (como logos base64)
 * Remove todos os espaços em branco para otimizar o tamanho
 */
function includeInlineData(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent().replace(/\s+/g, '');
}
