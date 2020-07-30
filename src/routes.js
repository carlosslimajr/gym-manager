const express = require('express')
const routes = express.Router()
const instructors = require('./app/controllers/instructors')
const members = require('./app/controllers/members')

routes.get('/', (req, res) => { return res.redirect("/instructors")})
routes.get('/instructors',instructors.index)
routes.get('/instructors/create',instructors.create)
routes.get('/instructors/:id', instructors.show)
routes.get('/instructors/:id/edit', instructors.edit)
routes.post("/instructors", instructors.post) //usando o post que criei no instructors
routes.put("/instructors", instructors.put)
routes.delete("/instructors", instructors.delete)

//Estamos usando o protocolo http, que tem seus verbos !
//GET : Receber RESOURCE(entidade que representa um objeto do mundo real-instrutor)
//POST : Criar/Salvar alguma coisa(RESOURCE)
//PUT : Responsavel por atualizar!
//Delete: Deletar

routes.get('/members',members.index)
routes.get('/members/create',members.create)
routes.get('/members/:id', members.show)
routes.get('/members/:id/edit', members.edit)
routes.post("/members", members.post) //usando o post que criei no members
routes.put("/members", members.put)
routes.delete("/members", members.delete)

module.exports = routes