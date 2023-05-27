const { Timestamp } = require("mongodb");
const db = require("./db");

function listarSalas() {
  let salas = db.findAll("salas");
  return salas;
}

let buscarSala = async (idSala) => {
  return db.findOne("salas", idSala);
}

let atualizarMensagens = async (sala, mensagem) => {
  return await db.updateOne("salas", mensagem, { _id: sala._id });
}

let buscarMensagem = async (idsala, timestamp) => {
  let sala = await buscarSala(idsala);
  if (sala.msgs) {
    let msgs = [];
    sala.msgs.forEach((msg) => {
      if (msg.timestamp >= timestamp) {
        msgs.push(msg);
      }
    });
    return msgs;
  }
  return [];
}

let criarSala = async (nome, tipo, chave) => {
  if (tipo === "privada") {
    return await db.insertOne("salas", { "nome": nome, "tipo": tipo, "chave": chave, "msgs": [] });
  } else {
    return await db.insertOne("salas", { "nome": nome, "tipo": tipo, "msgs": [] });
  }
}

module.exports = { listarSalas, atualizarMensagens, buscarMensagem, buscarSala, criarSala };
