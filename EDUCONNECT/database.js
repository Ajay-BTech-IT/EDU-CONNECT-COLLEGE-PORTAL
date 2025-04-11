const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('college_datas.db');

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            rollno TEXT PRIMARY KEY,
            name TEXT,
            department TEXT,
            year INTEGER,
            class TEXT,
            email TEXT,
            semester TEXT,
            whatsapp TEXT,
            language TEXT,
            UNIQUE(rollno, email)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS bihar_students (
            rollno TEXT PRIMARY KEY,
            name TEXT,
            department TEXT,
            year INTEGER,
            class TEXT,
            email TEXT,
            semester TEXT,
            whatsapp TEXT,
            language TEXT,
            UNIQUE(rollno, email)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS staffs (
            staffid TEXT PRIMARY KEY,
            name TEXT,
            department TEXT,
            year INTEGER,
            class TEXT,
            subject TEXT,
            semester INTEGER,
            username TEXT,
            password TEXT,
            mobile TEXT,
            UNIQUE(username)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS advisors (
            advisorid TEXT PRIMARY KEY,
            name TEXT,
            department TEXT,
            year INTEGER,
            class TEXT,
            semester INTEGER,
            username TEXT,
            password TEXT,
            mobile TEXT,
            UNIQUE(username)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS admin (
            name TEXT PRIMARY KEY,
            department TEXT,
            year TEXT,
            mobile TEXT,
            username TEXT,
            password TEXT,
            UNIQUE(username)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS marks (
            rollno TEXT,
            name TEXT,
            subject TEXT,
            cat1 TEXT,
            cat2 TEXT,
            cat3 TEXT,
            model TEXT,
            semester INTEGER,
            staff TEXT,
            department TEXT,
            year INTEGER,
            class TEXT,
            PRIMARY KEY (rollno, subject, semester),
            FOREIGN KEY(rollno) REFERENCES students(rollno)
        )
    `);

    // Insert default admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'password123';

    db.get('SELECT COUNT(*) AS count FROM admin WHERE username = ?', [adminUsername], (err, row) => {
        if (err) {
            console.error(err.message);
        } else if (row.count === 0) {
            db.run(`
                INSERT INTO admin (name, department, year, mobile, username, password)
                VALUES ('Default Admin', 'Administration', 'III', '1234567890', ?, ?)
            `, [adminUsername, adminPassword], function (err) {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('Default admin credentials inserted.');
                }
            });
        } else {
            console.log('Admin credentials are already stored.');
        }
    });
});


module.exports = db;
