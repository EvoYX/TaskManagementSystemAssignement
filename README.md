
## Task Management System
This Task Management System Repository is created with the use of React,Node Express & MySQL and it consist of the following features:

- Login System
- User Management
- Kanban Board For Task Management
- Restful API for Create Task, Promoting Task State , Retrieval Of Task
- Dockerisation for Server Side

This README.md file shows how to setup the communication between the front-end (Client) & back-End (Server), & the code structure for both front-end and back-end.   

### Installation Setting
- MySQL: Download MYSQL from the MySQL Community Downloads

### Task Management System Overview Structure
![image](https://user-images.githubusercontent.com/56182367/182769064-97bc3af4-b185-46e5-b822-7032f34dbbd8.png)
The above images shows the flow of passing data from back-end to the front-end
- Backend: Model, Controllers & Routes
- Front-end : Sevices,Views

My backend is written in NODE & front-end is written in React JS :
- In order for NODE to communicate with MYSQL, we need to use a open source node called Express.
- For React JS to communicate with NODE (Front-end & Back-end communication), we use AXIOS.

#### Back-end Code Structure
![image](https://user-images.githubusercontent.com/56182367/182772310-199da3e6-29ff-45d6-b4c3-c1b7ad68a00c.png)
<br>**Config => Model => Controller =>Routes**

- Config Folder: This folder will consist of all the backend configuration files. MySQL configuration file (db.js) JWT Secret Key (auth.js)
- Model Folder: This folder **ONLY CONSIST** of all the sql queries.
- Controllers Folder: This folder consist of all the backend logic handling.(Manipulation of data that is retrieve from the database) (Eg: Login)
- Routes Folder: This folder consist of all the routes that is needed for front-end & back-end communication.

#### Front-end Code Structure
![image](https://user-images.githubusercontent.com/56182367/182775271-7a501606-82af-41d6-b14e-49021ef25809.png)
<br>![image](https://user-images.githubusercontent.com/56182367/182775209-99618cd6-684f-41f0-91b5-073fe251ea0e.png)

- Service Folder: This folder consist of all the axios routes that is link to the Back-end (Server). The link must be the **SAME**
- Component Folder: This folder consist of all my react UI.

#### MySQL Database Tables

#### Back-end To Front-end Implementation Example (EG: Retrieve User Data By Username)




