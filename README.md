# CS 4389 Data and Applications Security - Fall'23 Project

This project was built to demonstrate the basic principles
of web security and security fundamentals - C.I.A 
(Confidentiality, Integrity, and Authenticity/Availability) through
a mock online banking app.

The project code was developed using python/Flask as a back-end framework,
ReactJS as a front-end framework, and MySQL for its database. This readme
will guide users in installing and setting up all neccessary dependencies
to run the project.

## Prerequisites

This section is a guide to users for installing project dependencies. Please
follow the instructions carefully to ensure successful setup.

### Install Python

This system uses python as the programming language the backend system runs in.
Running the system requires a python installation on the user's machine. Go to
[python's website](https://www.python.org/downloads/) to download and install the 
latest python version. All recent python versions automatically come prepackaged 
with pip (a recursive acronym for 'Pip installs Packages') required to install 
project dependencies.

### Install Node.js

The system also uses Node.js and npm for front-end environment and package management.
Go to the website for [Node](https://nodejs.org/en/) to install the latest version of Node.js.
All recent Node version automatically come prepackaged with npm (Node Package Manager)
required to install project dependencies.

### Instal MySQL

MySQL is the back end database used to store baking information for the demo project.
Various important information such as customer info, accounts, login information, and so on
is stored in the database. The project was tested on MySQL 8, but other versions may still work.
Download the correct installer for MySQL for your system [here](https://dev.mysql.com/doc/refman/8.0/en/installing.html)
and follow the istructions to setup your database.

### Install Docker

Docker is used to run a [Redis](https://redis.io/) container to store user sessions.
Users do not need to download/run redis separately, although they can run it
themselves outside of docker without any project issues. Docker is recommended as
the best option to easily install and run Redis, but it is not required. This guide
will focus on installing it through docker only. Users who wish to install
dependencies through other means are assumed to have the knowledge to do so and will
be on their own; of course, please feel free to ask google, the GitHub community, etc.
as these are excellent resources to find information on such topics.

Assuming you want to procede with installing and running Redis through Docker, follow
these steps:

* Download Docker for your system: see the [Docker Website](https://www.docker.com/products/docker-desktop/).
* Once installed, users can verify the installation was successful with the 'docker' command
on their command line terminal. Type: <br>```$ docker```<br> And the command should print
the docker help message to the terminal.

### Install Redis

* After successful installation of docker, open the docker application and type the following command 
in your terminal to install and setup a Redis container listening on port 6379:<br>
```$ docker run --name <container name> -d -p 6379:6379 redis```<br>
* A successful installation of Redis will result in a brand new container with the name you give it 
in your docker instance. Be sure this Redis container is running when you run the project application.
* Users can verify the Redic container is running by opening up the container terminal (Not their system terminal!)
and running the command <br>```$ redis-cli```<br> You should see the terminal run the redis interface and
display <br>```127.0.0.1:6379>```<br> confirming that the application is running.

## Set up the database
It is important that the database is setup corretly to ensure security of customer information. These instructions
will guide users in setting up:

+ The database schema
+ Their database user
+ Mock data for the project

### Set up the schema
First users must create the database schema and tables before user permissions can be set up. Run the SQL script 'schema'
found in the database directory:<br>
```$ source database/schema.sql```<br>
This will create all the neccessary tables, constraints, triggers, and procedures needed.

### Set up user and permissions
Setting up the correct permissions for database users is critical for database security. Always follow the principle
of least privilege and give your users the minimum permissions they require to perform tasks.

The following script will help users set up correct permissions for the database. Log into your database (to your root account) 
from a terminal in the project root directory, and run the script:<br>
```$ source database/user.sql```<br>
This will automatically setup a database user named 'demo' with the password '123' on localhost 
(meaning that user can *only* access the database from the same machine -<br>
and therefore the applcation will only work if run on the same machine) 
with minimal permissions to run the application.

Alternatively, users may manually enter these commands <br>
(be sure to remember the user, password, and host address, you will need these later):<br>
```
$ DROP USER IF EXISTS '<user>'@'<users_address>';
$ CREATE USER '<user>'@'<users address>' IDENTIFIED BY '<users_password>';
$ GRANT SELECT ON Bank.* TO '<user>'@'<users_address>';
$ GRANT INSERT ON Bank.Users TO '<user>'@'<users_address>';
$ GRANT INSERT ON Bank.Customers TO '<user>'@'<users_address>';
$ GRANT INSERT ON Bank.Customer_Addresses TO '<user>'@'<users_address>';
$ GRANT INSERT ON Bank.Customer_Phone_Numbers TO '<user>'@'<users_address>';
$ FLUSH PRIVILEGES;
```
This set of permissions only allows the user to read records in the bank database,
and insert on records required for customer/user registration. Everything else is denied
by default.

Once permissions are set up, you can check user privileges with the command:<br>
```$ SHOW GRANTS FOR '<user>'@'<users_address>'```<br>

### Set up mock data (Optional)
This final section details how to fill your database with mock data provided with
the project, located in the database/"Mock Data"/ directory. Each of the .csv files
there contain mock info for the various database tables.

These files cannot be imported directly using MySQL built in features due to some
inconsistencies and out of order tables, but we've provided an easy to use python
script to write the insert commands for every record to a file. 

Set up your project environment first before proceeding, see [here](#set-up-project-environment) for setup and [here](#run-the-application-manual-steps) for activating your virtual environment.

This is required because this script uses the werkzueg utility to automatically hash and salt the passwords in the mock user data,<br> 
which is how the actual application handles sensitive information before inserting it into the database. Users passwords would be invalid
if attempting to insert plaintext otherwise.

Once setup and your environment active, run the script:<br>
```$ python database/populate.py <outfile>```<br>
And the script will produce an sql script with insert statements written to the given file path.
This may take several minutes because there are ~roughly 2500 records to process.

Go to your MySQL terminal, and run the script.<br>
```$ source <outfile>```<br> And your database will be populated.

## Set up project Environment

This step is largely automated; simply run the installation scripts named 'setup' appropriate for
your system from the root directory of the project. See below for the correct commands for different OS.

<details>
<summary>Setup for Windows</summary>

Run the file setup.bat: <br>```$ .\setup.bat```

</details><details>
<summary>Setup for Linux/MAC</summary>

Run the file setup.sh: <br>```$ source ./setup.sh```

</details><br>

**Note - Windows users using WSL (Windows Subsystem for Linux) or another Bash terminal should follow the guide
for Linux/MAC setup still.**

This will establish a virtual python environment and all dependencies for the back-end server as
well as install the React environment and dependencies.<br>

Lastly, create a local environment file, '.env' in the server directory. Any key/value pair
put in this file will be automatically added to your environment variables on server startup.
Enter the same database information that you used for the database. The Flask server needs at minimum these lines:<br>

```
DEBUG=True
SECRET_KEY='<Your secret key here>'

DB_HOST='<Your database host address>'          // if you set up your database user with the automatic script, this will be 'localhost'
DB_PORT=<Your database port number>             // if you set up your database user with the automatic script, this will be '3306'
DB_PASSWORD='<Your database password>'          // if you set up your database user with the automatic script, this will be '123'
DB_USER='<Your database user account>'          // if you set up your database user with the automatic script, this will be 'demo'

REDIS_URL='<Your redis container host address>  // if you followed the above guide it will be redis://127.0.0.1:6379>'
```
**_IMPORTANT!!_**
Keep these settings a secret! As with any production server always follow security guidlines. Be sure to use
strong authentication keys, never run in production with debug=true, and set up your database securely. See
the database setup [above](#set-up-the-database).

## Running the application
We have provided an easy automatoc script for running the basic application below, but for
users who wish to pass arguments to the application please start the system manually.<br>
For manually running each part of the application, see these [instructions](#run-the-application-(manual-steps)).

### Run the application (Automatic Script)

This section describes an easy, automated script that users can run the application
with for development. <br>This will compile all the UI in the client folder and build the front-end html and pages,
then launch the web server.

Run the following script from the root project folder:
<details>
<summary>Windows</summary>

```$ .\start.bat```

</details><details>
<summary>Linux/MAC</summary>

```$ bash ./start.sh```

</details>

The application will build the pages and start up on address 127.0.0.1 with default port 5000. (https://127.0.0.1:5000)

### Run the application (Manual Steps)

To run the application, first activate your virtual environment for python with these
commands from project root: <br>

<details>
<summary>Activate virtual Environment in Windows CMD</summary>

```$ server\.project_env\Scripts\activate.bat```

</details><details>
<summary>Activate virtual Environment in Windows Powershell</summary>

```$ server\.project_env\Scripts\activate.ps1```

</details><details>
<summary>Activate virtual Environment in Linux/MAC</summary>

```$ source server/.project_env/bin/activate```

</details><br>

Build the front end pages from the client folder:

```
$ cd client
$ npm run build
```

Then navigate back to root and start the Flask server:

<details>
<summary>Run on Windows</summary>

```
$ cd ..
$ python -m server.src.app
```

</details><details>
<summary>Run on Linux/MAC</summary>

```
$ cd ..
$ python3 -m server.src.app
```

</details><br>

## Final Notes
There are a few quirks worth mentioning so users can avoid troubles. Firstly,
a known issues with many browsers prevents loading the correct certificate
when loading webpages from a different address than the _exact_ host listed.
This means that running the server on 'localhost:5000' for example, is different
than running on '127.0.0.1:5000'. Even though both addresses describe the loopback
address in networking, the application will not function properly if you run
the server on one of those addresses, then navigate to the other address in your
browser. If this occurs, you will most likely see the application fail to function,
and the developer console will display an error "FAILED TO VALIDATE CERT" or a similar message.

Lastly, we did not have time to implemented every features and integrate the UI components
with the back end API. Some features present in the webpage, such as changing your user
profile or transfering funds between accounts will not function.