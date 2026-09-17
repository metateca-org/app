/**
 * Catálogo visual remoto do Metateca.org.
 *
 * Os assets são encontrados pelo nome exato na pasta configurada em FOLDER_ID.
 * Nenhum caminho local ou ID da pasta é enviado ao navegador.
 */
var METATECA_ORG_ASSET_PROJECT = 'metateca-org';
var METATECA_ORG_ASSET_FILES = Object.freeze([
  'aspectos_cooperativos.svg',
  'cartas_mediacao.webp',
  'constelacao_equipes_hero.webp',
  'kit_papeis_colaborativos.png',
  'mapa_complementaridade.svg',
  'ponte_restaurativa.svg',
  'selo_acordo_revisavel.svg'
]);

var METATECA_ORG_ASSET_MIME_TYPES = Object.freeze({
  png: ['image/png'],
  svg: ['image/svg+xml'],
  webp: ['image/webp']
});

function getGameAssetManifest() {
  return MetatecaOrgAssetService_getManifest_();
}

function MetatecaOrgAssetService_getManifest_() {
  var manifest = {
    project: METATECA_ORG_ASSET_PROJECT,
    ok: false,
    assets: {},
    assetItems: [],
    missing: [],
    duplicates: [],
    invalidMimeTypes: [],
    error: ''
  };

  try {
    var folder = MetatecaOrgAssetService_resolveFolder_();
    METATECA_ORG_ASSET_FILES.forEach(function(name) {
      var iterator = folder.getFilesByName(name);
      var files = [];
      while (iterator.hasNext()) files.push(iterator.next());

      if (!files.length) {
        manifest.missing.push(name);
        return;
      }
      if (files.length > 1) {
        manifest.duplicates.push(name);
        return;
      }

      var file = files[0];
      var mimeType = file.getMimeType();
      if (!MetatecaOrgAssetService_hasExpectedMimeType_(name, mimeType)) {
        manifest.invalidMimeTypes.push({ name: name, mimeType: mimeType });
        return;
      }

      var item = {
        name: name,
        mimeType: mimeType,
        url: 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(file.getId())
      };
      manifest.assets[name] = item.url;
      manifest.assetItems.push(item);
    });

    manifest.ok = !manifest.missing.length &&
      !manifest.duplicates.length &&
      !manifest.invalidMimeTypes.length;

    if (!manifest.ok) {
      manifest.assets = {};
      manifest.assetItems = [];
      manifest.error = MetatecaOrgAssetService_buildError_(manifest);
    }
  } catch (error) {
    manifest.assets = {};
    manifest.assetItems = [];
    manifest.error = error && error.message ? error.message : String(error);
  }
  return manifest;
}

function MetatecaOrgAssetService_resolveFolder_() {
  var folderId = String(PropertiesService.getScriptProperties().getProperty('FOLDER_ID') || '').trim();
  if (!folderId) {
    throw new Error('Configure FOLDER_ID nas propriedades do script para carregar os assets do Metateca.org.');
  }
  return DriveApp.getFolderById(folderId);
}

function MetatecaOrgAssetService_hasExpectedMimeType_(name, mimeType) {
  var extension = name.split('.').pop().toLowerCase();
  return (METATECA_ORG_ASSET_MIME_TYPES[extension] || []).indexOf(mimeType) !== -1;
}

function MetatecaOrgAssetService_buildError_(manifest) {
  var parts = [];
  if (manifest.missing.length) parts.push('ausentes: ' + manifest.missing.join(', '));
  if (manifest.duplicates.length) parts.push('duplicados: ' + manifest.duplicates.join(', '));
  if (manifest.invalidMimeTypes.length) {
    parts.push('tipos inválidos: ' + manifest.invalidMimeTypes.map(function(item) {
      return item.name + ' (' + item.mimeType + ')';
    }).join(', '));
  }
  return 'Catálogo visual indisponível — ' + parts.join('; ') + '.';
}
