const db = require('../../config/db')
const { age, date } = require('../../lib/utils')
module.exports = {
  //callback vai ser chamada apos toda a funcao
  all(callback) {
    db.query(`
    SELECT instructors.*, count(members) AS total_students
    FROM instructors
    LEFT JOIN members ON(instructors.id = members.instructor_id)
    GROUP BY instructors.id
    ORDER BY total_students DESC`, function (err, results) {
      if (err) throw `Database Error ${err}`
      //results é tudo que puxa de volta do bd, o .rows é a parte exata em q eu quero!
      callback(results.rows)

      //console.log(results.rows) no results.rows puxo tudo do db que contem na query que coloquei !!!
    })
  },
  create(data, callback) {
    //fazendo a primeira query sql !
    const query = `INSERT INTO instructors (
      name,
      avatar_url,
      birth,
      gender,
      services,
      created_at
    )VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id`

    const values = [
      data.name,
      data.avatar_url,
      date(data.birth).iso,
      data.gender,
      data.services,
      date(Date.now()).iso,
    ]
    //inserindo a query !
    db.query(query, values, function (err, results) {
      if (err) throw `Database Error ${err}`

      callback(results.rows[0])
    })


  },
  find(id, callback) {
    db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function (err, results) {
      //f(err) return ("Database Error")
      if (err) throw `Database Error ${err}`
      callback(results.rows[0])
    })
  },
  findBy(filter,callback){
    db.query(`
    SELECT instructors.*, count(members) AS total_students
    FROM instructors
    LEFT JOIN members ON(instructors.id = members.instructor_id)
    WHERE instructors.name ILIKE '%${filter}%'
    OR instructors.services ILIKE '%${filter}%'
    GROUP BY instructors.id
    ORDER BY total_students DESC`, function (err, results) {
      if (err) throw `Database Error ${err}`
      //results é tudo que puxa de volta do bd, o .rows é a parte exata em q eu quero!
      callback(results.rows)
    })
  },
  update(data, callback) {
    query = `UPDATE instructors SET
     avatar_url=($1),
     name=($2),
     birth=($3),
     gender=($4),
     services=($5)
     WHERE id = $6
     `
    const values = [
      data.avatar_url,
      data.name,
      date(data.birth).iso,
      data.gender,
      data.services,
      data.id
    ]
    db.query(query, values, function (err, results) {
      if (err) throw `Database Error ${err}`
      callback()//nao precisa devolver
    })
  },
  delete(id, callback) {
    db.query(`DELETE FROM instructors WHERE id = $1`, [id], function (err, results) {
      if (err) throw `Database Error ${err}`
      return callback()
    })
  },
  paginate(params){
    const {filter,limit,offset,callback} = params
    
    let query = `
    SELECT instructors.* ,count(members) as total_students
    FROM instructors
    LEFT JOIN members ON (instructors.id = members.instructor_id)
    `

    if(filter){
      query = `${query}
      WHERE instructors.name ILIKE '%${filter}$'
      OR instructors.services ILIKE '%${filter}$'
      `//colocando filter dentro da query !. porra loka
      
    }
    query = `${query}
    GROUP BY instructors.id LIMIT $1 OFFSET $2`

    db.query(query,[limit,offset],function(err,results){
      if(err) throw `Database error !: ${err}`

      callback(results.rows)
    })


    
  }
}