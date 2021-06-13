import File from '../models/File';

class FileController {
  async save(req, res) {
    console.log("TESTE")
    console.log(req.file)
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });

    return res.json (file);
  }
}

export default new FileController();
