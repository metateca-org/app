/**
 * Dados sintéticos — Metateca.org
 * Gerado em 2026-06-21 01:10:43 por generate_synthetic_data_all_projects.py
 *
 * Execute populateSyntheticData() PELO EDITOR do Apps Script para popular
 * as abas de domínio com ~30 registros cada (valida os gráficos do notebook).
 * Idempotente: limpa as linhas de dados antes de reinserir.
 *
 * NÃO define onOpen() — para não colidir com o menu real do projeto.
 */

function populateSyntheticData() {
  try {
    try {
      try {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var results = [];

        // Membros
        try {
          var sheet_Membros = ss.getSheetByName('Membros') || ss.insertSheet('Membros');
          if (sheet_Membros.getLastRow() > 1) {
            sheet_Membros.deleteRows(2, sheet_Membros.getLastRow() - 1);
          }
          var h_sheet_Membros = ["ID", "Nome", "Email", "Position", "Department", "ProjetosAtivos", "Status", "DataIngresso"];
          sheet_Membros.getRange(1, 1, 1, h_sheet_Membros.length).setValues([h_sheet_Membros]);
          var d_sheet_Membros = [
            ["MEM-0001", "Bruno Santos", "usuario1@escola.edu.br", "B", "A", false, "ativo", "2026-05-17 01:10:43"],
            ["MEM-0002", "Bruno Santos", "usuario2@escola.edu.br", "A", "B", false, "ativo", "2026-05-16 01:10:43"],
            ["MEM-0003", "Diego Souza", "usuario3@escola.edu.br", "D", "A", true, "ativo", "2026-06-20 01:10:43"],
            ["MEM-0004", "Eduarda Lima", "usuario4@escola.edu.br", "B", "B", false, "inativo", "2026-06-16 01:10:43"],
            ["MEM-0005", "Felipe Costa", "usuario5@escola.edu.br", "D", "A", false, "ativo", "2026-05-31 01:10:43"],
            ["MEM-0006", "Gabriela Rocha", "usuario6@escola.edu.br", "B", "D", true, "ativo", "2026-05-28 01:10:43"],
            ["MEM-0007", "Eduarda Lima", "usuario7@escola.edu.br", "A", "A", true, "ativo", "2026-06-03 01:10:43"],
            ["MEM-0008", "Carla Oliveira", "usuario8@escola.edu.br", "B", "C", true, "ativo", "2026-06-02 01:10:43"],
            ["MEM-0009", "Gabriela Rocha", "usuario9@escola.edu.br", "B", "A", false, "ativo", "2026-06-10 01:10:43"],
            ["MEM-0010", "Ana Silva", "usuario10@escola.edu.br", "A", "C", false, "ativo", "2026-06-01 01:10:43"],
            ["MEM-0011", "Carla Oliveira", "usuario11@escola.edu.br", "D", "C", false, "inativo", "2026-04-22 01:10:43"],
            ["MEM-0012", "Bruno Santos", "usuario12@escola.edu.br", "A", "B", true, "ativo", "2026-05-21 01:10:43"],
            ["MEM-0013", "Gabriela Rocha", "usuario13@escola.edu.br", "A", "C", true, "ativo", "2026-05-23 01:10:43"],
            ["MEM-0014", "Gabriela Rocha", "usuario14@escola.edu.br", "A", "D", true, "inativo", "2026-05-12 01:10:43"],
            ["MEM-0015", "Diego Souza", "usuario15@escola.edu.br", "A", "C", false, "ativo", "2026-06-06 01:10:43"],
            ["MEM-0016", "Carla Oliveira", "usuario16@escola.edu.br", "C", "D", false, "ativo", "2026-04-28 01:10:43"],
            ["MEM-0017", "Diego Souza", "usuario17@escola.edu.br", "B", "C", false, "ativo", "2026-05-02 01:10:43"],
            ["MEM-0018", "Diego Souza", "usuario18@escola.edu.br", "D", "D", true, "ativo", "2026-04-30 01:10:43"],
            ["MEM-0019", "Henrique Alves", "usuario19@escola.edu.br", "C", "B", true, "ativo", "2026-04-23 01:10:43"],
            ["MEM-0020", "Henrique Alves", "usuario20@escola.edu.br", "C", "C", false, "inativo", "2026-05-30 01:10:43"],
            ["MEM-0021", "Diego Souza", "usuario21@escola.edu.br", "C", "A", true, "ativo", "2026-06-02 01:10:43"],
            ["MEM-0022", "Bruno Santos", "usuario22@escola.edu.br", "D", "A", true, "ativo", "2026-04-26 01:10:43"],
            ["MEM-0023", "Gabriela Rocha", "usuario23@escola.edu.br", "B", "C", false, "ativo", "2026-05-12 01:10:43"],
            ["MEM-0024", "Eduarda Lima", "usuario24@escola.edu.br", "D", "C", true, "ativo", "2026-05-31 01:10:43"],
            ["MEM-0025", "Diego Souza", "usuario25@escola.edu.br", "D", "C", true, "ativo", "2026-05-11 01:10:43"],
            ["MEM-0026", "Ana Silva", "usuario26@escola.edu.br", "D", "A", true, "ativo", "2026-05-26 01:10:43"],
            ["MEM-0027", "Henrique Alves", "usuario27@escola.edu.br", "D", "A", false, "ativo", "2026-05-18 01:10:43"],
            ["MEM-0028", "Ana Silva", "usuario28@escola.edu.br", "D", "A", false, "inativo", "2026-04-30 01:10:43"],
            ["MEM-0029", "Felipe Costa", "usuario29@escola.edu.br", "D", "B", false, "ativo", "2026-06-14 01:10:43"],
            ["MEM-0030", "Henrique Alves", "usuario30@escola.edu.br", "C", "B", false, "ativo", "2026-06-07 01:10:43"]
          ];
          sheet_Membros.getRange(2, 1, d_sheet_Membros.length, h_sheet_Membros.length).setValues(d_sheet_Membros);
          results.push('OK Membros: ' + d_sheet_Membros.length + ' registros');
        } catch (e) {
          results.push('ERRO Membros: ' + e.message);
        }

        // MapasNatais
        try {
          var sheet_MapasNatais = ss.getSheetByName('MapasNatais') || ss.insertSheet('MapasNatais');
          if (sheet_MapasNatais.getLastRow() > 1) {
            sheet_MapasNatais.deleteRows(2, sheet_MapasNatais.getLastRow() - 1);
          }
          var h_sheet_MapasNatais = ["ID", "Data", "Membro", "Signo", "Ascendente", "Latitude", "Longitude", "Status"];
          sheet_MapasNatais.getRange(1, 1, 1, h_sheet_MapasNatais.length).setValues([h_sheet_MapasNatais]);
          var d_sheet_MapasNatais = [
            ["MAP-0001", "2026-05-05 01:10:43", "Ana Silva", "Leão", "Aquário", -15.68144, -47.97476, "ativo"],
            ["MAP-0002", "2026-04-30 01:10:43", "Eduarda Lima", "Peixes", "Câncer", -15.9563, -47.92717, "ativo"],
            ["MAP-0003", "2026-06-19 01:10:43", "Eduarda Lima", "Escorpião", "Peixes", -15.76721, -48.02682, "ativo"],
            ["MAP-0004", "2026-04-30 01:10:43", "Gabriela Rocha", "Touro", "Leão", -15.82236, -47.9271, "ativo"],
            ["MAP-0005", "2026-05-10 01:10:43", "Carla Oliveira", "Touro", "Capricórnio", -15.9987, -48.07723, "ativo"],
            ["MAP-0006", "2026-04-23 01:10:43", "Diego Souza", "Sagitário", "Peixes", -15.7371, -48.03285, "ativo"],
            ["MAP-0007", "2026-05-08 01:10:43", "Eduarda Lima", "Aquário", "Sagitário", -15.69676, -48.09932, "inativo"],
            ["MAP-0008", "2026-05-11 01:10:43", "Ana Silva", "Virgem", "Libra", -15.71226, -47.95759, "ativo"],
            ["MAP-0009", "2026-05-09 01:10:43", "Henrique Alves", "Escorpião", "Virgem", -15.8431, -48.08479, "ativo"],
            ["MAP-0010", "2026-06-18 01:10:43", "Eduarda Lima", "Libra", "Sagitário", -15.87046, -48.09819, "ativo"],
            ["MAP-0011", "2026-05-31 01:10:43", "Bruno Santos", "Capricórnio", "Áries", -15.65389, -48.02103, "inativo"],
            ["MAP-0012", "2026-06-17 01:10:43", "Diego Souza", "Câncer", "Gêmeos", -15.91831, -48.078, "ativo"],
            ["MAP-0013", "2026-06-20 01:10:43", "Henrique Alves", "Libra", "Áries", -15.81299, -47.8808, "ativo"],
            ["MAP-0014", "2026-04-29 01:10:43", "Eduarda Lima", "Câncer", "Touro", -15.86057, -47.76442, "ativo"],
            ["MAP-0015", "2026-04-30 01:10:43", "Felipe Costa", "Sagitário", "Câncer", -15.67258, -47.82849, "inativo"],
            ["MAP-0016", "2026-05-04 01:10:43", "Bruno Santos", "Aquário", "Escorpião", -15.81843, -48.07006, "ativo"],
            ["MAP-0017", "2026-04-24 01:10:43", "Ana Silva", "Libra", "Virgem", -15.69397, -47.85732, "ativo"],
            ["MAP-0018", "2026-06-18 01:10:43", "Henrique Alves", "Áries", "Leão", -15.8057, -47.94886, "ativo"],
            ["MAP-0019", "2026-05-09 01:10:43", "Ana Silva", "Sagitário", "Áries", -15.93203, -47.96649, "ativo"],
            ["MAP-0020", "2026-05-13 01:10:43", "Gabriela Rocha", "Câncer", "Capricórnio", -15.73501, -47.8816, "inativo"],
            ["MAP-0021", "2026-05-28 01:10:43", "Henrique Alves", "Libra", "Capricórnio", -15.80231, -47.98113, "ativo"],
            ["MAP-0022", "2026-05-23 01:10:43", "Felipe Costa", "Capricórnio", "Câncer", -16.0068, -48.0957, "ativo"],
            ["MAP-0023", "2026-05-15 01:10:43", "Diego Souza", "Capricórnio", "Gêmeos", -15.79505, -48.0103, "inativo"],
            ["MAP-0024", "2026-05-22 01:10:43", "Henrique Alves", "Gêmeos", "Câncer", -15.99493, -48.08458, "ativo"],
            ["MAP-0025", "2026-06-02 01:10:43", "Gabriela Rocha", "Sagitário", "Aquário", -15.74825, -47.99108, "ativo"],
            ["MAP-0026", "2026-06-12 01:10:43", "Henrique Alves", "Leão", "Capricórnio", -15.91284, -47.97091, "ativo"],
            ["MAP-0027", "2026-05-19 01:10:43", "Carla Oliveira", "Áries", "Câncer", -15.84716, -47.80769, "ativo"],
            ["MAP-0028", "2026-05-25 01:10:43", "Felipe Costa", "Câncer", "Câncer", -15.79378, -48.02956, "ativo"],
            ["MAP-0029", "2026-05-31 01:10:43", "Diego Souza", "Aquário", "Escorpião", -15.77209, -47.75633, "ativo"],
            ["MAP-0030", "2026-04-28 01:10:43", "Felipe Costa", "Capricórnio", "Leão", -15.88252, -48.0432, "inativo"]
          ];
          sheet_MapasNatais.getRange(2, 1, d_sheet_MapasNatais.length, h_sheet_MapasNatais.length).setValues(d_sheet_MapasNatais);
          results.push('OK MapasNatais: ' + d_sheet_MapasNatais.length + ' registros');
        } catch (e) {
          results.push('ERRO MapasNatais: ' + e.message);
        }

        // Feedbacks
        try {
          var sheet_Feedbacks = ss.getSheetByName('Feedbacks') || ss.insertSheet('Feedbacks');
          if (sheet_Feedbacks.getLastRow() > 1) {
            sheet_Feedbacks.deleteRows(2, sheet_Feedbacks.getLastRow() - 1);
          }
          var h_sheet_Feedbacks = ["ID", "Data", "Membro", "Categoria", "Nota", "Status", "Mensagem"];
          sheet_Feedbacks.getRange(1, 1, 1, h_sheet_Feedbacks.length).setValues([h_sheet_Feedbacks]);
          var d_sheet_Feedbacks = [
            ["FEE-0001", "2026-04-26 01:10:43", "Ana Silva", "categoria_4", 6.1, "ativo", "Observações durante a coleta"],
            ["FEE-0002", "2026-05-08 01:10:43", "Diego Souza", "categoria_4", 8.1, "ativo", "Necessita acompanhamento adicional"],
            ["FEE-0003", "2026-05-05 01:10:43", "Felipe Costa", "categoria_4", 6.0, "ativo", "Processo executado com sucesso"],
            ["FEE-0004", "2026-05-29 01:10:43", "Ana Silva", "categoria_1", 6.8, "ativo", "Observações durante a coleta"],
            ["FEE-0005", "2026-06-03 01:10:43", "Henrique Alves", "categoria_2", 8.2, "ativo", "Processo executado com sucesso"],
            ["FEE-0006", "2026-06-20 01:10:43", "Diego Souza", "categoria_2", 6.4, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0007", "2026-05-06 01:10:43", "Carla Oliveira", "categoria_3", 9.2, "ativo", "Observações durante a coleta"],
            ["FEE-0008", "2026-06-09 01:10:43", "Ana Silva", "categoria_2", 9.2, "ativo", "Processo executado com sucesso"],
            ["FEE-0009", "2026-04-29 01:10:43", "Carla Oliveira", "categoria_4", 8.3, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0010", "2026-04-23 01:10:43", "Diego Souza", "categoria_3", 7.3, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0011", "2026-05-10 01:10:43", "Carla Oliveira", "categoria_4", 9.4, "ativo", "Processo executado com sucesso"],
            ["FEE-0012", "2026-06-12 01:10:43", "Carla Oliveira", "categoria_2", 6.0, "inativo", "Comportamento dentro do esperado"],
            ["FEE-0013", "2026-06-01 01:10:43", "Gabriela Rocha", "categoria_2", 9.6, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0014", "2026-05-02 01:10:43", "Carla Oliveira", "categoria_3", 6.2, "ativo", "Observações durante a coleta"],
            ["FEE-0015", "2026-04-28 01:10:43", "Henrique Alves", "categoria_2", 8.6, "inativo", "Processo executado com sucesso"],
            ["FEE-0016", "2026-06-11 01:10:43", "Gabriela Rocha", "categoria_3", 7.5, "inativo", "Observações durante a coleta"],
            ["FEE-0017", "2026-06-01 01:10:43", "Felipe Costa", "categoria_4", 8.6, "inativo", "Necessita acompanhamento adicional"],
            ["FEE-0018", "2026-06-04 01:10:43", "Gabriela Rocha", "categoria_1", 6.0, "ativo", "Necessita acompanhamento adicional"],
            ["FEE-0019", "2026-04-27 01:10:43", "Diego Souza", "categoria_4", 6.1, "inativo", "Necessita acompanhamento adicional"],
            ["FEE-0020", "2026-05-16 01:10:43", "Carla Oliveira", "categoria_3", 6.3, "ativo", "Observações durante a coleta"],
            ["FEE-0021", "2026-05-04 01:10:43", "Bruno Santos", "categoria_3", 7.2, "ativo", "Observações durante a coleta"],
            ["FEE-0022", "2026-05-15 01:10:43", "Ana Silva", "categoria_4", 7.6, "ativo", "Necessita acompanhamento adicional"],
            ["FEE-0023", "2026-05-24 01:10:43", "Henrique Alves", "categoria_4", 7.0, "inativo", "Comportamento dentro do esperado"],
            ["FEE-0024", "2026-06-04 01:10:43", "Gabriela Rocha", "categoria_1", 5.9, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0025", "2026-05-11 01:10:43", "Bruno Santos", "categoria_3", 9.5, "ativo", "Processo executado com sucesso"],
            ["FEE-0026", "2026-05-02 01:10:43", "Eduarda Lima", "categoria_2", 5.5, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0027", "2026-06-19 01:10:43", "Diego Souza", "categoria_3", 6.0, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0028", "2026-06-02 01:10:43", "Eduarda Lima", "categoria_2", 8.5, "ativo", "Comportamento dentro do esperado"],
            ["FEE-0029", "2026-06-21 01:10:43", "Eduarda Lima", "categoria_3", 9.1, "inativo", "Necessita acompanhamento adicional"],
            ["FEE-0030", "2026-04-30 01:10:43", "Ana Silva", "categoria_4", 8.3, "ativo", "Necessita acompanhamento adicional"]
          ];
          sheet_Feedbacks.getRange(2, 1, d_sheet_Feedbacks.length, h_sheet_Feedbacks.length).setValues(d_sheet_Feedbacks);
          results.push('OK Feedbacks: ' + d_sheet_Feedbacks.length + ' registros');
        } catch (e) {
          results.push('ERRO Feedbacks: ' + e.message);
        }

        Logger.log(results.join('\n'));
        return results;
      } catch (error) {
        Logger.log("Erro em populateSyntheticData: " + error.message);
        throw error; // Re-lança para tratamento superior
      }
    } catch (error) {
      Logger.log("Erro em populateSyntheticData: " + error.message);
      throw error;
    }
  } catch (error) {
    Logger.log("Erro em populateSyntheticData: " + error.message);
    throw error;
  }
}
