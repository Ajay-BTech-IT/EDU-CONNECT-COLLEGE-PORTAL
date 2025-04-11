Hi to Everyone, This is a Web Application,
Stack Used:
FRONT END:
1.HTML
2.CSS 
3.JAVA SCRIPT 
BACKEND
1.SQLITE
2.NODE.js 
3.TWILIO(Api Key)

KEY POINTS,

* Able to manage whole college student details
    * We can add student and faculty details by uploading .xls(Bulk Upload)
    * Also details are updatable and removable
* Able to store and Manage their Exam Internal Marks 
* Able to Send Their Every Exam Marks to each student Parents in the college.
    * Message Sends in both SMS and WhatsApp.
    * Here,where hindi or bihar students Receives a Hindi message and Tamil Students Receives a Tamil Message.

STEPS TO RUN IN THE BROWSER,

1.install sqlitestudio and node.js and setup in PC terminal
2. use editors like(VScode) to run.
3.Install dependency in Terminal(On VScode recommended)
    * Ensure you replaced your Twilio credentials in the code(Open Twilio.js and replace).
    npm install express body-parser express-session sqlite3 twilio axios xlsx multer crypto cors

4.start the Server
    * Go to terminal
    * Type npm start or server.js
        *shows message http://localhost:3000

5.Go to any browser.
    * serach the http://localhost:3000
    *Now you able to Access all The Pages.




