var sqlite3 = require('sqlite3').verbose();

class UserDB {

    static initialize() {
        this.db.serialize(() => {
            this.db.run('CREATE TABLE Users (id INTEGER PRIMARY KEY, fname TEXT NOT NULL, lname TEXT NOT NULL, email TEXT NOT NULL, thumbnail TEXT);');
            this.db.run('INSERT INTO Users (fname, lname, email, thumbnail) VALUES ("George", "Washington", "george@washington.com", "america.jpg");');
            this.db.run('INSERT INTO Users (fname, lname, email, thumbnail) VALUES ("John", "Adams", "john@adams.com", "america.jpg");');
            this.db.run('INSERT INTO Users (fname, lname, email, thumbnail) VALUES ("Thomas", "Jefferson", "thomas@jefferson.com", "america.jpg");');
        });
    }

    static all() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * from Users', (err, rows) => {
                resolve(rows);
            });
        });
    }

    // Notice that there is *a lot* of error handling missing here.
    static find(id) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * from Users where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    console.log("resolving");
                    resolve(rows[0]);
                } else {
                    console.log("rejecting");
                    reject(`User with Id ${id} not found`);
                }
            });
        });
    }

    static create(user) {
        let sql = `INSERT INTO Users (fname, lname, email, thumbnail) VALUES ("${user.fname}", "${user.lname}", "${user.email}", "${user.thumbnail}");`;
        return new Promise((resolve, reject) => {
            console.log('The sql: ');
            console.log(sql);

            this.db.run(sql, function (err, rows) {
                console.log("This: ");
                console.log(this);
                if (err) {
                    console.log('Create Error');
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ id: this.lastID, ...user })
                }
            });
        })
    }

    static update(user) {
        let sql = `UPDATE Users SET fname="${user.fname}", lname="${user.lname}", email="${user.email}, thumbnail="${user.thumbnail}" WHERE id="${user.id}"`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, function (err, rows) {
                if (err) {
                    console.log('Update Error');
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    }

    static delete(user) {
        let sql = `DELETE from Users WHERE id="${user.id}"`;
        return new Promise((resolve, reject) => {
            this.db.run(sql, function (err, rows) {
                if (err) {
                    console.log('Delete Error');
                    console.log(err);
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    } // end delete
} // end UserDB

UserDB.db = new sqlite3.Database('blog.sqlite');

module.exports = UserDB;