# lightBnB
LHL Web Flex Program -- Module 5 Project: Relational DB

LightBnb is the solultion for when you need to find exactly the right place to stay.... in your imagination, in a database! 
This application was developed to practice building and understanding full-stack interactions into a true relational database managed through PostgreSQL.

## Getting started in command line
- [ ] Clone your repository onto your local device.
- [ ] Set up a local the database in ![PostgreSQL] (https://www.postgresql.org/download/) named `lightbnb` and connect (\c) to it.
- [ ] In the `lightbnb` Postgres database, \i install the tables in the `migrations` directory
- [ ] Still in the database, \i install the seed data from the `seeds` directory.
- [ ] In the LightBnB_WebApp directory, install dependencies using the `npm install` command.
- [ ] Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
- [ ] Go to <http://localhost:3000/> in your browser and have a look around! Inspect interactions with the database from your commend line using PostgresSQL.

## Action Shots
- ![The WebApp](https://user-images.githubusercontent.com/83998622/164604411-6215f7c3-bce6-4d71-9d3d-4b6eefd0c86a.png)
- Oh look, we can enter new data!
- ![The Database](https://user-images.githubusercontent.com/83998622/164604606-4bac113a-6018-46e2-9ccb-32073199c4dd.png)
- And we can query that database in Postgres
- ![Query Results Displayed on Front End](https://user-images.githubusercontent.com/83998622/164604831-57a43b26-ff86-449c-bd33-ebc844b3541c.png)
- While the front-end is not gorgeous yet, it does use queries to return personalized data back to logged in users!

## Dependencies
- bcrypt
- body-parser
- cookie-session
- express
- nodemon

## Please Note:
This project uses "main" branch naming convention.
