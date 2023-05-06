require('dotenv').config()
const Sequelize = require('sequelize')
const { CONNECTION_STRING } = process.env

const sequelize = new Sequelize(CONNECTION_STRING,{
    dialect:'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized:false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS weapons;
            DROP TABLE IF EXISTS fighters;

            CREATE TABLE fighters(
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                power INT NOT NULL,
                hp INT NOT NULL,
                type VARCHAR NOT NULL
            );

            CREATE TABLE weapons(
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                power INT NOT NULL,
                owner_id INT REFERENCES fighters(id)
            )
        `)
        .then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log('you had a Sequelize error in your seed function:')
            console.log(err)
            res.status(500).send(err)
        })
    },
    createFighter: (req,res) => {
        const{name,hp,power,type} = req.body

        sequelize.query(`       
            INSERT INTO fighters(name,power,hp,type)
            VALUES('${name}',${power},${hp},'${type}')
            RETURNING *;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch((err) => {
            console.log('error on create fighter:' + err)
            res.status(500).send(err)
        })
    },
    getFightersList: (req, res) => {
    sequelize
      .query(
        `
            SELECT id, name FROM fighters
        `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]))
      .catch((err) => {
        console.log(`there was an error in getFightersList`, err.message);
        res.status(500).send(err);
      });
  },
    createWeapon: (req,res) => {
        const {power, name, owner} = req.body;
        
        sequelize.query(`
            INSERT INTO weapons(name,power,owner_id)
            VALUES(${name},${power},${owner})
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {
            console.log('error on create weapon:' + err.message)
            res.status(500).send(err)
        })
    },
    getFightersWeapons:(req,res) => {
        sequelize.query(`
            SELECT 
                fighters.id AS fighter_id,
                fighters.name AS fighter,
                fighters.power AS fighterpower,
                fighters.hp,
                fighters.type,
                weapons.id AS weapon_id,
                weapons.name AS weapon,
                weapons.power AS weapon_power
            FROM fighters
            JOIN weapons
            ON fighters.id = weapons.owner_id;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {
            console.log('error on get fighters weapons:' + err.message)
            res.status(500).send(err)
        })
    },
    deleteWeapon(req,res) {
        const {id} = req.params

        sequelize.query(`
            DELETE FROM weapons
            WHERE id = ${id}
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {
            console.log('error on get delete weapons:' + err.message)
            res.status(500).send(err)
        })
    },
    deleteFighter(req,res) {
        const {id} = req.params

        sequelize.query(`
            DELETE FROM fighters
            WHERE id = ${id}
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {
            console.log('error on get delete fighter:' + err.message)
            res.status(500).send(err)
        })
    }

}