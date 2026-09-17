/**
 * COMPONENTE: Ping.gs
 * PAPEL: Health check leve do backend.
 * FUNCIONALIDADES: confirma conectividade frontend ↔ backend via google.script.run.
 */

function ping() {
  try {
    return {
      success: true,
      status: 'ok',
      service: 'Metateca.org Backend',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  } catch (error) {
    Logger.log("Erro em ping: " + error.message);
    throw error;
  }
}

function healthCheck() {
  try {
    const scriptUrl = ScriptApp.getService().getUrl();
    return {
      success: true,
      status: 'healthy',
      service: 'Metateca.org',
      timestamp: new Date().toISOString(),
      scriptUrl: scriptUrl || 'not_available'
    };
  } catch (error) {
    return {
      success: false,
      status: 'unhealthy',
      service: 'Metateca.org',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}
