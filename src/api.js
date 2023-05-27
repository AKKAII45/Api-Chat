var express = require("express");
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const salaController = require("./controllers/salaController");
const TokenExpiredError = require("./util/token");

const router = express.Router();
app.use('/', router.get('/', (req, res) => {
  res.status(200).send("<h1>API - CHAT</h1>")
}));

app.use("/sobre", router.get("/sobre", (req, res, next) => {
  res.status(200).send({
    "nome": "API-CHAT",
    "versao": "0.1.0",
    "autor": "Israel da Silva Kaiper"
  })
}));

app.use("/salas", router.get("/salas", async (req, res, next) => {
  if (await TokenExpiredError.checkToken(req.body.token, req.body.idUser, req.body.nick)) {
    let resp = await salaController.get();
    res.status(200).send(resp);
  } else {
    res.status(400).send({ msg: "usuario nao autorizado" });
  }

}));

app.use("/entrar", router.post("/entrar", async (req, res, next) => {
  const usuarioController = require("./controllers/usuarioController");
  let resp = await usuarioController.entrar(req.body.nick);
  res.status(200).send(resp);
}));

app.use("/sala/entrar", router.put("/sala/entrar", async (req, res) => {
  console.log("teste");

  let resp = await salaController.entrar(req.body.idUser, req.body.idSala);
  res.status(200).send(resp);
}));

app.use("/sala/mensagem", router.post("/sala/mensagem", async (req, res) => {
  if (!TokenExpiredError.checkToken(req.body.token, req.body.idUser, req.body.nick)) {
    return false;
  }
  let resp = await salaController.enviarMensagem(req.body.nick, req.body.msg, req.body.idSala);
  res.status(200).send(resp);
}));

app.use("/sala/mensagens", router.get("/sala/mensagens", async (req, res) => {
  if (!TokenExpiredError.checkToken(req.body.token, req.body.idUser, req.body.nick)) {
    return false;
  }
  let resp = await salaController.buscarMensagens(req.body.idSala, req.body.timestamp);
  res.status(200).send(resp);

}));

app.use("/sala/sair", router.put("/sala/sair", async (req, res) => {

  let resp = await salaController.sair(req.body.idUser);
  res.status(200).send(resp);
}));

app.use("/sala/criar", router.post("/sala/criar", async (req, res) => {

  let resp = await salaController.criar(req.body.nome, req.body.tipo, req.body.chave);
  res.status(200).send(resp);
}));


module.exports = app;
