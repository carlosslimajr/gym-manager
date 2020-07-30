const db = require('../../config/db')
const { date } = require('../../lib/utils')
module.exports = {
  //callback vai ser chamada apos toda a funcao
  all(callback) {
    db.query(`SELECT * FROM members ORDER BY name ASC`, function (err, results) {
      if (err) throw `Database Error ${err}`
      //results é tudo que puxa de volta do bd, o .rows é a parte exata em q eu quero!
      callback(results.rows)

      //console.log(results.rows) no results.rows puxo tudo do db que contem na query que coloquei !!!
    })
  },
  create(data, callback) {
    //fazendo a primeira query sql !
    const query = `INSERT INTO members (
      name,
      avatar_url,
      birth,
      gender,
      email,
      blood,
      weight,
      height,
      instructor_id
    )VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING id`

    const values = [
      data.name,
      data.avatar_url,
      date(data.birth).iso,
      data.gender,
      data.email,
      data.blood,
      data.weight,
      data.height,
      data.instructor
    ]
    //inserindo a query !
    db.query(query, values, function (err, results) {
      if (err) throw `Database Error ${err}`

      callback(results.rows[0])
    })


  },
  find(id, callback) {
    db.query(`SELECT members.*, instructors.name AS instructor_name
    FROM members
    LEFT JOIN instructors on (members.instructor_id = instructors.id)
    WHERE members.id = $1`, [id], function (err, results) {
      //f(err) return ("Database Error")
      if (err) throw `Database Error ${err}`
      callback(results.rows[0])
    })
  },
  update(data, callback) {
    query = `UPDATE members SET
     avatar_url=($1),
     name=($2),
     birth=($3),
     gender=($4),
     email=($5),
     blood=($6),
     weight=($7),
     height=($8),
     instructor_id=($9)
     WHERE id = $10
     `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.email,
      data.blood,
      data.weight,
      data.height,
      data.instructor,
      data.id
    ]
    db.query(query, values, function (err, results) {
      if (err) throw `Database Error ${err}`
      callback()//nao precisa devolver
    })
  },
  delete(id,callback){
    db.query(`DELETE FROM members WHERE id = $1`, [id],function(err,results){
      if (err) throw `Database Error ${err}`
      return callback()
    })
  },
  instructorsSelectOptions(callback){
    db.query(`SELECT name,id FROM instructors`, function(err,results){
      if(err) throw `Database Error ${err}`
      callback(results.rows)
    })
  }
}