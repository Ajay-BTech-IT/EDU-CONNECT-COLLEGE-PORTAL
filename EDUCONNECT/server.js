const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(bodyParser.json());
const { sendMarks } = require('./twilio');

//const { sendMarks } = require('./whatsapp'); // Updated import statement


const db = require('./database');
// Generate a secure secret key
const secretKey = crypto.randomBytes(64).toString('hex');
// Set up session middleware

// Set up session middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve HTML pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/staff', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'staff.html'));
});

app.get('/advisor', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'advisor.html'));
});

// Redirect to the login page for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM admin WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (row) {
            req.session.user = { username, userType: 'admin' };
            return res.json({ message: 'Admin Login Successful', userType: 'admin', redirectUrl: '/admin' });
        } else {
            db.get("SELECT * FROM staffs WHERE username = ? AND password = ?", [username, password], (err, row) => {
                if (err) {
                    return res.status(500).send(err.message);
                }

                if (row) {
                    req.session.user = { username, userType: 'staff' };
                    return res.json({ message: 'Staff Login Successful', userType: 'staff', redirectUrl: '/staff' });
                } else {
                    db.get("SELECT name, department, year, class FROM advisors WHERE username = ? AND password = ?", [username, password], (err, row) => {
                        if (err) {
                            return res.status(500).send(err.message);
                        }

                        if (row) {
                            req.session.user = { username, userType: 'advisor' };
                            return res.json({ message: 'Advisor Login Successful', userType: 'advisor', redirectUrl: '/advisor' });
                        } else {
                            return res.status(401).json({ message: 'Login Failed' });
                        }
                    });
                }
            });
        }
    });
});


// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Not Authenticated' });
    }
}
// Example of a protected route
app.get('/protected-route', isAuthenticated, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.session.user });
});

app.post('/add-student', (req, res) => {
    const { rollno, name, department, year, class: className, email, semester, whatsapp, language } = req.body;

    db.run(`
        INSERT INTO students (rollno, name, department, year, class, email, semester, whatsapp, language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [rollno, name, department, year, className, email, semester, whatsapp, language], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (language.toLowerCase() === 'bihar') {
            db.run(`
                INSERT INTO bihar_students (rollno, name, department, year, class, email, semester, whatsapp, language)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [rollno, name, department, year, className, email, semester, whatsapp, language], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                return res.json({ message: 'Student added successfully' });
            });
        } else {
            return res.json({ message: 'Student added successfully' });
        }
    });
});

// Student Upload Endpoint
app.post('/upload-students', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const insertPromises = xlData.map(student => {
        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO students (rollno, name, department, year, class, email, whatsapp, semester, language)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [student.rollno, student.name, student.department, student.year, student.class, student.email, student.whatsapp, student.semester, student.language], function(err) {
                if (err) {
                    return reject(err);
                }

                if (student.language.toLowerCase() === 'bihar') {
                    db.run(`
                        INSERT INTO bihar_students (rollno, name, department, year, class, email, whatsapp, semester, language)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [student.rollno, student.name, student.department, student.year, student.class, student.email, student.whatsapp, student.semester, student.language], function(err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve('Student added to both students and bihar_students tables');
                    });
                } else {
                    resolve('Student added to students table');
                }
            });
        });
    });

    Promise.all(insertPromises)
        .then(() => res.status(200).send('Students uploaded successfully'))
        .catch(error => res.status(500).send(error.message));
});



// Endpoint to add a single staff member
app.post('/add-staff', (req, res) => {
    const { staffid, name, department, year, class: className, subject, semester, username, password, mobile } = req.body;

    db.run(`
        INSERT INTO staffs (staffid, name, department, year, class, subject, semester, username, password, mobile)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [staffid, name, department, year, className, subject, semester, username, password, mobile], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send('Staff added successfully');
    });
});

// Endpoint to upload staff in bulk
app.post('/upload-staffs', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const insertPromises = xlData.map(staff => {
        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO staffs (staffid, name, department, year, class, subject, semester, username, password, mobile)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [staff.staffid, staff.name, staff.department, staff.year, staff.class, staff.subject, staff.semester, staff.username, staff.password, staff.mobile], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve('Staff inserted successfully');
            });
        });
    });

    Promise.all(insertPromises)
        .then(results => {
            res.status(200).send('Staffs uploaded successfully');
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});
// Endpoint to add a single advisor
app.post('/add-advisor', (req, res) => {
    const { advisorid, name, department, year, class: className, semester, username, password, mobile } = req.body;

    db.run(`
        INSERT INTO advisors (advisorid, name, department, year, class, semester, username, password, mobile)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [advisorid, name, department, year, className, semester, username, password, mobile], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send('Advisor added successfully');
    });
});

// Endpoint to upload advisors in bulk
app.post('/upload-advisors', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    const insertPromises = xlData.map(advisor => {
        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO advisors (advisorid, name, department, year, class, semester, username, password, mobile)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [advisor.advisorid, advisor.name, advisor.department, advisor.year, advisor.class, advisor.semester, advisor.username, advisor.password, advisor.mobile], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve('Advisor inserted successfully');
            });
        });
    });

    Promise.all(insertPromises)
        .then(results => {
            res.status(200).send('Advisors uploaded successfully');
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});
app.post('/add-admin', (req, res) => {
    const { name, department, year, mobile, username, password } = req.body;

    db.run(`
        INSERT INTO admin (name, department, year, mobile, username, password)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [name, department, year, mobile, username, password], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.status(200).send('Admin added successfully');
    });
});
// Endpoint to get student details by roll number (case-insensitive)
app.get('/get-student/:rollno', (req, res) => {
    const rollno = req.params.rollno.toLowerCase();

    db.get('SELECT * FROM students WHERE LOWER(rollno) = ?', [rollno], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).send('Student not found');
        }
    });
});
// Endpoint to update a student's details
// Endpoint to update a student's details
app.post('/update-student', (req, res) => {
    const { rollno, name, department, year, class: className, email, whatsapp, semester, language } = req.body;

    // Fetch the current language of the student
    db.get('SELECT language FROM students WHERE rollno = ?', [rollno], (err, student) => {
        if (err) {
            console.error('Error fetching current student language:', err.message);
            return res.status(500).send('Failed to fetch current student language');
        }

        if (!student) {
            return res.status(404).send('Student not found');
        }

        const currentLanguage = student.language.toLowerCase();

        const updateQuery = `
            UPDATE students
            SET name = ?, department = ?, year = ?, class = ?, email = ?, whatsapp = ?, semester = ?, language = ?
            WHERE rollno = ?
        `;

        db.run(updateQuery, [name, department, year, className, email, whatsapp, semester, language, rollno], function(err) {
            if (err) {
                console.error('Error updating student:', err.message);
                return res.status(500).send('Failed to update student');
            }

            // If the new language is "bihar", insert or update in bihar_students table
            if (language.toLowerCase() === 'bihar') {
                const biharQuery = `
                    INSERT INTO bihar_students (rollno, name, department, year, class, email, whatsapp, semester, language)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(rollno)
                    DO UPDATE SET name = excluded.name, department = excluded.department, year = excluded.year, class = excluded.class, email = excluded.email, whatsapp = excluded.whatsapp, semester = excluded.semester, language = excluded.language
                `;
                db.run(biharQuery, [rollno, name, department, year, className, email, whatsapp, semester, language], function(err) {
                    if (err) {
                        console.error('Error updating student in bihar_students table:', err.message);
                        return res.status(500).send('Failed to update student in bihar_students table');
                    }
                    res.status(200).send('Student updated successfully');
                });
            }
            // If the current language is "bihar" and updated to something else, remove from bihar_students table
            else if (currentLanguage === 'bihar' && language.toLowerCase() !== 'bihar') {
                const removeBiharQuery = 'DELETE FROM bihar_students WHERE rollno = ?';
                db.run(removeBiharQuery, [rollno], function(err) {
                    if (err) {
                        console.error('Error removing student from bihar_students table:', err.message);
                        return res.status(500).send('Failed to remove student from bihar_students table');
                    }
                    res.status(200).send('Student updated successfully');
                });
            } else {
                res.status(200).send('Student updated successfully');
            }
        });
    });
});

// Endpoint to filter students based on department, year, and class
app.get('/filter-students', (req, res) => {
    const { department, year, class: className } = req.query;
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];

    if (department) {
        query += ' AND LOWER(department) = ?';
        params.push(department.toLowerCase());
    }
    if (year) {
        query += ' AND LOWER(year) = ?';
        params.push(year.toLowerCase());
    }
    if (className) {
        query += ' AND LOWER(class) = ?';
        params.push(className.toLowerCase());
    }
    query += ' ORDER BY rollno ASC';
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send('Failed to filter students due to an internal error.');
        }

        res.status(200).json(rows);
    });
});

// Endpoint to update multiple students' details
app.post('/update-all-students', (req, res) => {
    const { updates } = req.body;

    const updatePromises = updates.map(studentData => {
        const { rollno, name, department, year, class: className, email, whatsapp, semester, language } = studentData;

        return new Promise((resolve, reject) => {
            // Fetch the current language of the student
            db.get('SELECT language FROM students WHERE rollno = ?', [rollno], (err, student) => {
                if (err) {
                    console.error('Error fetching current student language:', err.message);
                    return reject('Failed to fetch current student language');
                }

                if (!student) {
                    return resolve('Student not found');
                }

                const currentLanguage = student.language.toLowerCase();

                const updateQuery = `
                    UPDATE students
                    SET name = ?, department = ?, year = ?, class = ?, email = ?, whatsapp = ?, semester = ?, language = ?
                    WHERE rollno = ?
                `;

                db.run(updateQuery, [name, department, year, className, email, whatsapp, semester, language, rollno], function(err) {
                    if (err) {
                        console.error('Error updating student:', err.message);
                        return reject('Failed to update student');
                    }

                    // If the new language is "bihar", insert or update in bihar_students table
                    if (language.toLowerCase() === 'bihar') {
                        const biharQuery = `
                            INSERT INTO bihar_students (rollno, name, department, year, class, email, whatsapp, semester, language)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ON CONFLICT(rollno)
                            DO UPDATE SET name = excluded.name, department = excluded.department, year = excluded.year, class = excluded.class, email = excluded.email, whatsapp = excluded.whatsapp, semester = excluded.semester, language = excluded.language
                        `;
                        db.run(biharQuery, [rollno, name, department, year, className, email, whatsapp, semester, language], function(err) {
                            if (err) {
                                console.error('Error updating student in bihar_students table:', err.message);
                                return reject('Failed to update student in bihar_students table');
                            }
                            resolve('Student updated successfully');
                        });
                    }
                    // If the current language is "bihar" and updated to something else, remove from bihar_students table
                    else if (currentLanguage === 'bihar' && language.toLowerCase() !== 'bihar') {
                        const removeBiharQuery = 'DELETE FROM bihar_students WHERE rollno = ?';
                        db.run(removeBiharQuery, [rollno], function(err) {
                            if (err) {
                                console.error('Error removing student from bihar_students table:', err.message);
                                return reject('Failed to remove student from bihar_students table');
                            }
                            resolve('Student updated successfully');
                        });
                    } else {
                        resolve('Student updated successfully');
                    }
                });
            });
        });
    });

    Promise.all(updatePromises)
        .then(results => {
            res.status(200).send('All students updated successfully');
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//--------------------------------------------------------staffs
// Endpoint to get staff details by staff ID
app.get('/get-staff/:staffid', (req, res) => {
    const staffid = req.params.staffid.toLowerCase();

    db.get('SELECT * FROM staffs WHERE LOWER(staffid) = ?', [staffid], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).send('Staff not found');
        }
    });
});

// Endpoint to update staff details
app.post('/update-staff', (req, res) => {
    const { staffid, name, department, year, class: className, subject, semester, username, password, mobile } = req.body;

    db.run(`
        UPDATE staffs
        SET name = ?, department = ?, year = ?, class = ?, subject = ?, semester = ?, username = ?, password = ?, mobile = ?
        WHERE LOWER(staffid) = ?
    `, [name, department, year, className, subject, semester, username, password, mobile, staffid.toLowerCase()], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (this.changes === 0) {
            return res.status(404).send('Staff not found');
        }

        res.status(200).send('Staff updated successfully');
    });
});

// Endpoint to filter staff details
app.get('/filter-staff', (req, res) => {
    const { department, year, class: className } = req.query;
    let query = 'SELECT * FROM staffs WHERE 1=1';
    const params = [];

    if (department) {
        query += ' AND LOWER(department) = ?';
        params.push(department.toLowerCase());
    }
    if (year) {
        query += ' AND LOWER(year) = ?';
        params.push(year.toLowerCase());
    }
    if (className) {
        query += ' AND LOWER(class) = ?';
        params.push(className.toLowerCase());
    }
    query += ' ORDER BY staffid ASC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.status(200).json(rows);
    });
});

// Endpoint to update multiple staff members
app.post('/update-all-staff', (req, res) => {
    const { updates } = req.body;

    const updatePromises = updates.map(staffData => {
        const { staffid, name, department, year, class: className, subject, semester, username, password, mobile } = staffData;

        return new Promise((resolve, reject) => {
            db.run(`
                UPDATE staffs
                SET name = ?, department = ?, year = ?, class = ?, subject = ?, semester = ?, username = ?, password = ?, mobile = ?
                WHERE LOWER(staffid) = ?
            `, [name, department, year, className, subject, semester, username, password, mobile, staffid.toLowerCase()], function(err) {
                if (err) {
                    return reject(err);
                }

                if (this.changes === 0) {
                    return resolve('Staff not found');
                }

                resolve('Staff updated successfully');
            });
        });
    });

    Promise.all(updatePromises)
        .then(results => {
            res.status(200).send('All staff updated successfully');
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

//------------------advisor ednpoint
// Endpoint to get advisor details
app.get('/get-advisor/:advisorid', (req, res) => {
    const advisorid = req.params.advisorid;

    db.get('SELECT * FROM advisors WHERE LOWER(advisorid) = ?', [advisorid], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).send('Advisor not found');
        }
    });
});

// Endpoint to update advisor details
app.post('/update-advisor', (req, res) => {
    const { advisorid, name, department, year, class: className, semester, username, password, mobile } = req.body;

    db.run(`
        UPDATE advisors
        SET name = ?, department = ?, year = ?, class = ?, semester = ?, username = ?, password = ?, mobile = ?
        WHERE advisorid = ?
    `, [name, department, year, className, semester, username, password, mobile, advisorid], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (this.changes === 0) {
            return res.status(404).send('Advisor not found');
        }

        res.status(200).send('Advisor updated successfully');
    });
});


// Endpoint to filter advisor details
app.get('/filter-advisors', (req, res) => {
    const { department, year, class: className } = req.query;
    let query = 'SELECT * FROM advisors WHERE 1=1';
    const params = [];

    if (department) {
        query += ' AND LOWER(department) = ?';
        params.push(department.toLowerCase());
    }
    if (year) {
        query += ' AND LOWER(year) = ?';
        params.push(year.toLowerCase());
    }
    if (className) {
        query += ' AND LOWER(class) = ?';
        params.push(className.toLowerCase());
    }
    query += ' ORDER BY advisorid ASC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.status(200).json(rows);
    });
});

// Endpoint to update multiple advisors
app.post('/update-all-advisors', (req, res) => {
    const { updates } = req.body;

    const updatePromises = updates.map(advisorData => {
        const { advisorid, name, department, year, class: className, semester, username, password, mobile } = advisorData;

        return new Promise((resolve, reject) => {
            db.run(`
                UPDATE advisors
                SET name = ?, department = ?, year = ?, class = ?, semester = ?, username = ?, password = ?, mobile = ?
                WHERE advisorid = ?
            `, [name, department, year, className, semester, username, password, mobile, advisorid], function(err) {
                if (err) {
                    return reject(err);
                }

                if (this.changes === 0) {
                    return resolve('Advisor not found');
                }

                resolve('Advisor updated successfully');
            });
        });
    });

    Promise.all(updatePromises)
        .then(results => {
            res.status(200).send('All advisors updated successfully');
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

//-----------------------------------------admin
// Endpoint to filter admin details

// Endpoint to filter admins based on department and year (case-insensitive)
app.get('/filter-admins', (req, res) => {
    const { department, year } = req.query;
    console.log('Received filters:', { department, year }); // Debug log

    let query = 'SELECT * FROM admin WHERE 1=1';
    const params = [];

    if (department) {
        query += ' AND LOWER(department) = ?';
        params.push(department.toLowerCase());
    }
    if (year) {
        query += ' AND LOWER(year) = ?';
        params.push(year.toLowerCase());
    }

    console.log('Executing query:', query); // Debug log
    console.log('With parameters:', params); // Debug log

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err.message); // Debug log
            return res.status(500).send(err.message);
        }

        console.log('Query result:', rows); // Debug log
        res.status(200).json(rows);
    });
});

// Endpoint to update admin details
app.post('/update-admin', (req, res) => {
    const { username, name, department, year, mobile, password } = req.body;

    db.run(`
        UPDATE admin
        SET name = ?, department = ?, year = ?, mobile = ?, password = ?
        WHERE username = ?
    `, [name, department, year, mobile, password, username], function(err) {
        if (err) {
            return res.status(500).send('Failed to update admin due to an internal error.');
        }

        if (this.changes === 0) {
            return res.status(404).send('Admin not found');
        }

        res.status(200).send('Admin updated successfully');
    });
});

// Endpoint to update multiple admins
app.post('/update-all-admins', (req, res) => {
    const { updates } = req.body;

    const updatePromises = updates.map(adminData => {
        const { username, name, department, year, mobile, password } = adminData;

        return new Promise((resolve, reject) => {
            db.run(`
                UPDATE admin
                SET name = ?, department = ?, year = ?, mobile = ?, password = ?
                WHERE username = ?
            `, [name, department, year, mobile, password, username], function(err) {
                if (err) {
                    return reject('Failed to update admin due to an internal error.');
                }

                if (this.changes === 0) {
                    return resolve('Admin not found');
                }

                resolve('Admin updated successfully');
            });
        });
    });

    Promise.all(updatePromises)
        .then(results => {
            res.status(200).send('All admins updated successfully');
        })
        .catch(error => {
            res.status(500).send('Failed to update some admins due to internal errors.');
        });
});

//-----------remove students-------------
// Endpoint to get student details

app.delete('/remove-student/:rollno', (req, res) => {
    const { rollno } = req.params;

    db.run(`DELETE FROM marks WHERE rollno = ?`, [rollno], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    db.run(`DELETE FROM bihar_students WHERE rollno = ?`, [rollno], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    db.run(`DELETE FROM students WHERE rollno = ?`, [rollno], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student and their marks removed successfully' });
    });
});



app.get('/get-student/:rollno', (req, res) => {
    const { rollno } = req.params;

    db.get('SELECT * FROM students WHERE rollno = ?', [rollno], (err, student) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        return res.json(student);
    });
});

app.get('/filter-students', (req, res) => {
    const { department, year, class: className } = req.query;
    const query = `
        SELECT * FROM students 
        WHERE department LIKE ? AND year LIKE ? AND class LIKE ?
    `;
    const params = [`%${department}%`, `%${year}%`, `%${className}%`];

    db.all(query, params, (err, students) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json(students);
    });
});
app.delete('/remove-all-students', (req, res) => {
    const { rollNos } = req.body;

    const deletePromises = rollNos.map(rollno => {
        return new Promise((resolve, reject) => {
            db.get('SELECT language FROM students WHERE LOWER(rollno) = ?', [rollno.toLowerCase()], (err, student) => {
                if (err) {
                    return reject('Failed to fetch student details');
                }

                if (!student) {
                    return resolve('Student not found');
                }

                const isBihar = student.language.toLowerCase() === 'bihar';

                // Delete from students table
                db.run('DELETE FROM students WHERE LOWER(rollno) = ?', [rollno.toLowerCase()], function(err) {
                    if (err) {
                        return reject('Failed to remove student');
                    }

                    // Delete from marks table
                    db.run('DELETE FROM marks WHERE LOWER(rollno) = ?', [rollno.toLowerCase()], function(err) {
                        if (err) {
                            return reject('Failed to remove marks');
                        }

                        if (isBihar) {
                            // Delete from bihar_students table if the student is from Bihar
                            db.run('DELETE FROM bihar_students WHERE LOWER(rollno) = ?', [rollno.toLowerCase()], function(err) {
                                if (err) {
                                    return reject('Failed to remove student from bihar_students table');
                                }

                                resolve('Student and their marks table removed successfully');
                            });
                        } else {
                            resolve('Student and their marks table removed successfully');
                        }
                    });
                });
            });
        });
    });

    Promise.all(deletePromises)
        .then(results => {
            res.status(200).send('All selected students removed successfully');
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

//remove staffs-----------
// Endpoint to get staff details
app.get('/get-staff/:staffid', (req, res) => {
    const staffid = req.params.staffid.toLowerCase();

    db.get('SELECT subject FROM staffs WHERE LOWER(staffid) = ?', [staffid], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).send('Staff not found');
        }
    });
});

// Endpoint to filter staff details
app.get('/filter-staff', (req, res) => {
    const { department, year, class: className } = req.query;
    let query = 'SELECT * FROM staffs WHERE 1=1';
    const params = [];

    if (department) {
        query += ' AND LOWER(department) = ?';
        params.push(department.toLowerCase());
    }
    if (year) {
        query += ' AND LOWER(year) = ?';
        params.push(year.toLowerCase());
    }
    if (className) {
        query += ' AND LOWER(class) = ?';
        params.push(className.toLowerCase());
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.status(200).json(rows);
    });
});

// Endpoint to remove a staff member
app.delete('/remove-staff/:staffid', (req, res) => {
    const staffid = req.params.staffid.toLowerCase();

    db.run('DELETE FROM staffs WHERE LOWER(staffid) = ?', [staffid], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (this.changes === 0) {
            return res.status(404).send('Staff not found');
        }

        res.status(200).send('Staff removed successfully');
    });
});

// Endpoint to remove multiple staff members
app.delete('/remove-all-staff', (req, res) => {
    const { staffIds } = req.body;

    const deletePromises = staffIds.map(staffid => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM staffs WHERE LOWER(staffid) = ?', [staffid.toLowerCase()], function(err) {
                if (err) {
                    return reject(err);
                }

                if (this.changes === 0) {
                    return resolve('Staff not found');
                }

                resolve('Staff removed successfully');
            });
        });
    });

    Promise.all(deletePromises)
        .then(results => {
            res.status(200).send('All selected staff removed successfully');
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

//----------------------remove advisors


// Endpoint to remove an advisor by advisor ID
app.delete('/remove-advisor/:advisorid', (req, res) => {
    const advisorid = req.params.advisorid.toLowerCase();

    db.run('DELETE FROM advisors WHERE LOWER(advisorid) = ?', [advisorid], function(err) {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (this.changes === 0) {
            return res.status(404).send('Advisor not found');
        }

        res.status(200).send('Advisor removed successfully');
    });
});



// Endpoint to remove multiple advisors
app.delete('/remove-all-advisors', (req, res) => {
    const { advisorIds } = req.body;

    const deletePromises = advisorIds.map(advisorid => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM advisors WHERE LOWER(advisorid) = ?', [advisorid.toLowerCase()], function(err) {
                if (err) {
                    return reject(err);
                }

                if (this.changes === 0) {
                    return resolve('Advisor not found');
                }

                resolve('Advisor removed successfully');
            });
        });
    });

    Promise.all(deletePromises)
        .then(results => {
            res.status(200).send('All selected advisors removed successfully');
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

//remove ---admins

// Endpoint to filter admins based on department and year (case-insensitive)
app.get('/filter-admins', (req, res) => {
    const { department, year } = req.query;
    let query = 'SELECT * FROM admin WHERE 1=1'; // Make sure the table name is correct
    const params = [];

    if (department) {
        query += ' AND LOWER(department) = ?';
        params.push(department.toLowerCase());
    }
    if (year) {
        query += ' AND LOWER(year) = ?';
        params.push(year.toLowerCase());
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        res.status(200).json(rows);
    });
});

// Endpoint to remove admin by username
app.delete('/remove-admin/:username', (req, res) => {
    const username = req.params.username;

    db.run('DELETE FROM admin WHERE username = ?', [username], function(err) {
        if (err) {
            return res.status(500).send('Failed to remove admin due to an internal error.');
        }

        if (this.changes === 0) {
            return res.status(404).send('Admin not found');
        }

        res.status(200).send('Admin removed successfully');
    });
});

// Endpoint to remove multiple admins by username
app.delete('/remove-all-admins', (req, res) => {
    const { usernames } = req.body;

    const deletePromises = usernames.map(username => {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM admin WHERE username = ?', [username], function(err) {
                if (err) {
                    return reject('Failed to remove admin due to an internal error.');
                }

                if (this.changes === 0) {
                    return resolve('Admin not found');
                }

                resolve('Admin removed successfully');
            });
        });
    });

    Promise.all(deletePromises)
        .then(results => {
            res.status(200).send('All selected admins removed successfully');
        })
        .catch(error => {
            res.status(500).send('Failed to remove some admins due to internal errors.');
        });
});
//staff----------------------------page
app.get('/staff-info', isAuthenticated, (req, res) => {
    const username = req.session.user.username; // Assuming session management is in place
    db.get('SELECT name, department, year, class, subject FROM staffs WHERE username = ?', [username], (err, staff) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!staff) {
            return res.status(404).send('Staff details not found');
        }
        res.json(staff);
    });
});
app.get('/students', isAuthenticated, (req, res) => {
    const username = req.session.user.username; // Assuming session management is in place
    db.get('SELECT department, year, class, semester, subject FROM staffs WHERE username = ?', [username], (err, staff) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!staff) {
            return res.status(404).send('Staff details not found');
        }

        const { department, year, class: className, semester, subject } = staff;

        db.all(`
            SELECT students.rollno, students.name, students.semester, marks.cat1, marks.cat2, marks.cat3, marks.model
            FROM students
            LEFT JOIN marks ON students.rollno = marks.rollno AND marks.subject = ? AND marks.semester = ?
            WHERE students.department = ? AND students.year = ? AND students.class = ? AND students.semester = ?
            ORDER BY students.rollno ASC
        `, [subject, semester, department, year, className, semester], (err, students) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json(students);
        });
    });
});
app.post('/save-marks', isAuthenticated, (req, res) => {
    const { rollno, cat1, cat2, cat3, model, semester } = req.body;

    db.get('SELECT department, year, class FROM students WHERE rollno = ?', [rollno], (err, student) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!student) {
            return res.status(404).send('Student details not found');
        }

        const { department, year, class: className } = student;
        const username = req.session.user.username; // Assuming session management is in place

        db.get('SELECT name, subject FROM staffs WHERE username = ?', [username], (err, staff) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (!staff) {
                return res.status(404).send('Staff details not found');
            }

            const { name: staffName, subject } = staff;

            db.run(`
                INSERT INTO marks (rollno, name, subject, cat1, cat2, cat3, model, semester, staff, department, year, class)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(rollno, subject, semester)
                DO UPDATE SET cat1 = COALESCE(EXCLUDED.cat1, cat1), cat2 = COALESCE(EXCLUDED.cat2, cat2), cat3 = COALESCE(EXCLUDED.cat3, cat3), model = COALESCE(EXCLUDED.model, model)
            `, [
                rollno,
                req.body.name, // Assuming student's name is sent in the request body
                subject,
                cat1 || '',
                cat2 || '',
                cat3 || '',
                model || '',
                semester,
                staffName,
                department,
                year,
                className
            ], function(err) {
                if (err) {
                    console.error('Error executing SQL query:', err.message);
                    return res.status(500).send('Failed to save marks due to an internal error.');
                }

                res.status(200).send('Marks saved successfully');
            });
        });
    });
});


// Save All Marks Endpoint
app.post('/save-all-marks', isAuthenticated, (req, res) => {
    const { updates } = req.body;
    const username = req.session.user.username; // Assuming session management is in place

    db.get('SELECT name, department, year, class, subject FROM staffs WHERE username = ?', [username], (err, staff) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!staff) {
            return res.status(404).send('Staff details not found');
        }

        const { name: staffName, department, year, class: className, subject } = staff;

        const updatePromises = updates.map(marks => {
            const { rollno, cat1, cat2, cat3, model, semester } = marks;

            return new Promise((resolve, reject) => {
                db.get('SELECT name FROM students WHERE rollno = ?', [rollno], (err, student) => {
                    if (err) {
                        return reject(err.message);
                    }
                    if (!student) {
                        return reject('Student details not found');
                    }

                    const { name: studentName } = student;

                    db.run(`
                        INSERT INTO marks (rollno, name, subject, cat1, cat2, cat3, model, semester, staff, department, year, class)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ON CONFLICT(rollno, subject, semester)
                        DO UPDATE SET cat1 = COALESCE(EXCLUDED.cat1, cat1), cat2 = COALESCE(EXCLUDED.cat2, cat2), cat3 = COALESCE(EXCLUDED.cat3, cat3), model = COALESCE(EXCLUDED.model, model)
                    `, [
                        rollno,
                        studentName,
                        subject,
                        cat1 || '',
                        cat2 || '',
                        cat3 || '',
                        model || '',
                        semester,
                        staffName,
                        department,
                        year,
                        className
                    ], function(err) {
                        if (err) {
                            return reject('Failed to save marks due to an internal error.');
                        }

                        resolve();
                    });
                });
            });
        });

        Promise.all(updatePromises)
            .then(() => res.status(200).send('All marks saved successfully'))
            .catch(error => res.status(500).send(error));
    });
});
///advisor page

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.status(401).send('Not authenticated');
    }
}
/*app.get('/getAdvisorDetails', isAuthenticated, (req, res) => {
    const username = req.session.user.username; // Assuming session management is in place
    db.get('SELECT name, department, year, class FROM advisors WHERE username = ?', [username], (err, advisor) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!advisor) {
            return res.status(404).send('Advisor details not found');
        }
        res.json(advisor);
    });
}); 
*/
app.get('/getAdvisorDetails', isAuthenticated, (req, res) => {
    const username = req.session.user.username; // Assuming session management is in place
    db.get('SELECT name, department, year, class, mobile FROM advisors WHERE username = ?', [username], (err, advisor) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!advisor) {
            return res.status(404).send('Advisor details not found');
        }
        res.json(advisor);
    });
});

app.get('/getStudents', isAuthenticated, (req, res) => {
    const username = req.session.user.username; // Assuming session management is in place
    db.get('SELECT department, year, class FROM advisors WHERE username = ?', [username], (err, advisor) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!advisor) {
            return res.status(404).send('Advisor details not found');
        }

        const { department, year, class: className } = advisor;

        db.all(`
            SELECT rollno, name, semester, whatsapp, email
            FROM students
            WHERE department = ? AND year = ? AND class = ?
            ORDER BY rollno ASC
        `, [department, year, className], (err, students) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            res.json(students);
        });
    });
});
app.get('/getStudentDetails/:rollno', isAuthenticated, (req, res) => {
    const { rollno } = req.params;
    db.get('SELECT * FROM students WHERE rollno = ?', [rollno], (err, student) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!student) {
            return res.status(404).send('Student details not found');
        }
        res.json(student);
    });
});

/*app.get('/getStudentMarks/:rollno', isAuthenticated, (req, res) => {
    const { rollno } = req.params;
    db.all(`
        SELECT subject, cat1, cat2, cat3, model, semester 
        FROM marks 
        WHERE rollno = ?`, 
        [rollno], 
        (err, marks) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (marks.length === 0) {
                return res.status(404).send('No marks found for this student');
            }
            res.json(marks);
        });
});
*/
app.get('/getStudentMarks/:rollno', isAuthenticated, (req, res) => {
    const { rollno } = req.params;
    db.all(`
        SELECT subject, cat1, cat2, cat3, model, semester 
        FROM marks 
        WHERE rollno = ? AND semester = (
            SELECT semester FROM students WHERE rollno = ?
        )`, [rollno, rollno],
        (err, marks) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (marks.length === 0) {
                return res.status(404).send('No marks found for this student');
            }
            res.json(marks);
        });
});

// Endpoint to send marks via WhatsApp and SMS
/*app.post('/sendMarks', isAuthenticated, (req, res) => {
    const { student, advisor, examType, marks } = req.body;

    if (!marks || marks.length === 0) {
        return res.status(400).send('Marks data is missing or empty');
    }

    sendMarks(student, advisor, examType, marks);
    res.json({ success: true, message: 'Marks sent successfully' });
}); */
app.post('/sendMarks', isAuthenticated, (req, res) => {
    const { student, advisor, examType, marks } = req.body;

    if (!marks || marks.length === 0) {
        return res.status(400).send('Marks data is missing or empty');
    }

    sendMarks(student, advisor, examType, marks)
        .then(() => {
            res.json({ success: true, message: 'Marks sent successfully' });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: 'Error sending marks', error: error.message });
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});