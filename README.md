## Installing SignalR on React App
    cd ClientApp
    npm install @microsoft/signalr

## Add the MySql.Data.EntityFrameworkCore package to the application using the CLI as follows:
    dotnet add package MySql.Data.EntityFrameworkCore --version 8.0.19

## Install MySQL using Docker
### Pull the image and run the container
    docker pull mysql/mysql-server:8.0.17  
    docker run --name=mysql1 -d -p 3306:3306 mysql/mysql-server:8.0.17

### Get random password generated for the root user
    docker logs mysql1  
    docker logs mysql1 2>&1 | grep GENERATED

### Enter the generated root password
    docker exec -it mysql1 mysql -uroot -p

### Grant all privileges to root user so he can connect from outside the container
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';  
    CREATE USER 'root'@'%' IDENTIFIED BY 'root';  
    GRANT ALL PRIVILEGES ON \*.* TO 'root'@'%' WITH GRANT OPTION;  
    FLUSH PRIVILEGES;

### Create the database and give Root access from outside the container
    CREATE DATABASE users_database;

### Create a different user from root, the one used by Spring Boot:
    create user 'dotnetuser'@'%' identified by 'dotnetpassword';  
    grant all on users_database.* to 'dotnetuser'@'%';

## Useful docker commands
### Stop docker container
    docker stop mysql1

### Start again same container. Keeps the ports open. If the image, container and MySQL configuration are all set, only this command is needed to start MySQL after stopping the server or restarting the computer.
    docker start mysql1

### Remove docker container mysql1
    docker rm mysql1

### Remove docker image mysql1
    docker rmi mysql/mysql-server

## Some errors when connecting to the application:

### "Your Connection Is Not Private", "NET::ERR_CERT_AUTHORITY_INVALID" or similar.
* In Chrome click on "Advanced" and then click on "Proceed to "Unsafe".

### "ERR_SPDY_INADEQUATE_TRANSPORT_SECURITY".
* If you get the error ERR_SPDY_INADEQUATE_TRANSPORT_SECURITY in Chrome, run these commands to update your development certificate:

        dotnet dev-certs https --clean
        dotnet dev-certs https --trust


### Clean the cookies.
When the server is stopped the cookies from the browser need to be deleted. Then stop and start the server and login again.
