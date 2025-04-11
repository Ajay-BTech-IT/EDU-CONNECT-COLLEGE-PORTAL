/*document.addEventListener('DOMContentLoaded', loadAdvisorPage);

function loadAdvisorPage() {
    fetch('/getAdvisorDetails')
        .then(response => response.json())
        .then(data => {
            document.getElementById('advisorName').innerText = data.name;
            document.getElementById('advisordepartment').innerText = `Department: ${data.department}`;
            document.getElementById('advisorYear').innerText = `Year: ${data.year}`;
            document.getElementById('advisorClass').innerText = `Class: ${data.class}`;
           // document.getElementById('advisorMobile').innerText = ${data.mobile}; // Set advisor mobile number
            loadStudents();
        })
        .catch(error => console.error('Error fetching advisor details:', error));
}

function loadStudents() {
    fetch('/getStudents')
        .then(response => response.json())
        .then(data => {
            console.log('Students:', data); // Debugging log
            let rollnoList = document.getElementById('rollnoList');
            rollnoList.innerHTML = ''; // Clear the list before adding roll numbers
            data.forEach((student) => {
                let rollnoItem = document.createElement('li');
                rollnoItem.innerText = student.rollno;
                rollnoItem.className = 'rollno-item';
                rollnoItem.addEventListener('click', () => {
                    loadStudentDetails(student.rollno);
                    hideSendMenu(); // Hide send menu when student details are clicked
                    document.getElementById('studentDetails').style.display = 'block'; // Show student details
                    document.querySelector('.table-container').style.display = 'block'; // Show marks table
                    document.querySelector('.radio-container').style.display = 'block'; // Show radio options and send marks button
                    document.querySelector('.right-panel').classList.add('active'); // Show right panel when a roll number is clicked
                });
                rollnoList.appendChild(rollnoItem);
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}

function loadStudentDetails(rollno) {
    fetch(`/getStudentDetails/${rollno}`)
        .then(response => response.json())
        .then(data => {
            console.log('Student Details:', data); // Debugging log
            document.getElementById('studentName').innerText = data.name;
            document.getElementById('studentRollno').innerText = data.rollno;
            document.getElementById('studentDepartment').innerText = data.department;
            document.getElementById('studentYear').innerText = data.year;
            document.getElementById('studentClass').innerText = data.class;
            document.getElementById('studentWhatsApp').innerText = data.whatsapp;
            document.getElementById('studentEmail').innerText = data.email;
            document.getElementById('studentSemester').innerText = data.semester;
            loadStudentMarks(rollno);
        })
        .catch(error => console.error('Error fetching student details:', error));
}

function loadStudentMarks(rollno) {
    fetch(`/getStudentMarks/${rollno}`)
        .then(response => response.json())
        .then(data => {
            console.log('Student Marks:', data); // Debugging log
            let marksTable = document.getElementById('marksTable').getElementsByTagName('tbody')[0];
            marksTable.innerHTML = ''; // Clear the table before adding rows
            if (data.length === 0) {
                let row = marksTable.insertRow();
                let cell = row.insertCell(0);
                cell.colSpan = 6;
                cell.innerText = 'No marks available';
            } else {
                data.forEach((subjectMarks) => {
                    console.log('Subject Marks:', subjectMarks); // Debugging log
                    let row = marksTable.insertRow();
                    row.insertCell(0).innerText = subjectMarks.subject || 'Unknown Subject';
                    row.insertCell(1).innerText = subjectMarks.cat1 || '';
                    row.insertCell(2).innerText = subjectMarks.cat2 || '';
                    row.insertCell(3).innerText = subjectMarks.cat3 || '';
                    row.insertCell(4).innerText = subjectMarks.model || '';
                    row.insertCell(5).innerText = subjectMarks.semester || '';
                });
            }
        })
        .catch(error => console.error('Error fetching student marks:', error));
}



function sendMarks() {
    const rollno = document.getElementById('studentRollno').innerText;
    const examType = document.querySelector('input[name="examType"]:checked').value;

    fetch(`/getStudentDetails/${rollno}`)
        .then(response => response.json())
        .then(student => {
            fetch(`/getStudentMarks/${rollno}`)
                .then(response => response.json())
                .then(marks => {
                    const selectedMarks = marks.map(mark => ({
                        subject: mark.subject,
                        marks: mark[examType]
                    }));

                    const whatsappNumber = student.whatsapp;
                    const smsNumber = student.whatsapp; // Assuming same as WhatsApp number
                    const advisor = {
                        department: document.getElementById('advisordepartment').innerText.split(': ')[1],
                        year: document.getElementById('advisorYear').innerText.split(': ')[1],
                        semester: student.semester,
                        mobile: '1234567'// Replace with actual advisor mobile number
                    };

                    fetch('/sendMarks', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ student, advisor, examType, marks: selectedMarks })
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert('Marks sent successfully!');
                    })
                    .catch(error => console.error('Error sending marks:', error));
                })
                .catch(error => console.error('Error fetching student marks for sending:', error));
        })
        .catch(error => console.error('Error fetching student details for sending:', error));
}*/
document.addEventListener('DOMContentLoaded', loadAdvisorPage);

function loadAdvisorPage() {
    fetch('/getAdvisorDetails')
        .then(response => response.json())
        .then(data => {
            document.getElementById('advisorName').innerText = data.name;
            document.getElementById('advisordepartment').innerText = `Department: ${data.department}`;
            document.getElementById('advisorYear').innerText = `Year: ${data.year}`;
            document.getElementById('advisorClass').innerText = `Class: ${data.class}`;
            loadStudents();
        })
        .catch(error => console.error('Error fetching advisor details:', error));
}


function showSendMenu() {
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.innerHTML = `
        <button type="button" onclick="sendMarksMenu()">SEND MARKS</button>
        <button type="button" onclick="sendNewsMenu()">SEND NEWS</button>
    `;
    document.getElementById('sendMenu').style.display = 'block'; // Show send menu
    document.getElementById('studentDetails').style.display = 'none'; // Hide student details
    document.querySelector('.table-container').style.display = 'none'; // Hide marks table
    document.querySelector('.radio-container').style.display = 'none'; // Hide radio options and send marks button
    document.querySelector('.right-panel').classList.add('active'); // Show right panel
}

function hideSendMenu() {
    document.getElementById('sendMenu').style.display = 'none'; // Hide send menu
}

function hideStudentDetailsAndMarks() {
    document.getElementById('studentDetails').style.display = 'none'; // Hide student details
    document.querySelector('.table-container').style.display = 'none'; // Hide marks table
    document.querySelector('.radio-container').style.display = 'none'; // Hide radio options and send marks button
    document.querySelector('.right-panel').classList.add('active'); // Show right panel
}

function loadStudents() {
    fetch('/getStudents')
        .then(response => response.json())
        .then(data => {
            console.log('Students:', data); // Debugging log
            let rollnoList = document.getElementById('rollnoList');
            rollnoList.innerHTML = ''; // Clear the list before adding roll numbers
            data.forEach((student) => {
                let rollnoItem = document.createElement('li');
                rollnoItem.innerText = student.rollno;
                rollnoItem.className = 'rollno-item';
                rollnoItem.addEventListener('click', () => {
                    loadStudentDetails(student.rollno);
                    document.getElementById('studentDetails').style.display = 'block'; // Show student details
                    document.querySelector('.table-container').style.display = 'block'; // Show marks table
                    document.querySelector('.radio-container').style.display = 'block'; // Show radio options and send marks button
                    document.querySelector('.right-panel').classList.add('active'); // Show right panel when a roll number is clicked
                });
                rollnoList.appendChild(rollnoItem);
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}


function loadStudentDetails(rollno) {
    fetch(`/getStudentDetails/${rollno}`)
        .then(response => response.json())
        .then(data => {
            console.log('Student Details:', data); // Debugging log
            document.getElementById('studentName').innerText = data.name;
            document.getElementById('studentRollno').innerText = data.rollno;
            document.getElementById('studentDepartment').innerText = data.department;
            document.getElementById('studentYear').innerText = data.year;
            document.getElementById('studentClass').innerText = data.class;
            document.getElementById('studentWhatsApp').innerText = data.whatsapp;
            document.getElementById('studentEmail').innerText = data.email;
            document.getElementById('studentSemester').innerText = data.semester;
            loadStudentMarks(rollno);
        })
        .catch(error => console.error('Error fetching student details:', error));
}

function loadStudentMarks(rollno) {
    fetch(`/getStudentMarks/${rollno}`)
        .then(response => response.json())
        .then(data => {
            console.log('Student Marks:', data); // Debugging log
            let marksTable = document.getElementById('marksTable').getElementsByTagName('tbody')[0];
            marksTable.innerHTML = ''; // Clear the table before adding rows
            if (data.length === 0) {
                let row = marksTable.insertRow();
                let cell = row.insertCell(0);
                cell.colSpan = 6;
                cell.innerText = 'No marks available';
            } else {
                data.forEach((subjectMarks) => {
                    console.log('Subject Marks:', subjectMarks); // Debugging log
                    let row = marksTable.insertRow();
                    row.insertCell(0).innerText = subjectMarks.subject || 'Unknown Subject';
                    row.insertCell(1).innerText = subjectMarks.cat1 || '';
                    row.insertCell(2).innerText = subjectMarks.cat2 || '';
                    row.insertCell(3).innerText = subjectMarks.cat3 || '';
                    row.insertCell(4).innerText = subjectMarks.model || '';
                    row.insertCell(5).innerText = subjectMarks.semester || '';
                });
            }
        })
        .catch(error => console.error('Error fetching student marks:', error));
}

function sendMarks() {
    const rollno = document.getElementById('studentRollno').innerText;
    const examType = document.querySelector('input[name="examType"]:checked').value;

    fetch(`/getStudentDetails/${rollno}`)
        .then(response => response.json())
        .then(student => {
            fetch(`/getStudentMarks/${rollno}`)
                .then(response => response.json())
                .then(marks => {
                    const selectedMarks = marks.map(mark => ({
                        subject: mark.subject,
                        marks: mark[examType]
                    }));

                    // Fetch advisor details
                    fetch('/getAdvisorDetails')
                        .then(response => response.json())
                        .then(advisor => {
                            const advisorDetails = {
                                department: advisor.department,
                                year: advisor.year,
                                semester: student.semester,
                                mobile: advisor.mobile // Actual advisor mobile number
                            };

                            fetch('/sendMarks', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ student, advisor: advisorDetails, examType, marks: selectedMarks })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    alert('Marks sent successfully!');
                                })
                                .catch(error => console.error('Error sending marks:', error));
                        })
                        .catch(error => console.error('Error fetching advisor details:', error));
                })
                .catch(error => console.error('Error fetching student marks for sending:', error));
        })
        .catch(error => console.error('Error fetching student details for sending:', error));
}

function sendMarksMenu() {
    fetch('/getStudents')
        .then(response => response.json())
        .then(data => {
                console.log('Students:', data); // Debugging log
                const rightPanel = document.querySelector('.right-panel');
                rightPanel.innerHTML = `
                <div>
                    ${data.map(student => `
                        <div>
                            <input type="checkbox" class="student-checkbox" id="student-${student.rollno}" value="${student.rollno}">
                            <label for="student-${student.rollno}">${student.rollno}</label>
                        </div>
                    `).join('')}
                    <div>
                        <input type="checkbox" id="selectAll" onclick="toggleSelectAll(this)">
                        <label for="selectAll">SELECT ALL</label>
                    </div>
                    <div>
                        <label><input type="radio" name="examType" value="cat1"> CAT 1</label>
                        <label><input type="radio" name="examType" value="cat2"> CAT 2</label>
                        <label><input type="radio" name="examType" value="cat3"> CAT 3</label>
                        <label><input type="radio" name="examType" value="model"> Model</label>
                    </div>
                    <button type="button" onclick="sendSelectedMarks()">SEND MARKS</button>
                </div>
            `;
            rightPanel.style.display = 'block'; // Show right panel
        })
        .catch(error => console.error('Error fetching students:', error));
}

function sendNewsMenu() {
    // Logic for sending news menu
    console.log("Send News menu clicked");
}

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}


/*function sendSelectedMarks() {
    const selectedRollnos = Array.from(document.querySelectorAll('.student-checkbox:checked')).map(checkbox => checkbox.value);
    const examType = document.querySelector('input[name="examType"]:checked').value;

    selectedRollnos.forEach(rollno => {
        fetch(`/getStudentDetails/${rollno}`)
            .then(response => response.json())
            .then(student => {
                fetch(`/getStudentMarks/${rollno}`)
                    .then(response => response.json())
                    .then(marks => {
                        const selectedMarks = marks.map(mark => ({
                            subject: mark.subject,
                            marks: mark[examType]
                        }));

                        const advisor = {
                            department: document.getElementById('advisordepartment').innerText.split(': ')[1],
                            year: document.getElementById('advisorYear').innerText.split(': ')[1],
                            semester: student.semester,
                            mobile: '1234567' // Replace with actual advisor mobile number
                        };

                        fetch('/sendMarks', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ student, advisor, examType, marks: selectedMarks })
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert(`Marks sent successfully for roll no: ${rollno}!`);
                        })
                        .catch(error => console.error('Error sending marks:', error));
                    })
                    .catch(error => console.error('Error fetching student marks for sending:', error));
            })
            .catch(error => console.error('Error fetching student details for sending:', error));
    });
}*/
function sendSelectedMarks() {
    const selectedRollnos = Array.from(document.querySelectorAll('.student-checkbox:checked')).map(checkbox => checkbox.value);
    const examType = document.querySelector('input[name="examType"]:checked').value;

    selectedRollnos.forEach(rollno => {
        fetch(`/getStudentDetails/${rollno}`)
            .then(response => response.json())
            .then(student => {
                fetch(`/getStudentMarks/${rollno}`)
                    .then(response => response.json())
                    .then(marks => {
                        const selectedMarks = marks.map(mark => ({
                            subject: mark.subject,
                            marks: mark[examType]
                        }));

                        // Fetch advisor details
                        fetch(`/getAdvisorDetails/${student.advisorId}`)
                            .then(response => response.json())
                            .then(advisor => {
                                const advisorDetails = {
                                    department: advisor.department,
                                    year: advisor.year,
                                    semester: student.semester,
                                    mobile: advisor.mobile // Actual advisor mobile number
                                };

                                fetch('/sendMarks', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ student, advisor: advisorDetails, examType, marks: selectedMarks })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    alert(`Marks sent successfully for roll no: ${rollno}!`);
                                })
                                .catch(error => console.error('Error sending marks:', error));
                            })
                            .catch(error => console.error('Error fetching advisor details:', error));
                    })
                    .catch(error => console.error('Error fetching student marks for sending:', error));
            })
            .catch(error => console.error('Error fetching student details for sending:', error));
    });
}

function showStudentDetails() {
    document.getElementById('studentDetails').style.display = 'block'; // Show student details
    document.querySelector('.table-container').style.display = 'block'; // Show marks table
    document.querySelector('.radio-container').style.display = 'block'; // Show radio options and send marks button
}


/*
document.addEventListener('DOMContentLoaded', loadAdvisorPage);

function loadAdvisorPage() {
    fetch('/getAdvisorDetails')
        .then(response => response.json())
        .then(data => {
            document.getElementById('advisorName').innerText = data.name;
            document.getElementById('advisordepartment').innerText = `Department: ${data.department}`;
            document.getElementById('advisorYear').innerText = `Year: ${data.year}`;
            document.getElementById('advisorClass').innerText = `Class: ${data.class}`;
            loadStudents();
        })
        .catch(error => console.error('Error fetching advisor details:', error));
}

function loadStudents() {
    fetch('/getStudents')
        .then(response => response.json())
        .then(data => {
            console.log('Students:', data); // Debugging log
            let rollnoList = document.getElementById('rollnoList');
            rollnoList.innerHTML = ''; // Clear the list before adding roll numbers
            data.forEach((student) => {
                let rollnoItem = document.createElement('li');
                rollnoItem.innerText = student.rollno;
                rollnoItem.className = 'rollno-item';
                rollnoItem.addEventListener('click', () => {
                    loadStudentDetails(student.rollno);
                    clearSendMenu(); // Hide send menu when student details are clicked
                    showStudentDetails(); // Show student details
                });
                rollnoList.appendChild(rollnoItem);
            });
        })
        .catch(error => console.error('Error fetching students:', error));
}

function loadStudentDetails(rollno) {
    fetch(`/getStudentDetails/${rollno}`)
        .then(response => response.json())
        .then(data => {
            console.log('Student Details:', data); // Debugging log
            document.getElementById('studentName').innerText = data.name;
            document.getElementById('studentRollno').innerText = data.rollno;
            document.getElementById('studentDepartment').innerText = data.department;
            document.getElementById('studentYear').innerText = data.year;
            document.getElementById('studentClass').innerText = data.class;
            document.getElementById('studentWhatsApp').innerText = data.whatsapp;
            document.getElementById('studentEmail').innerText = data.email;
            document.getElementById('studentSemester').innerText = data.semester;
            loadStudentMarks(rollno);
        })
        .catch(error => console.error('Error fetching student details:', error));
}

function loadStudentMarks(rollno) {
    fetch(`/getStudentMarks/${rollno}`)
        .then(response => response.json())
        .then(data => {
            console.log('Student Marks:', data); // Debugging log
            let marksTable = document.getElementById('marksTable').getElementsByTagName('tbody')[0];
            marksTable.innerHTML = ''; // Clear the table before adding rows
            if (data.length === 0) {
                let row = marksTable.insertRow();
                let cell = row.insertCell(0);
                cell.colSpan = 6;
                cell.innerText = 'No marks available';
            } else {
                data.forEach((subjectMarks) => {
                    console.log('Subject Marks:', subjectMarks); // Debugging log
                    let row = marksTable.insertRow();
                    row.insertCell(0).innerText = subjectMarks.subject || 'Unknown Subject';
                    row.insertCell(1).innerText = subjectMarks.cat1 || '';
                    row.insertCell(2).innerText = subjectMarks.cat2 || '';
                    row.insertCell(3).innerText = subjectMarks.cat3 || '';
                    row.insertCell(4).innerText = subjectMarks.model || '';
                    row.insertCell(5).innerText = subjectMarks.semester || '';
                });
            }
        })
        .catch(error => console.error('Error fetching student marks:', error));
}

function showSendMenu() {
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.innerHTML = `
        <button type="button" onclick="sendMarksMenu()">SEND MARKS</button>
        <button type="button" onclick="sendNewsMenu()">SEND NEWS</button>
    `;
    rightPanel.style.display = 'block'; // Show right panel
    hideStudentDetails(); // Hide student details
    document.querySelector('.table-container').style.display = 'none'; // Hide marks table
    document.querySelector('.radio-container').style.display = 'none'; // Hide radio options and send marks button
}

function clearSendMenu() {
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.innerHTML = ''; // Clear right panel content
}

function sendMarksMenu() {
    fetch('/getStudents')
        .then(response => response.json())
        .then(data => {
            console.log('Students:', data); // Debugging log
            const rightPanel = document.querySelector('.right-panel');
            rightPanel.innerHTML = `
                <div>
                    ${data.map(student => `
                        <div>
                            <input type="checkbox" class="student-checkbox" id="student-${student.rollno}" value="${student.rollno}">
                            <label for="student-${student.rollno}">${student.rollno}</label>
                        </div>
                    `).join('')}
                    <div>
                        <input type="checkbox" id="selectAll" onclick="toggleSelectAll(this)">
                        <label for="selectAll">SELECT ALL</label>
                    </div>
                    <div>
                        <label><input type="radio" name="examType" value="cat1"> CAT 1</label>
                        <label><input type="radio" name="examType" value="cat2"> CAT 2</label>
                        <label><input type="radio" name="examType" value="cat3"> CAT 3</label>
                        <label><input type="radio" name="examType" value="model"> Model</label>
                    </div>
                    <button type="button" onclick="sendSelectedMarks()">SEND MARKS</button>
                </div>
            `;
            rightPanel.style.display = 'block'; // Show right panel
        })
        .catch(error => console.error('Error fetching students:', error));
}

function sendNewsMenu() {
    // Logic for sending news menu
    console.log("Send News menu clicked");
}

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

function sendSelectedMarks() {
    const selectedRollnos = Array.from(document.querySelectorAll('.student-checkbox:checked')).map(checkbox => checkbox.value);
    const examType = document.querySelector('input[name="examType"]:checked').value;

    selectedRollnos.forEach(rollno => {
        fetch(`/getStudentDetails/${rollno}`)
            .then(response => response.json())
            .then(student => {
                fetch(`/getStudentMarks/${rollno}`)
                    .then(response => response.json())
                    .then(marks => {
                        const selectedMarks = marks.map(mark => ({
                            subject: mark.subject,
                            marks: mark[examType]
                        }));

                        const advisor = {
                            department: document.getElementById('advisordepartment').innerText.split(': ')[1],
                            year: document.getElementById('advisorYear').innerText.split(': ')[1],
                            semester: student.semester,
                            mobile: '1234567' // Replace with actual advisor mobile number
                        };

                        fetch('/sendMarks', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ student, advisor, examType, marks: selectedMarks })
                        })
                        .then(response => response.json())
                        .then(data => {
                            alert(`Marks sent successfully for roll no: ${rollno}!`);
                        })
                        .catch(error => console.error('Error sending marks:', error));
                    })
                    .catch(error => console.error('Error fetching student marks for sending:', error));
            })
            .catch(error => console.error('Error fetching student details for sending:', error));
    });
}

function showStudentDetails() {
    document.getElementById('studentDetails').style.display = 'block'; // Show student details
    document.querySelector('.table-container').style.display = 'block'; // Show marks table
    document.querySelector('.radio-container').style.display = 'block'; // Show radio options and send marks button
}

function hideStudentDetails() {
    document.getElementById('studentDetails').style.display = 'none'; // Hide student details
    document.querySelector('.table-container').style.display = 'none'; // Hide marks table
    document.querySelector('.radio-container').style.display = 'none'; // Hide radio options and send marks button
}
*/