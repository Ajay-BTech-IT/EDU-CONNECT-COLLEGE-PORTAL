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

            // Hide the SEND content
            document.getElementById('sendMenu').style.display = 'none';
            document.getElementById('rollnoCheckboxes').style.display = 'none';
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
    document.getElementById('sendMenu').style.display = 'block'; // Show send menu
    document.getElementById('studentDetails').style.display = 'none'; // Hide student details
    document.querySelector('.table-container').style.display = 'none'; // Hide marks table
    document.querySelector('.radio-container').style.display = 'none'; // Hide radio options and send marks button
    document.querySelector('.right-panel').classList.add('active'); // Show right panel
}

function hideSendMenu() {
    document.getElementById('sendMenu').style.display = 'none'; // Hide send menu
}

function sendMarksMenu() {
    fetch('/getStudents')
        .then(response => response.json())
        .then(data => {
            console.log('Students:', data); // Debugging log
            const rollnoCheckboxList = document.getElementById('rollnoCheckboxList');
            rollnoCheckboxList.innerHTML = ''; // Clear the list before adding roll numbers

            data.forEach((student) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <div>
                        <input type="checkbox" class="student-checkbox" id="student-${student.rollno}" value="${student.rollno}">
                        <label for="student-${student.rollno}">${student.rollno}</label>
                    </div>
                `;
                rollnoCheckboxList.appendChild(listItem);
            });

            // Add SELECT ALL checkbox, radio buttons, and SEND MARKS button
            rollnoCheckboxList.innerHTML += `
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
                
               
               
            `;
            // <button type="button" onclick="sendSelectedMarks()">SEND MARKS</button>


            document.getElementById('rollnoCheckboxes').style.display = 'block';
            document.getElementById('sendMenu').style.display = 'none'; // Hide the top menu
            hideStudentDetailsAndMarks();
        })
        .catch(error => console.error('Error fetching students:', error));
}

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Ensure to reattach event listeners to roll numbers
function attachRollNoEventListeners() {
    let rollnoItems = document.querySelectorAll('.rollno-item');
    rollnoItems.forEach(rollnoItem => {
        rollnoItem.addEventListener('click', () => {
            let rollno = rollnoItem.innerText;
            loadStudentDetails(rollno);
            hideSendMenu(); // Hide send menu when student details are clicked
            document.getElementById('studentDetails').style.display = 'block'; // Show student details
            document.querySelector('.table-container').style.display = 'block'; // Show marks table
            document.querySelector('.radio-container').style.display = 'block'; // Show radio options and send marks button
            document.querySelector('.right-panel').classList.add('active'); // Show right panel when a roll number is clicked
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadAdvisorPage();
    attachRollNoEventListeners(); // Attach event listeners when the page is loaded
});

function hideStudentDetailsAndMarks() {
    document.getElementById('studentDetails').style.display = 'none'; // Hide student details
    document.querySelector('.table-container').style.display = 'none'; // Hide marks table
    document.querySelector('.radio-container').style.display = 'none'; // Hide radio options and send marks button
    document.querySelector('.right-panel').classList.add('active'); // Show right panel
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
}*/