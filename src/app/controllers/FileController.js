// Para o FileController poder salvar essas informaçoes no banco de dados nos iremos precisar
// de uma tabela nova no banco de dados. Para isso usaremos o seguinte comando:
// yarn sequelize migration:create --name=create-files

import File from '../models/File';

class FileController {
  async store(req, resp) {
    const { originalname: name, filename: path } = req.file; // iremos chamar os campos
    // originalName e filename de name e path respctivamente.

    const file = await File.create({
      name, path,
    });

    return resp.json(file);
  }
}

export default new FileController();
