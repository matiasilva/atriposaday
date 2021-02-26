# A Tripos A Day

> A Tripos A Day keeps the doctor away...!

*A Tripos A Day* helps you become a better engineer. How?

* it randomly sets you Tripos questions at a frequency of your choice
* you can subscribe to different lists, such as all questions, just those recommended on examples papers, or specific topics that you need practice with
* you can also compile custom Tripos tests that mix and match questions.

## Production

ATAD should be able to run on any modern web server, like nginx or Apache.

Requirements:

* node >=v14
* a PostgreSQL database

## Development

ATAD uses express and `node.js`. Development is done with Docker to create two containers, one for the database and the other for the web app. To avoid headaches, develop on a UNIX-like OS.

Added a new package or dependency? Rebuild the web container.

`docker-compose build`

Creating a new model:

`npx sequelize-cli model:generate --name User --attributes firstName:string`

Generate a seed file:

`npx sequelize-cli seed:generate --name demo-user`

## Credits

Credits for the initial idea go to Jeremy, who  turned this into something with me!

Thanks to the [Student-Run Computing Facility](https://www.srcf.net/) for the hosting!

## Resources

* https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

## Technical notes

There is no if/else for topics (as there is with user subs) as there will always be root-level topics that are added in seeders.
