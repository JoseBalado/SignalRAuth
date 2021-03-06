## Template used for creating the SPA application with React.js
https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-6.0

    dotnet new react -o <output_directory_name> -au Individual

## Run the CRA server independently
https://docs.microsoft.com/en-us/aspnet/core/client-side/spa/react?view=aspnetcore-6.0&tabs=visual-studio

The project is configured to start its own instance of the CRA development server in the background when the ASP.NET Core app starts in development mode. This is convenient because it means you don't have to run a separate server manually.

There's a drawback to this default setup. Each time you modify your C# code and your ASP.NET Core app needs to restart, the CRA server restarts. A few seconds are required to start back up. If you're making frequent C# code edits and don't want to wait for the CRA server to restart, run the CRA server externally, independently of the ASP.NET Core process.

To run the CRA server externally, switch to the ClientApp subdirectory in a command prompt and launch the CRA development server:

    cd ClientApp
    npm start

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

### Installing a root CA certificate in the trust store

Installing a certificate in PEM form

https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-6.0&tabs=visual-studio#trust-https-certificate-on-linux

    sudo apt-get install -y ca-certificates
    dotnet dev-certs https --clean
    dotnet dev-certs https --trust // this updates certificates in folder ~/.aspnet/https
    // Copy the certificate in PEM format to "ca-certificates" folder so
    // update-ca-certificates can update it.
    sudo -E dotnet dev-certs https -ep /usr/local/share/ca-certificates/https.crt --format PEM
    // Do not store the certificate in a subfolder of ./ca-certificates or update-ca-certificates will not work
    sudo update-ca-certificates
    // If the browser does not recognize the certificate, deleting this file /etc/ssl/certs/ca-certificates.crt
    // and creating the certificates again can help.
    // Some certificates are stored here too ~/.pki/nssdb but it is used by certutil utility.

    // To clean the certificate in the browser and accept the new one put this url directly in the 
    // browser navigation bar: "https://192.168.1.33:7268/".

    // Check this file also SignalRAuth/ClientApp/.env.development.local:

    SSL_CRT_FILE=/home/aris/.aspnet/https/signalrauth.pem
    SSL_KEY_FILE=/home/aris/.aspnet/https/signalrauth.key

    // Check this file also SignalRAuth/ClientApp/.env.development:
    PORT=44488
    HTTPS=true


Note: It is important to have the .crt extension on the file, otherwise it will not be processed.

Stop the server, start it again, go to an https page and accept go to unsafe.

### Sefl signed certificate only works for localhost.
If there is a  need to connect from another IP different from localhost, that IP must be in the url.
But then the certificate would be rejected as it was signed for a different ulr, that is, localhost, and not
for the IP of the server.

### Clean the cookies.
When the server is stopped the cookies from the browser need to be deleted.
Open the browser from the link shown in the console by the server.
Logout.
Register a new user.
Stop and start the server.
Open again the browser from the link shown in the console by the server.
Login with the new created user.


## Cors configuration

    builder.Services.AddCors(options =>
    {
            options.AddPolicy("MyAllowSpecificOrigins",
                            policy  =>
                            {
                                policy.AllowAnyHeader();
                                policy.AllowAnyMethod();
                                policy.AllowAnyOrigin();
                                // AllowCredentials() needed to make CORS works.
                                policy.AllowCredentials();
                                // WithOrigins() needed when AllowCredentials() is needed.
                                policy.WithOrigins(
                                    "https://localhost:44488",     // Allow connecting from localhost.
                                    "http://192.168.1.33:3000", // IP of the server and port that wants to connect to this server.
                                                                // The application on the server (JavaScript) trying to connect must use this protocol, IP and port:
                                                                // https://ip-of-this-server:7116/chatHub

                                    "http://localhost:3000"     // Allow connecting from localhost.

                                );
                            });
    });

    // ...

    app.UseCors("MyAllowSpecificOrigins"); // Must be as close a possible to "var app = builder.Build();"


## Configuring proxy for Create-react-app
SignalRAuth/ClientApp/src/setupProxy.js

    module.exports = function(app) {
        const appProxy = createProxyMiddleware(context, {
            target: target,
            secure: false,
            headers: {
            Connection: 'Keep-Alive'
            }
        });

        // Added to proxy WebSockets.
        app.use(
            createProxyMiddleware(["/AuthChatHub","/chatHub"], {
                target: "https://192.168.1.33:7268/",
                secure: false, // Needed to avoid DEPTH_ZERO_SELF_SIGNED_CERT error.
                logger: console,
                ws: true
            })
        );

        app.use(appProxy);
    };


## How to add authentication.

https://docs.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-6.0

### Authenticate users connecting to a SignalR hub
### Bearer token authentication
### Identity Server JWT authentication
### Authorize users to access hubs and hub methods
### Use authorization handlers to customize hub method authorization
