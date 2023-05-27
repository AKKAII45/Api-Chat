
const express = require('express');
const token = require('./util/token');
const {
	get,
	entrar,
	enviarMensagem,
	buscarMensagens,
	sairSala,
	criarSala
  } = require("./controllers/salaController");
const usuarioController = require("./controllers/usuarioController");
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', (req,res) => {
	res.status(200).send("<h1>API - CHAT</h1>");
}))

app.use("/sobre", router.get('/sobre', (req,res) => {
	res.status(200).send({
		"nome":"API-CHAT",
		"versao":"0.1.0",
		"autor":"Israel da Silva Kaiper"
	});
}));

app.use("/entrar", router.post("/entrar", async (req, res, next) => {
	
	let resp = await usuarioController.entrar(req.body.nick);
	res.status(200).send(resp);
}))

app.use("/salas",router.get("/salas", async (req, res,next) => {
	if(await token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) {
	  let resp= await get();
	  res.status(200).send(resp);
	}else{
	  res.status(400).send({msg:"Usuário não autorizado"});
	}	
  }))

app.use("/sala/entrar", router.put("/sala/entrar", async (req, res)=>{
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.entrar(req.headers.iduser, req.query.idsala);
	res.status(200).send(resp);
}))

app.use("/sala/mensagem/", router.post("/sala/mensagem", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.enviarMensagem(req.headers.nick, req.body.msg,req.body.idSala);
	res.status(200).send(resp);
}))

app.use("/sala/mensagens/", router.get("/sala/mensagens", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
	res.status(200).send(resp);
}))

app.use("/sala/sair/", router.put("/sala/sair", async (req, res) => {
	if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
	let resp= await salaController.sairSala(req.query.idsala, req.headers.iduser);
	res.status(200).send(resp);
}))

app.use("/sala/criar", router.put("/sala/criar", async (req, res) => {
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) return false;

    const { nome, tipo } = req.body;
    const sala = await salaController.criarSala(nome, tipo);

    if (sala) {
        res.status(200).send({ msg: "OK", sala });
    } else {
        res.status(500).send({ msg: "Erro ao criar sala" });
    }
}));


module.exports=app;