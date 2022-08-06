
## Task Management System
This Task Management System Repository is created with the use of **React,Node Express & MySQL** and it consist of the following features:

- Login System
- User Management
- Kanban Board For Task Management
- Restful API for Create Task, Promoting Task State , Retrieval Of Task (**The API is at User.route.js File**)
- Dockerisation for Server Side 

In order for **NODE** to connect to **MYSQL**, it will need the **EXPRESS** module & for **REACT** to communicate with routes writtent in **NODE** , it will need **AXIOS**. <br>
<br>As most of the youtube videos and online tutorial only shows 1 layer for their communication between Front-end & Back-end, it makes the entire file lengthy & harder to debug **Eg: 1k line of codes in a single file (Prone to errors & if there's one typo in one line, it will be troublesome to change it,if you just copy and paste the code to multiple file (code reusability)**. It is harder to separate it into different layers as it require more understanding towards functions & classes.

Thus,this README.md file will shows how does my Backend **(NODE EXPRESS & MYSQL)** communicate with Front-end **(REACT JS)**  with 3-layer approach on **Back-end** & 2-layer approach on **Front-end**<br> **Because I scare I forgot :sweat_smile::sweat_smile:**

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
- Controllers Folder: This folder will  use the SQL queries that is created from the model folder and do all the backend logic handling.**(Manipulation of data that is retrieve from the Database / Front-end)** Eg: Login
- Routes Folder: This folder consist of all the routes that is needed for front-end & back-end communication. It uses function that is created from the controller folder.

#### Front-end Code Structure
![image](https://user-images.githubusercontent.com/56182367/182775271-7a501606-82af-41d6-b14e-49021ef25809.png)
<br>![image](https://user-images.githubusercontent.com/56182367/182775209-99618cd6-684f-41f0-91b5-073fe251ea0e.png)

- Service Folder: This folder consist of all the axios routes that is link to the Back-end (Server). The link must be the **SAME**
- Component Folder: This folder consist of all my react UI.


## Example: Back-end To Front-end Implementation (EG: Retrieve User Data By Username)
**Back-end (Server Side)**<br>
In summary of the below image, the **user.model.js** file will pass two paramters (Error & SQL Result) out to **user.controller.js** file.The controller file will manipulate the output receive from the model class and **only** return a single output parameter to the routes that is using the function. 
<br> **NOTE: The number of output parameter is subjective to the creator, you can also only return one output parameter for the model class** 

![image](https://user-images.githubusercontent.com/56182367/182854033-4c262264-96ed-4790-94a1-7f7103fd22e7.png)
<br>
**SQL Tips:** 
- Select Statement will not return any error even if there's no such data in the database. It will just return an empty array when there's nothing in the database. Thus, it is optional to handle error condition for **SELECT** SQL Query. However, it is a must to handle error condition for **INSERT,UPDATE,DELETE** because it will **STOP** your server if you never handle properly

**After finish writing the Back-end, We can TEST using POSTMAN or just move to Front-end Implementation**

**Front-end (Client Side)** <br>
At Client side, we will connect the route from Back-end using **AXIOS** and put it inside the **Service** file. The API_URL is the local host url from our backend server. <br>
Front-end will pass the username parameter to the backend through **AXIOS** & retrieve the data from the database. <br>
![image](https://user-images.githubusercontent.com/56182367/182864438-d1b3651d-4a96-44fa-9c02-4c5106cc4ecc.png)
<br>
**Note: It is not neccessary to put all the AXIOS link on service file. I do not want to write the lengthy axios code on all my react file and make it easier to debug when there's errors/bugs or typo issue. Thus, it is just personal preference** 
<br>

**That all for the full front-end & back-end implementation explaination. Thanks for reading :smiling_face_with_three_hearts:**




