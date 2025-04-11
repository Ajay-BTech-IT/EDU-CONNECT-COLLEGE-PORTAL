document.addEventListener('DOMContentLoaded', () => {
    fetchStaffInfo();
    fetchStudents();
});

async function fetchStaffInfo() {
    const response = await fetch('/staff-info');
    if (response.ok) {
        const staffInfo = await response.json();
        document.getElementById('staff-name').innerText = staffInfo.name;
        document.getElementById('subject').innerText = staffInfo.subject;
        document.getElementById('dept-year-class').innerText = `${staffInfo.department}-${staffInfo.year}-${staffInfo.class}`;
    } else {
        alert('Failed to fetch staff info');
    }
}

async function fetchStudents() {
    const response = await fetch('/students');
    if (response.ok) {
        const students = await response.json();
        const tbody = document.getElementById('students-table-body');
        tbody.innerHTML = ''; // Clear existing rows
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.rollno}</td>
                <td>${student.name}</td>
                <td>${student.semester}</td>
                <td><input type="text" value="${student.cat1 || ''}" id="cat1-${student.rollno}"></td>
                <td><input type="text" value="${student.cat2 || ''}" id="cat2-${student.rollno}"></td>
                <td><input type="text" value="${student.cat3 || ''}" id="cat3-${student.rollno}"></td>
                <td><input type="text" value="${student.model || ''}" id="model-${student.rollno}"></td>
                <td><button onclick="saveMarks('${student.rollno}')">Save</button></td>
            `;
            tbody.appendChild(row);
        });
    } else {
        alert('Failed to fetch students');
    }
}


async function saveMarks(rollno) {
    const cat1 = document.getElementById(`cat1-${rollno}`).value;
    const cat2 = document.getElementById(`cat2-${rollno}`).value;
    const cat3 = document.getElementById(`cat3-${rollno}`).value;
    const model = document.getElementById(`model-${rollno}`).value;
    const semester = document.getElementById(`students-table-body`).querySelector(`tr td:nth-child(3)`).innerText;

    const marks = { rollno, cat1, cat2, cat3, model, semester };

    const response = await fetch('/save-marks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(marks)
    });

    if (response.ok) {
        alert('Marks saved successfully');
    } else {
        const errorText = await response.text();
        alert(`Failed to save marks: ${errorText}`);
    }
}

async function saveAllMarks() {
    const rows = document.querySelectorAll('#students-table-body tr');
    const marksData = [];

    for (const row of rows) {
        const rollno = row.children[0].innerText;
        const cat1 = document.getElementById(`cat1-${rollno}`).value;
        const cat2 = document.getElementById(`cat2-${rollno}`).value;
        const cat3 = document.getElementById(`cat3-${rollno}`).value;
        const model = document.getElementById(`model-${rollno}`).value;
        const semester = row.children[2].innerText;

        marksData.push({ rollno, cat1, cat2, cat3, model, semester });
    }

    const response = await fetch('/save-all-marks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates: marksData })
    });

    if (response.ok) {
        alert('All marks saved successfully');
    } else {
        const errorText = await response.text();
        alert(`Failed to save all marks: ${errorText}`);
    }
}
