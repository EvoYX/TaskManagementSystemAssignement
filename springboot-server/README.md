
## Springboot Backend Server
This readme file uses **REACT JS** as Client(Front-end) & **Springboot**
### Create a new springboot project
**Extensions Required:**
- Extension Pack for Java
- Spring Boot Extension pack

#### Create Steps
- In VS code, Ctrl + Shift + P key
- Choose **Spring Initializer: Create a Maven Project...** option
- Choose the first Spring Boot version
- Choose Java as Porgramming language
- Input Group id for project
- Input Artifact Id (Name of the application)
- Select Jar as the packageing type
- Select Java version (according to the version u installed. For my case is java 8)
- Select Dependencies
- DONE

**Group Id:**
- Identifies the organization (shoule be fully qualified domain name) 
<br> Eg: com.learnthepart: <br>
- com is the domain extension
- learnthepart is the name of organization

### Installed Dependencies
![image](https://user-images.githubusercontent.com/56182367/184104663-f88a9cea-6c2a-4e85-96a4-ff7f49156a52.png)
<br>MYSQL Driver & Spring Data JPA is needed to connect springboot to MYSQL workbench. Lombok is a dependencies that save the troubles in typing the entire code out by yourself. Reference: https://springframework.guru/spring-boot-with-lombok-part-1/#:~:text=Project%20Lombok%20is%20a%20Java,easy%2Dto%2Duse%20annotations.

### Springboot Backend Overview

**Entity:**
- The folder contains all database classes,it consists of getter/setter & constructor. Any new table created in the database need to have a entity class to do the basic CRUD(Create/Retrieve/Update/Delete)

**Repository**
- The folder contains all the SQL query for the Service folder to use.

**Service:**
- The folder contains all the logic handling after retriving data from the repository folder.

## Useful Annotations

**@Data:** It can generate getters and setters for those object automatically

**@AllArgsConstructor:**

**@NoArgsConstructor:**
**@ExceptionHandler:** The @ExceptionHandler is an annotation used to handle the specific exceptions & sendin the custom responses to the client

**@ControllerAdvice:** The @ControllerAdvice  is an annotation used to handle the exceptions globally

### Validation annotations (Need to add spring-boot-starter-validatoin dependency)
**@NotNull:** validates that the annotated property value is not null

**@Size:** validates that the annotated property value has a size betwween the attributes min & max; can be applied to String, Collection, Map and array properties.

**@Min:** validates that the annotated property has a value no larger than the value attribute

**@Max:** validates that the annotated property has a value no larger than the value atttribute

**@Email:** validates the the annotated property is a valid email address

**@NotEmpty:** validate that the property is not null or empty; can be applied to String, Collection,Map or Array values

**@NotBlank:** can be applied only to text values and validates that the property is not null or whitespace

## Common Knowledge
**Why create DTO(Data Transfer Object) classes in Spring Boot?**
- We use it to limit the exposure of the stuff that we allow the app to expose for use.(Eg: unit testing)
- Example:
<br>![image](https://user-images.githubusercontent.com/56182367/185888766-2b5da1f4-c6e2-4ab7-ab79-f706173689af.png)
![image](https://user-images.githubusercontent.com/56182367/185888904-25de5f57-b8c5-4f6c-9499-e0658356da7c.png)

## Useful Link
https://www.youtube.com/watch?v=wzQT7Dp9VL0&t=1622s&ab_channel=TechProgramme **Spring Boot with React and MySql (unable to detect sql error)**
**Thanks for reading :smiling_face_with_three_hearts:**




