document.addEventListener("DOMContentLoaded", function () {
    const initialPanelHtml = `
        <div class="right-panel-header">
            <div style="text-align: center; background-color: #fef9c3; color: #2c3e50; padding: 20px;">
                <h1 style="font-size: 40px; margin: 0;">ERODE</h1>
                <h3 style="font-size: 20px; margin: 0;">SENGUNTHAR</h3>
                <h1 style="font-size: 40px; margin: 0;">ENGINEERING</h1>
                <h3 style="font-size: 20px; margin: 0;">COLLEGE</h3>
                <p style="margin: 0;">-Perundurai, Erode</p>
            </div>
        </div>
        <div class="right-panel-footer" style="position: fixed; bottom: 0; width: 100%; text-align: center; background-color: #fef9c3; color: #2c3e50; padding: 10px;">
            <p>&copy; Copyrights reserved ESEC</p>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = initialPanelHtml;
});

function showAddStudentForm() {
    const formHtml = `
        <h3>Add Student</h3>
        <div>
            <form id="add-student-form" onsubmit="addStudent(event)">
                <label for="rollno">Roll No:</label>
                <input type="text" id="rollno" name="rollno" required>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" required>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" required>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" required>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" required>
                <label for="whatsapp">Whatsapp:</label>
                <input type="text" id="whatsapp" name="whatsapp" required>
                <label for="language">Language:</label>
                <input type="text" id="language" name="language" required>
                <button type="submit">Add</button>
                <button type="button" class="bulk-upload-button" onclick="showBulkUploadForm()">Add Bulk</button>
            </form>
        </div>
        <div id="bulk-upload" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeBulkUploadForm()">&times;</span>
                <h4>Bulk Upload Students</h4>
                <p>Please upload an .xls file in this format: rollno || name || department || year || class || email || semester || WhatsApp || language</p>
                <input type="file" id="bulk-file" accept=".xls">
                <button onclick="uploadBulkFile()">Upload</button>
            </div>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function addStudent(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch('/add-student', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Student added successfully');
        event.target.reset();
    } else {
        alert('Failed to add student or Rollno already exists');
    }
}

async function showBulkUploadForm() {
    document.getElementById('bulk-upload').style.display = 'block';
}

async function closeBulkUploadForm() {
    document.getElementById('bulk-upload').style.display = 'none';
}

async function uploadBulkFile() {
    const fileInput = document.getElementById('bulk-file');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/upload-students', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Students uploaded successfully');
    } else {
        alert('Failed to upload students');
    }

    closeBulkUploadForm();
}

async function showAddStaffForm() {
    const formHtml = `
        <h3>Add Staff</h3>
        <div>
            <form id="add-staff-form" onsubmit="addStaff(event)">
                <label for="staffid">Staff ID:</label>
                <input type="text" id="staffid" name="staffid" required>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" required>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" required>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" required>
                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject" required>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" required>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="text" id="password" name="password" required>
                <label for="mobile">Mobile:</label>
                <input type="text" id="mobile" name="mobile" required>
                <button type="submit">Add</button>
                <button type="button" class="bulk-upload-button" onclick="showBulkUploadForm()">Add Bulk</button>
            </form>
          
        </div>
        <div id="bulk-upload" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeBulkUploadForm()">&times;</span>
                <h4>Bulk Upload Staff</h4>
                <p>Please upload an .xls file in this format: staffid || name || department || year || class || subject || semester || username || password || mobile</p>
                <input type="file" id="bulk-file" accept=".xls">
                <button onclick="uploadBulkFiles()">Upload</button>
            </div>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function addStaff(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch('/add-staff', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Staff added successfully');
        event.target.reset();
    } else {
        alert('Failed to add staff');
    }
}

async function showBulkUploadForm() {
    document.getElementById('bulk-upload').style.display = 'block';
}

async function closeBulkUploadForm() {
    document.getElementById('bulk-upload').style.display = 'none';
}

async function uploadBulkFiles() {
    const fileInput = document.getElementById('bulk-file');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/upload-staffs', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Staffs uploaded successfully');
    } else {
        alert('Failed to upload staffs');
    }

    closeBulkUploadForm();
}
async function showAddAdvisorForm() {
    const formHtml = `
        <h3>Add Advisor</h3>
        <div>
            <form id="add-advisor-form" onsubmit="addAdvisor(event)">
                <label for="advisorid">Advisor ID:</label>
                <input type="text" id="advisorid" name="advisorid" required>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" required>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" required>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" required>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" required>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="text" id="password" name="password" required>
                <label for="mobile">Mobile:</label>
                <input type="text" id="mobile" name="mobile" required>
                <button type="submit">Add</button>
                <button type="button" class="bulk-upload-button" onclick="showBulkUploadForm()">Add Bulk</button>
            </form>
           
        </div>
        <div id="bulk-upload" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeBulkUploadForm()">&times;</span>
                <h4>Bulk Upload Advisors</h4>
                <p>Please upload an .xls file in this format: advisorid || name || department || year || class || semester || username || password || mobile</p>
                <input type="file" id="bulk-file" accept=".xls">
                <button onclick="uploadBulkFiless()">Upload</button>
            </div>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function addAdvisor(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const response = await fetch('/add-advisor', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        alert('Advisor added successfully');
        event.target.reset();
    } else {
        alert('Failed to add advisor');
    }
}

async function showBulkUploadForm() {
    document.getElementById('bulk-upload').style.display = 'block';
}

async function closeBulkUploadForm() {
    document.getElementById('bulk-upload').style.display = 'none';
}

async function uploadBulkFiless() {
    const fileInput = document.getElementById('bulk-file');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/upload-advisors', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Advisors uploaded successfully');
    } else {
        alert('Failed to upload advisors');
    }

    closeBulkUploadForm();
}
async function showAddAdminForm() {
    const formHtml = `
        <h3>Add Admin</h3>
        <form id="add-admin-form" onsubmit="addAdmin(event)">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <label for="department">Department:</label>
            <input type="text" id="department" name="department" required>
            <label for="year">Year:</label>
            <input type="text" id="year" name="year" required>
            <label for="mobile">Mobile:</label>
            <input type="text" id="mobile" name="mobile" required>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Submit</button>
        </form>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function addAdmin(event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById('add-admin-form'));

    const adminData = {
        name: formData.get('name'),
        department: formData.get('department'),
        year: formData.get('year'),
        mobile: formData.get('mobile'),
        username: formData.get('username'),
        password: formData.get('password')
    };

    const response = await fetch('/add-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
    });

    if (response.ok) {
        alert('Admin added successfully');
    } else {
        alert('Failed to add admin');
    }
}
///update----------------
async function showUpdateStudentForm() {
    const formHtml = `
        <h3>Update Student</h3>
        <div>
            <form id="fetch-student-form" onsubmit="fetchStudentByRollNo(event)">
                <label for="rollno">Roll No:</label>
                <input type="text" id="rollno" name="rollno">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="student-details" style="display:none;">
            <form id="edit-student-form" onsubmit="editStudent(event)">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" required>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" required>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" required>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <label for="whatsapp">Whatsapp:</label>
                <input type="text" id="whatsapp" name="whatsapp" required>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" required>
                <label for="language">Language:</label>
                <input type="text" id="language" name="language" required>
                <button type="submit">Update</button>
            </form>
        </div>
        <div>
            <form id="filter-student-form" onsubmit="filterStudentsForUpdate(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <label for="filter-class">Class:</label>
                <input type="text" id="filter-class" name="class">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="students-table" style="display:none;">
            <table id="students-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="updateAllStudents()">Update All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function fetchStudentByRollNo(event) {
    event.preventDefault();
    const rollno = document.getElementById('rollno').value;

    const response = await fetch(`/get-student/${rollno}`);
    if (response.ok) {
        const student = await response.json();
        document.getElementById('student-details').style.display = 'block';
        document.getElementById('name').value = student.name;
        document.getElementById('department').value = student.department;
        document.getElementById('year').value = student.year;
        document.getElementById('class').value = student.class;
        document.getElementById('email').value = student.email;
        document.getElementById('whatsapp').value = student.whatsapp;
        document.getElementById('semester').value = student.semester;
        document.getElementById('language').value = student.language;
        document.getElementById('students-table').style.display = 'none'; // Hide the students table
    } else {
        alert('Student not found');
    }
}

async function filterStudentsForUpdate(event) {
    event.preventDefault();
    document.getElementById('student-details').style.display = 'none'; // Hide the student details form
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();
    const className = document.getElementById('filter-class').value.trim();

    const response = await fetch(`/filter-students?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&class=${encodeURIComponent(className)}`);
    if (response.ok) {
        const students = await response.json();
        if (students.length === 0) {
            alert('No students found');
            return;
        }
        const tableContent = document.getElementById('students-table-content');
        tableContent.innerHTML = `
            <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Class</th>
                <th>Email</th>
                <th>Whatsapp</th>
                <th>Semester</th>
                <th>Language</th>
                <th>Action</th>
            </tr>
        `;
        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.rollno}</td>
                    <td><input type="text" value="${student.name}" data-rollno="${student.rollno}" data-field="name"></td>
                    <td><input type="text" value="${student.department}" data-rollno="${student.rollno}" data-field="department"></td>
                    <td><input type="text" value="${student.year}" data-rollno="${student.rollno}" data-field="year"></td>
                    <td><input type="text" value="${student.class}" data-rollno="${student.rollno}" data-field="class"></td>
                    <td><input type="email" value="${student.email}" data-rollno="${student.rollno}" data-field="email"></td>
                    <td><input type="text" value="${student.whatsapp}" data-rollno="${student.rollno}" data-field="whatsapp"></td>
                    <td><input type="text" value="${student.semester}" data-rollno="${student.rollno}" data-field="semester"></td>
                    <td><input type="text" value="${student.language}" data-rollno="${student.rollno}" data-field="language"></td>
                    <td><button class="update-button" onclick="updateStudentInTable('${student.rollno}')">Update</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('students-table').style.display = 'block';
        document.getElementById('fetch-student-form').reset(); // Clear rollno form
    } else {
        alert('No students found');
    }
}

async function editStudent(event) {
    event.preventDefault();
    const rollno = document.getElementById('rollno').value;
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const year = document.getElementById('year').value;
    const className = document.getElementById('class').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const semester = document.getElementById('semester').value;
    const language = document.getElementById('language').value;

    const studentData = {
        rollno,
        name,
        department,
        year,
        class: className,
        email,
        whatsapp,
        semester,
        language
    };

    const response = await fetch('/update-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    });

    if (response.ok) {
        alert('Student updated successfully');
        // Keep the form visible and updated with the latest details
        document.getElementById('student-details').style.display = 'block';
    } else {
        alert('Failed to update student');
    }
}


async function updateStudentInTable(rollno) {
    const inputs = document.querySelectorAll(`input[data-rollno="${rollno}"]`);
    const studentData = {};

    inputs.forEach(input => {
        studentData[input.dataset.field] = input.value;
    });

    studentData.rollno = rollno;

    const response = await fetch('/update-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
    });

    if (response.ok) {
        alert('Student updated successfully');
    } else {
        alert('Failed to update student');
    }
}

async function updateAllStudents() {
    const rows = document.querySelectorAll('#students-table-content tr');
    const updates = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[data-rollno]');
        if (inputs.length > 0) {
            const studentData = {};

            inputs.forEach(input => {
                studentData[input.dataset.field] = input.value;
            });

            studentData.rollno = inputs[0].dataset.rollno;
            updates.push(studentData);
        }
    });

    const response = await fetch('/update-all-students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
    });

    if (response.ok) {
        alert('All students updated successfully');
    } else {
        alert('Failed to update students');
    }
}

//staff

async function showUpdateStaffForm() {
    const formHtml = `
        <h3>Update Staff</h3>
        <div>
            <form id="fetch-staff-form" onsubmit="fetchStaffById(event)">
                <label for="staffid">Staff ID:</label>
                <input type="text" id="staffid" name="staffid">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="staff-details" style="display:none;">
            <form id="edit-staff-form" onsubmit="editStaff(event)">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" required>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" required>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" required>
                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject" required>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" required>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="text" id="password" name="password" required>
                <label for="mobile">Mobile:</label>
                <input type="text" id="mobile" name="mobile" required>
                <button type="submit" onclick="document.getElementById('password').type='password';">Update</button>
            </form>
        </div>
        <div>
            <form id="filter-staff-form" onsubmit="filterStaffForUpdate(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <label for="filter-class">Class:</label>
                <input type="text" id="filter-class" name="class">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="staff-table" style="display:none;">
            <table id="staff-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="updateAllSelectedStaff()">Update All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function fetchStaffById(event) {
    event.preventDefault();
    const staffid = document.getElementById('staffid').value;

    const response = await fetch(`/get-staff/${staffid}`);
    if (response.ok) {
        const staff = await response.json();
        document.getElementById('staff-details').style.display = 'block';
        document.getElementById('name').value = staff.name;
        document.getElementById('department').value = staff.department;
        document.getElementById('year').value = staff.year;
        document.getElementById('class').value = staff.class;
        document.getElementById('subject').value = staff.subject; // Ensure this line is present
        document.getElementById('semester').value = staff.semester;
        document.getElementById('username').value = staff.username;
        document.getElementById('password').type = 'text'; // Change the input type to text for display
        document.getElementById('password').value = staff.password; // Ensure this line is present
        document.getElementById('mobile').value = staff.mobile;
    } else {
        alert('Staff not found');
    }
}

async function editStaff(event) {
    event.preventDefault();
    const staffid = document.getElementById('staffid').value;
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const year = document.getElementById('year').value;
    const className = document.getElementById('class').value;
    const subject = document.getElementById('subject').value;
    const semester = document.getElementById('semester').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mobile = document.getElementById('mobile').value;

    const staffData = {
        staffid,
        name,
        department,
        year,
        class: className,
        subject,
        semester,
        username,
        password,
        mobile
    };

    const response = await fetch('/update-staff', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffData)
    });

    if (response.ok) {
        alert('Staff updated successfully');
        document.getElementById('staff-details').style.display = 'none';
    } else {
        alert('Failed to update staff');
    }
}

async function filterStaffForUpdate(event) {
    event.preventDefault();
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();
    const className = document.getElementById('filter-class').value.trim();

    const response = await fetch(`/filter-staff?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&class=${encodeURIComponent(className)}`);
    if (response.ok) {
        const staffList = await response.json();
        if (staffList.length === 0) {
            alert('No staff found');
            return;
        }
        const tableContent = document.getElementById('staff-table-content');
        tableContent.innerHTML = `
            <tr>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Semester</th>
                <th>Username</th>
                <th>Password</th>
                <th>Mobile</th>
                <th>Action</th>
            </tr>
        `;
        staffList.forEach(staff => {
            const row = `
                <tr>
                    <td>${staff.staffid}</td>
                    <td><input type="text" value="${staff.name}" data-staffid="${staff.staffid}" data-field="name"></td>
                    <td><input type="text" value="${staff.department}" data-staffid="${staff.staffid}" data-field="department"></td>
                    <td><input type="text" value="${staff.year}" data-staffid="${staff.staffid}" data-field="year"></td>
                    <td><input type="text" value="${staff.class}" data-staffid="${staff.staffid}" data-field="class"></td>
                    <td><input type="text" value="${staff.subject}" data-staffid="${staff.staffid}" data-field="subject"></td>
                    <td><input type="text" value="${staff.semester}" data-staffid="${staff.staffid}" data-field="semester"></td>
                    <td><input type="text" value="${staff.username}" data-staffid="${staff.staffid}" data-field="username"></td>
                    <td><input type="text" value="${staff.password}" data-staffid="${staff.staffid}" data-field="password"></td>
                    <td><input type="text" value="${staff.mobile}" data-staffid="${staff.staffid}" data-field="mobile"></td>
                    <td><button onclick="updateStaffInTable('${staff.staffid}')">Update</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('staff-table').style.display = 'block';
    } else {
        alert('No staff found');
    }
}

async function updateStaffInTable(staffid) {
    const inputs = document.querySelectorAll(`input[data-staffid="${staffid}"]`);
    const staffData = {};

    inputs.forEach(input => {
        staffData[input.dataset.field] = input.value;
    });

    staffData.staffid = staffid;

    const response = await fetch('/update-staff', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(staffData)
    });

    if (response.ok) {
        alert('Staff updated successfully');
    } else {
        alert('Failed to update staff');
    }
}

async function updateAllSelectedStaff() {
    const rows = document.querySelectorAll('#staff-table-content tr');
    const updates = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[data-staffid]');
        if (inputs.length > 0) {
            const staffData = {};

            inputs.forEach(input => {
                staffData[input.dataset.field] = input.value;
            });

            staffData.staffid = inputs[0].dataset.staffid;
            updates.push(staffData);
        }
    });

    const response = await fetch('/update-all-staff', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
    });

    if (response.ok) {
        alert('All staff updated successfully');
    } else {
        alert('Failed to update staff');
    }
}


//----------------------------------------advisors
async function showUpdateAdvisorForm() {
    const formHtml = `
        <h3>Update Advisor</h3>
        <div>
            <form id="fetch-advisor-form" onsubmit="fetchAdvisorById(event)">
                <label for="advisorid">Advisor ID:</label>
                <input type="text" id="advisorid" name="advisorid">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="advisor-details" style="display:none;">
            <form id="edit-advisor-form" onsubmit="editAdvisor(event)">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" required>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" required>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" required>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" required>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <label for="password">Password:</label>
                <input type="text" id="password" name="password" required>
                <label for="mobile">Mobile:</label>
                <input type="text" id="mobile" name="mobile" required>
                <button type="submit" onclick="document.getElementById('password').type='password';">Update</button>
            </form>
        </div>
        <div>
            <form id="filter-advisor-form" onsubmit="filterAdvisorsForUpdate(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <label for="filter-class">Class:</label>
                <input type="text" id="filter-class" name="class">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="advisor-table" style="display:none;">
            <table id="advisor-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="updateAllSelectedAdvisors()">Update All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function fetchAdvisorById(event) {
    event.preventDefault();
    const advisorid = document.getElementById('advisorid').value;

    const response = await fetch(`/get-advisor/${advisorid}`);
    if (response.ok) {
        const advisor = await response.json();
        document.getElementById('advisor-details').style.display = 'block';
        document.getElementById('name').value = advisor.name;
        document.getElementById('department').value = advisor.department;
        document.getElementById('year').value = advisor.year;
        document.getElementById('class').value = advisor.class;
        document.getElementById('semester').value = advisor.semester;
        document.getElementById('username').value = advisor.username;
        document.getElementById('password').type = 'text'; // Change the input type to text for display
        document.getElementById('password').value = advisor.password;
        document.getElementById('mobile').value = advisor.mobile;
    } else {
        alert('Advisor not found');
    }
}

async function editAdvisor(event) {
    event.preventDefault();
    const advisorid = document.getElementById('advisorid').value;
    const name = document.getElementById('name').value;
    const department = document.getElementById('department').value;
    const year = document.getElementById('year').value;
    const className = document.getElementById('class').value;
    const semester = document.getElementById('semester').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const mobile = document.getElementById('mobile').value;

    const advisorData = {
        advisorid,
        name,
        department,
        year,
        class: className,
        semester,
        username,
        password,
        mobile
    };

    const response = await fetch('/update-advisor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(advisorData)
    });

    if (response.ok) {
        alert('Advisor updated successfully');
        document.getElementById('advisor-details').style.display = 'none';
    } else {
        alert('Failed to update advisor');
    }
}

async function filterAdvisorsForUpdate(event) {
    event.preventDefault();
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();
    const className = document.getElementById('filter-class').value.trim();

    const response = await fetch(`/filter-advisors?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&class=${encodeURIComponent(className)}`);
    if (response.ok) {
        const advisors = await response.json();
        if (advisors.length === 0) {
            alert('No advisors found');
            return;
        }
        const tableContent = document.getElementById('advisor-table-content');
        tableContent.innerHTML = `
            <tr>
                <th>Advisor ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Class</th>
                <th>Semester</th>
                <th>Username</th>
                <th>Password</th>
                <th>Mobile</th>
                <th>Action</th>
            </tr>
        `;
        advisors.forEach(advisor => {
            const row = `
                <tr>
                    <td>${advisor.advisorid}</td>
                    <td><input type="text" value="${advisor.name}" data-advisorid="${advisor.advisorid}" data-field="name"></td>
                    <td><input type="text" value="${advisor.department}" data-advisorid="${advisor.advisorid}" data-field="department"></td>
                    <td><input type="text" value="${advisor.year}" data-advisorid="${advisor.advisorid}" data-field="year"></td>
                    <td><input type="text" value="${advisor.class}" data-advisorid="${advisor.advisorid}" data-field="class"></td>
                    <td><input type="text" value="${advisor.semester}" data-advisorid="${advisor.advisorid}" data-field="semester"></td>
                    <td><input type="text" value="${advisor.username}" data-advisorid="${advisor.advisorid}" data-field="username"></td>
                    <td><input type="text" value="${advisor.password}" data-advisorid="${advisor.advisorid}" data-field="password"></td>
                    <td><input type="text" value="${advisor.mobile}" data-advisorid="${advisor.advisorid}" data-field="mobile"></td>
                    <td><button onclick="updateAdvisorInTable('${advisor.advisorid}')">Update</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('advisor-table').style.display = 'block';
    } else {
        alert('No advisors found');
    }
}

async function updateAdvisorInTable(advisorid) {
    const inputs = document.querySelectorAll(`input[data-advisorid="${advisorid}"]`);
    const advisorData = {};

    inputs.forEach(input => {
        advisorData[input.dataset.field] = input.value;
    });

    advisorData.advisorid = advisorid;

    const response = await fetch('/update-advisor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(advisorData)
    });

    if (response.ok) {
        alert('Advisor updated successfully');
    } else {
        alert('Failed to update advisor');
    }
}

async function updateAllSelectedAdvisors() {
    const rows = document.querySelectorAll('#advisor-table-content tr');
    const updates = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[data-advisorid]');
        if (inputs.length > 0) {
            const advisorData = {};

            inputs.forEach(input => {
                advisorData[input.dataset.field] = input.value;
            });

            advisorData.advisorid = inputs[0].dataset.advisorid;
            updates.push(advisorData);
        }
    });

    const response = await fetch('/update-all-advisors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
    });

    if (response.ok) {
        alert('All advisors updated successfully');
    } else {
        alert('Failed to update advisors');
    }
}

//--------------admin
async function showUpdateAdminForm() {
    const formHtml = `
        <h3>Update Admin</h3>
        <div>
            <form id="filter-admin-form" onsubmit="filterAdminsForUpdate(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="admin-table" style="display:none;">
            <table id="admin-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="updateAllAdmins()">Update All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}
async function filterAdminsForUpdate(event) {
    event.preventDefault();
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();

    console.log('Filtering with:', { department, year }); // Debug log

    const response = await fetch(`/filter-admins?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}`);
    if (response.ok) {
        const admins = await response.json();
        console.log('Fetched admins:', admins); // Debug log
        if (admins.length === 0) {
            alert('No admins found');
            return;
        }
        const tableContent = document.getElementById('admin-table-content');
        tableContent.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Mobile</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
            </tr>
        `;
        admins.forEach(admin => {
            const row = `
                <tr>
                    <td><input type="text" value="${admin.name}" data-adminid="${admin.username}" data-field="name"></td>
                    <td><input type="text" value="${admin.department}" data-adminid="${admin.username}" data-field="department"></td>
                    <td><input type="text" value="${admin.year}" data-adminid="${admin.username}" data-field="year"></td>
                    <td><input type="text" value="${admin.mobile}" data-adminid="${admin.username}" data-field="mobile"></td>
                    <td><input type="text" value="${admin.username}" data-adminid="${admin.username}" data-field="username" disabled></td>
                    <td><input type="password" value="${admin.password}" data-adminid="${admin.username}" data-field="password"></td>
                    <td><button onclick="updateAdminInTable('${admin.username}')">Update</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('admin-table').style.display = 'block';
    } else {
        console.error('Failed to fetch admins:', response.statusText); // Debug log
        alert('Failed to fetch admins');
    }
}

async function updateAdminInTable(username) {
    const inputs = document.querySelectorAll(`input[data-adminid="${username}"]`);
    const adminData = {};

    inputs.forEach(input => {
        adminData[input.dataset.field] = input.value;
    });

    adminData.username = username;

    const response = await fetch('/update-admin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
    });

    if (response.ok) {
        alert('Admin updated successfully');
    } else {
        alert('Failed to update admin');
    }
}

async function updateAllAdmins() {
    const rows = document.querySelectorAll('#admin-table-content tr');
    const updates = [];

    rows.forEach(row => {
        const inputs = row.querySelectorAll('input[data-adminid]');
        if (inputs.length > 0) {
            const adminData = {};

            inputs.forEach(input => {
                adminData[input.dataset.field] = input.value;
            });

            adminData.username = inputs[0].dataset.adminid;
            updates.push(adminData);
        }
    });

    const response = await fetch('/update-all-admins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
    });

    if (response.ok) {
        alert('All admins updated successfully');
    } else {
        alert('Failed to update admins');
    }
}
//-----------------remove students
async function showRemoveStudentForm() {
    const formHtml = `
        <h3>Remove Student</h3>
        <div>
            <form id="fetch-student-form" onsubmit="fetchStudentByRollNo(event)">
                <label for="rollno">Roll No:</label>
                <input type="text" id="rollno" name="rollno">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="student-details" style="display:none;">
            <form id="edit-student-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" readonly>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" readonly>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" readonly>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" readonly>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" readonly>
                <label for="whatsapp">Whatsapp:</label>
                <input type="text" id="whatsapp" name="whatsapp" readonly>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" readonly>
                <label for="language">Language:</label>
                <input type="text" id="language" name="language" readonly>
                <button type="button" onclick="removeStudentByRollNo()">Remove</button>
            </form>
        </div>
        <div>
            <form id="filter-student-form" onsubmit="filterStudents(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <label for="filter-class">Class:</label>
                <input type="text" id="filter-class" name="class">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="students-table" style="display:none;">
            <table id="students-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="removeAllSelectedStudents()">Remove All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function fetchStudentByRollNo(event) {
    event.preventDefault();
    const rollno = document.getElementById('rollno').value;

    const response = await fetch(`/get-student/${rollno}`);
    if (response.ok) {
        const student = await response.json();
        document.getElementById('student-details').style.display = 'block';
        document.getElementById('name').value = student.name;
        document.getElementById('department').value = student.department;
        document.getElementById('year').value = student.year;
        document.getElementById('class').value = student.class;
        document.getElementById('email').value = student.email;
        document.getElementById('whatsapp').value = student.whatsapp;
        document.getElementById('semester').value = student.semester;
        document.getElementById('language').value = student.language;
    } else {
        alert('Student not found');
    }
}

async function removeStudentByRollNo() {
    const rollno = document.getElementById('rollno').value.toLowerCase();

    const response = await fetch(`/remove-student/${rollno}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (response.ok) {
        alert('Student and their marks table removed successfully');
        document.getElementById('student-details').style.display = 'none';
        filterStudents(new Event('submit'));
    } else {
        const errorText = await response.text();
        alert(`Failed to remove student: ${errorText}`);
    }
}

async function filterStudents(event) {
    event.preventDefault();
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();
    const className = document.getElementById('filter-class').value.trim();

    const response = await fetch(`/filter-students?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&class=${encodeURIComponent(className)}`);
    if (response.ok) {
        const students = await response.json();
        if (students.length === 0) {
            alert('No students found');
            return;
        }
        const tableContent = document.getElementById('students-table-content');
        tableContent.innerHTML = `
            <tr>
                <th><input type="checkbox" id="select-all-checkbox"></th>
                <th>Roll No</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Class</th>
                <th>Email</th>
                <th>Whatsapp</th>
                <th>Semester</th>
                <th>Language</th>
                <th>Action</th>
            </tr>
        `;
        students.forEach(student => {
            const row = `
                <tr>
                    <td><input type="checkbox" value="${student.rollno}" class="student-checkbox"></td>
                    <td>${student.rollno}</td>
                    <td>${student.name}</td>
                    <td>${student.department}</td>
                    <td>${student.year}</td>
                    <td>${student.class}</td>
                    <td>${student.email}</td>
                    <td>${student.whatsapp}</td>
                    <td>${student.semester}</td>
                    <td>${student.language}</td>
                    <td><button type="button" onclick="removeStudent('${student.rollno}')">Remove</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('students-table').style.display = 'block';

        // Add event listener for "Select All" checkbox
        document.getElementById('select-all-checkbox').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.student-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    } else {
        alert('No students found');
    }
}

async function removeStudent(rollno) {
    const response = await fetch(`/remove-student/${rollno}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    if (response.ok) {
        alert('Student and their marks table removed successfully');
        filterStudents(new Event('submit'));
    } else {
        const errorText = await response.text();
        alert(`Failed to remove student: ${errorText}`);
    }
}

async function removeAllSelectedStudents() {
    const selectedRollNos = Array.from(document.querySelectorAll('.student-checkbox:checked')).map(checkbox => checkbox.value.toLowerCase());

    if (selectedRollNos.length === 0) {
        alert('No students selected');
        return;
    }

    const response = await fetch('/remove-all-students', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rollNos: selectedRollNos }),
        credentials: 'include'
    });

    if (response.ok) {
        alert('All selected students removed successfully');
        filterStudents(new Event('submit'));
    } else {
        const errorText = await response.text();
        alert(`Failed to remove selected students: ${errorText}`);
    }
}

//---remove staffs
async function showRemoveStaffForm() {
    const formHtml = `
        <h3>Remove Staff</h3>
        <div>
            <form id="fetch-staff-form" onsubmit="fetchStaffById(event)">
                <label for="staffid">Staff ID:</label>
                <input type="text" id="staffid" name="staffid">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="staff-details" style="display:none;">
            <form id="edit-staff-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" readonly>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" readonly>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" readonly>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" readonly>
                <label for="subject">Subject:</label>
                <input type="text" id="subject" name="subject" readonly>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" readonly>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" readonly>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" readonly>
                <label for="mobile">Mobile:</label>
                <input type="text" id="mobile" name="mobile" readonly>
                <button type="button" onclick="removeStaffById()">Remove</button>
            </form>
        </div>
        <div>
            <form id="filter-staff-form" onsubmit="filterStaff(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <label for="filter-class">Class:</label>
                <input type="text" id="filter-class" name="class">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="staff-table" style="display:none;">
            <table id="staff-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="removeAllSelectedStaff()">Remove All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function fetchStaffById(event) {
    event.preventDefault();
    const staffid = document.getElementById('staffid').value;

    const response = await fetch(`/get-staff/${staffid}`);
    if (response.ok) {
        const staff = await response.json();
        document.getElementById('staff-details').style.display = 'block';
        document.getElementById('name').value = staff.name;
        document.getElementById('department').value = staff.department;
        document.getElementById('year').value = staff.year;
        document.getElementById('class').value = staff.class;
        document.getElementById('subject').value = staff.subject;
        document.getElementById('semester').value = staff.semester;
        document.getElementById('username').value = staff.username;
        document.getElementById('password').type = 'text'; // Change the input type to text for display
        document.getElementById('password').value = staff.password;
        document.getElementById('mobile').value = staff.mobile;
    } else {
        alert('Staff not found');
    }
}

async function removeStaffById() {
    const staffid = document.getElementById('staffid').value;

    const response = await fetch(`/remove-staff/${staffid}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Staff removed successfully');
        document.getElementById('staff-details').style.display = 'none';
        filterStaff(new Event('submit'));
    } else {
        alert('Failed to remove staff');
    }
}

async function filterStaff(event) {
    event.preventDefault();
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();
    const className = document.getElementById('filter-class').value.trim();

    const response = await fetch(`/filter-staff?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&class=${encodeURIComponent(className)}`);
    if (response.ok) {
        const staffList = await response.json();
        if (staffList.length === 0) {
            alert('No staff found');
            return;
        }
        const tableContent = document.getElementById('staff-table-content');
        tableContent.innerHTML = `
            <tr>
                <th><input type="checkbox" id="select-all-checkbox"></th>
                <th>Staff ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Semester</th>
                <th>Username</th>
                <th>Password</th>
                <th>Mobile</th>
                <th>Action</th>
            </tr>
        `;
        staffList.forEach(staff => {
            const row = `
                <tr>
                    <td><input type="checkbox" value="${staff.staffid}" class="staff-checkbox"></td>
                    <td>${staff.staffid}</td>
                    <td>${staff.name}</td>
                    <td>${staff.department}</td>
                    <td>${staff.year}</td>
                    <td>${staff.class}</td>
                    <td>${staff.subject}</td>
                    <td>${staff.semester}</td>
                    <td>${staff.username}</td>
                    <td>${staff.password}</td>
                    <td>${staff.mobile}</td>
                    <td><button onclick="removeStaff('${staff.staffid}')">Remove</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('staff-table').style.display = 'block';

        // Add event listener for "Select All" checkbox
        document.getElementById('select-all-checkbox').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.staff-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    } else {
        alert('No staff found');
    }
}

async function removeStaff(staffid) {
    const response = await fetch(`/remove-staff/${staffid}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Staff removed successfully');
        filterStaff(new Event('submit'));
    } else {
        alert('Failed to remove staff');
    }
}

async function removeAllSelectedStaff() {
    const selectedStaffIds = Array.from(document.querySelectorAll('.staff-checkbox:checked')).map(checkbox => checkbox.value);

    if (selectedStaffIds.length === 0) {
        alert('No staff selected');
        return;
    }

    const response = await fetch('/remove-all-staff', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ staffIds: selectedStaffIds })
    });

    if (response.ok) {
        alert('All selected staff removed successfully');
        filterStaff(new Event('submit'));
    } else {
        alert('Failed to remove selected staff');
    }
}
//-------remove advsiors
async function showRemoveAdvisorForm() {
    const formHtml = `
        <h3>Remove Advisor</h3>
        <div>
            <form id="fetch-advisor-form" onsubmit="fetchAdvisorById(event)">
                <label for="advisorid">Advisor ID:</label>
                <input type="text" id="advisorid" name="advisorid">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="advisor-details" style="display:none;">
            <form id="edit-advisor-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" readonly>
                <label for="department">Department:</label>
                <input type="text" id="department" name="department" readonly>
                <label for="year">Year:</label>
                <input type="text" id="year" name="year" readonly>
                <label for="class">Class:</label>
                <input type="text" id="class" name="class" readonly>
                <label for="semester">Semester:</label>
                <input type="text" id="semester" name="semester" readonly>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" readonly>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" readonly>
                <label for="mobile">Mobile:</label>
                <input type="text" id="mobile" name="mobile" readonly>
                <button type="button" onclick="removeAdvisorById()">Remove</button>
            </form>
        </div>
        <div>
            <form id="filter-advisor-form" onsubmit="filterAdvisors(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <label for="filter-class">Class:</label>
                <input type="text" id="filter-class" name="class">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="advisor-table" style="display:none;">
            <table id="advisor-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="removeAllSelectedAdvisors()">Remove All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function fetchAdvisorById(event) {
    event.preventDefault();
    const advisorid = document.getElementById('advisorid').value;

    const response = await fetch(`/get-advisor/${advisorid}`);
    if (response.ok) {
        const advisor = await response.json();
        document.getElementById('advisor-details').style.display = 'block';
        document.getElementById('name').value = advisor.name;
        document.getElementById('department').value = advisor.department;
        document.getElementById('year').value = advisor.year;
        document.getElementById('class').value = advisor.class;
        document.getElementById('semester').value = advisor.semester;
        document.getElementById('username').value = advisor.username;
        document.getElementById('password').type = 'text'; // Change the input type to text for display
        document.getElementById('password').value = advisor.password;
        document.getElementById('mobile').value = advisor.mobile;
    } else {
        alert('Advisor not found');
    }
}

async function removeAdvisorById() {
    const advisorid = document.getElementById('advisorid').value;

    const response = await fetch(`/remove-advisor/${advisorid}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Advisor removed successfully');
        document.getElementById('advisor-details').style.display = 'none';
        filterAdvisors(new Event('submit'));
    } else {
        alert('Failed to remove advisor');
    }
}

async function filterAdvisors(event) {
    event.preventDefault();
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();
    const className = document.getElementById('filter-class').value.trim();

    const response = await fetch(`/filter-advisors?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}&class=${encodeURIComponent(className)}`);
    if (response.ok) {
        const advisors = await response.json();
        if (advisors.length === 0) {
            alert('No advisors found');
            return;
        }
        const tableContent = document.getElementById('advisor-table-content');
        tableContent.innerHTML = `
            <tr>
                <th><input type="checkbox" id="select-all-checkbox"></th>
                <th>Advisor ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Class</th>
                <th>Semester</th>
                <th>Username</th>
                <th>Password</th>
                <th>Mobile</th>
                <th>Action</th>
            </tr>
        `;
        advisors.forEach(advisor => {
            const row = `
                <tr>
                    <td><input type="checkbox" value="${advisor.advisorid}" class="advisor-checkbox"></td>
                    <td>${advisor.advisorid}</td>
                    <td>${advisor.name}</td>
                    <td>${advisor.department}</td>
                    <td>${advisor.year}</td>
                    <td>${advisor.class}</td>
                    <td>${advisor.semester}</td>
                    <td>${advisor.username}</td>
                    <td>${advisor.password}</td>
                    <td>${advisor.mobile}</td>
                    <td><button onclick="removeAdvisor('${advisor.advisorid}')">Remove</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('advisor-table').style.display = 'block';

        // Add event listener for "Select All" checkbox
        document.getElementById('select-all-checkbox').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.advisor-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    } else {
        alert('No advisors found');
    }
}

async function removeAdvisor(advisorid) {
    const response = await fetch(`/remove-advisor/${advisorid}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Advisor removed successfully');
        filterAdvisors(new Event('submit'));
    } else {
        alert('Failed to remove advisor');
    }
}

async function removeAllSelectedAdvisors() {
    const selectedAdvisorIds = Array.from(document.querySelectorAll('.advisor-checkbox:checked')).map(checkbox => checkbox.value);

    if (selectedAdvisorIds.length === 0) {
        alert('No advisors selected');
        return;
    }

    const response = await fetch('/remove-all-advisors', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ advisorIds: selectedAdvisorIds })
    });

    if (response.ok) {
        alert('All selected advisors removed successfully');
        filterAdvisors(new Event('submit'));
    } else {
        alert('Failed to remove selected advisors');
    }
}
//---remove admins
async function showRemoveAdminForm() {
    const formHtml = `
        <h3>Remove Admin</h3>
        <div>
            <form id="filter-admin-form" onsubmit="filterAdminsForRemoval(event)">
                <label for="filter-department">Department:</label>
                <input type="text" id="filter-department" name="department">
                <label for="filter-year">Year:</label>
                <input type="text" id="filter-year" name="year">
                <button type="submit">Fetch</button>
            </form>
        </div>
        <div id="admin-table" style="display:none;">
            <table id="admin-table-content">
                <!-- Table content will be dynamically inserted here -->
            </table>
            <button onclick="removeAllSelectedAdmins()">Remove All</button>
        </div>
    `;
    document.getElementById('right-panel').innerHTML = formHtml;
}

async function filterAdminsForRemoval(event) {
    event.preventDefault();
    const department = document.getElementById('filter-department').value.trim();
    const year = document.getElementById('filter-year').value.trim();

    const response = await fetch(`/filter-admins?department=${encodeURIComponent(department)}&year=${encodeURIComponent(year)}`);
    if (response.ok) {
        const admins = await response.json();
        if (admins.length === 0) {
            alert('No admins found');
            return;
        }
        const tableContent = document.getElementById('admin-table-content');
        tableContent.innerHTML = `
            <tr>
                <th><input type="checkbox" id="select-all-checkbox"></th>
                <th>Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Mobile</th>
                <th>Username</th>
                <th>Password</th>
                <th>Action</th>
            </tr>
        `;
        admins.forEach(admin => {
            const row = `
                <tr>
                    <td><input type="checkbox" value="${admin.username}" class="admin-checkbox"></td>
                    <td>${admin.name}</td>
                    <td>${admin.department}</td>
                    <td>${admin.year}</td>
                    <td>${admin.mobile}</td>
                    <td>${admin.username}</td>
                    <td>${admin.password}</td>
                    <td><button onclick="removeAdmin('${admin.username}')">Remove</button></td>
                </tr>
            `;
            tableContent.innerHTML += row;
        });
        document.getElementById('admin-table').style.display = 'block';

        // Add event listener for "Select All" checkbox
        document.getElementById('select-all-checkbox').addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.admin-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    } else {
        alert('Failed to fetch admins');
    }
}

async function removeAdmin(username) {
    const response = await fetch(`/remove-admin/${username}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Admin removed successfully');
        filterAdminsForRemoval(new Event('submit'));
    } else {
        alert('Failed to remove admin');
    }
}

async function removeAllSelectedAdmins() {
    const selectedUsernames = Array.from(document.querySelectorAll('.admin-checkbox:checked')).map(checkbox => checkbox.value);

    if (selectedUsernames.length === 0) {
        alert('No admins selected');
        return;
    }

    const response = await fetch('/remove-all-admins', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernames: selectedUsernames })
    });

    if (response.ok) {
        alert('All selected admins removed successfully');
        filterAdminsForRemoval(new Event('submit'));
    } else {
        alert('Failed to remove selected admins');
    }
}
