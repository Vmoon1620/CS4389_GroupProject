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
well as install the React environment and dependencies.

### Run the application

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

Then start the Flask server with the command:

<details>
<summary>Run on Windows</summary>

```$ python -m server.src.app```

</details><details>
<summary>Run on Linux/MAC</summary>

```$ python3 -m server.src.app```

</details><br>

## TO BE CONTINUED...