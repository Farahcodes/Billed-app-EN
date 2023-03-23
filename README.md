# Billed-app-

## Getting started
1. Clone this repository to your local machine.

2. Install the dependencies by running npm install.

3. Launch the application with live-server.

4. Access the application at http://127.0.0.1:8080/.

## Objective
This project involves fixing bugs in the Bills & Login feature and adding unit and integration tests for the Bills and NewBill files. The bugs have been identified in the bug report provided. The tasks are tracked on [Kanban board](https://openclassrooms.notion.site/ad964d63250641a7adcb217fb1963480?v=48e567e57b4a4eec8c35bfba3e0502e3) in Notion.

To complete this project, the following tasks needed to be completed:

1. Fix the bugs identified in the Bills & Login feature. These bugs are described in the [Kanban board](https://openclassrooms.notion.site/ad964d63250641a7adcb217fb1963480?v=48e567e57b4a4eec8c35bfba3e0502e3).

2. Add unit and integration tests for the Bills and NewBill files. Some tests have already been developed for the login and HR administrators dashboard, which are checked on the Kanban board. 

3. Develop a test plan to manually test the end-to-end flow of the employee path. 

## Coverage report
![image](https://user-images.githubusercontent.com/87566177/227145219-d68889cf-48b8-4cba-8cbf-0b1ded67310d.png)
## Summary and personal feedback
Working on this project was disappointing and frustrating at the same time, for several reasons:
1. The quality of the initial code base is a disaster.The code is poorly organized, not very readable, poorly/not documented, with a lot of side effects and elements dependent on undocumented states.
2. Writing tests after writing the code (especially when written by someone else) is such a bad practice. The good practice of writing tests is to write them before writing the code. This approach is known as Test-Driven Development (TDD), and it involves writing tests that describe the expected behavior of the code before actually writing the code to implement that behavior.
3. There are errors in the console related to the firebase database (quota exceeded) that is making it impossible to retrieve data in the admin dashboard. This issue has been shared [here](https://github.com/OpenClassrooms-Student-Center/Billed-app-EN/issues/2) but have never been fixed by OpenClassrooms.
![image](https://user-images.githubusercontent.com/87566177/227149113-af0a910a-9707-42e2-a3c5-f4913daef60f.png)
