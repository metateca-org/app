/**
 * Wrapper oficial da frota para Gemini.
 */
var GeminiGateway = (function () {
  'use strict';
  function generate(prompt, options) {
    try {
      options = options || {};
      if (options.ethics) {
        return EthicsGuardService.pipeline(prompt, function (safePrompt) {
          var nested = {};
          Object.keys(options).forEach(function (key) {
            if (key !== 'ethics') nested[key] = options[key];
          });
          return generateRaw_(safePrompt, nested);
        }, options.ethics);
      }
      return generateRaw_(prompt, options);
    } catch (error) {
      Logger.log("Erro em generate: " + error.message);
      throw error;
    }
  }

  // FROTA-06: auditoria minima da geracao (campos tecnicos, nunca o prompt
  // nem a resposta do modelo).
  function audit_(useCase, model, started, result) {
    if (typeof AiAuditLogService === 'undefined') return;
    try {
      var usedFallback = !!(result && result.source === 'fallback');
      var failed = !result || result.ok === false;
      AiAuditLogService.record({
        useCase: useCase,
        model: model,
        durationMs: new Date().getTime() - started,
        status: usedFallback ? 'fallback' : (failed ? 'fail' : 'ok'),
        fallback: usedFallback,
        errorCode: (failed && result && result.error && result.error.code) || ''
      });
    } catch (_) {}
  }

  function generateRaw_(prompt, options) {
    var model = options.model || 'gemini-2.0-flash';
    var started = new Date().getTime();
    var result = ExternalApiClient.request({
      operation: options.operation || 'gemini.generate',
      url: 'https://generativelanguage.googleapis.com/v1beta/models/' +
        encodeURIComponent(model) + ':generateContent',
      secretProperty: 'GEMINI_API_KEY',
      secretHeader: 'x-goog-api-key',
      secretPrefix: '',
      payload: {
        contents: [{ role: 'user', parts: [{ text: String(prompt) }] }],
        generationConfig: options.generationConfig || {}
      },
      cacheKey: options.cacheKey,
      cacheSeconds: options.cacheSeconds,
      rateLimitKey: options.rateLimitKey || 'gemini',
      fallback: options.fallback,
      normalize: function (body) {
        try {
          var candidates = body && body.candidates || [];
          var parts = candidates[0] && candidates[0].content &&
            candidates[0].content.parts || [];
          return {
            text: parts.map(function (part) { return part.text || ''; }).join(''),
            finishReason: candidates[0] && candidates[0].finishReason || null,
            usage: body && body.usageMetadata || null,
            model: model
          };
        } catch (error) {
          Logger.log("Erro em normalize: " + error.message);
          throw error;
        }
      }
    });
    audit_(options.operation || 'gemini.generate', model, started, result);
    return result;
  }
  return { generate: generate };
}());
