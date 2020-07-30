const { age, date } = require('../../lib/utils')
//const db = require('../../config/db')
const Member = require('../models/member')

module.exports = {
  index(req, res) {
    //Inserindo a função no member e puxando o callback !
    Member.all(function (members) {
     
      return res.render("members/index", { members })
      //Aqui eu to pegando o results.rows do bd ! puxando pela query e jogando como ''members'' para o views/nunjucks. que vai fazer a transformação!
    })
  },
  create(req, res) {
    Member.instructorsSelectOptions(function(options){
      return res.render('members/create', {instructorOptions: options})
    })
   
  },
  post(req, res) {
    const keys = Object.keys(req.body)//Pesquisar o que estou fazendo aqui !
    for (key of keys) {
      //Verificando se algo no objeto esta vazio!
      if (req.body[key] == "") {
        return res.send("Please, fill all fields !")
      }
    }

    Member.create(req.body, function (member) {
      return res.redirect(`/members/${member.id}`)//dps pesquisar o que ta rolando aqui
    })
  },
  show(req, res) {
    Member.find(req.params.id, function (member) {

      if (!member) res.send("Member not found!")
      member.birth = date(member.birth).birthday
      return res.render("members/show", { member })

    })


  },
  edit(req, res) {
    Member.find(req.params.id, function (member) {

      if (!member) res.send("Member not found!")
      member.birth = date(member.birth).iso // tem q passar para esse formato para o site aceitar a data
      Member.instructorsSelectOptions(function(options){
        return res.render('members/edit', {member,instructorOptions: options})
      })

    })


  },
  put(req, res) {
    const keys = Object.keys(req.body) //faz um array com nome das chaves do objeto !(não pega os valores)
    //object é um constructor que vai criar uma função

    //percorrer o array e verificar !
    for (key of keys) {
      //req.body.avatar_url (mesma coisa !!!) js entende
      if (req.body[key] == "") {
        return res.send("Please, fill all fields !")
      }
    }
    Member.update(req.body, function(){
      return res.redirect(`/members/${req.body.id}`)
    })
  },
  delete(req, res) {

    Member.delete(req.body.id, function(){
      return res.redirect(`/members`)
    })
  }
}
