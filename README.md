# A Tripos A Day

> A Tripos A Day keeps the doctor away...!

*A Tripos A Day* helps you become a better engineer. How?

* it randomly sets you Tripos questions at a frequency of your choice
* you can subscribe to different lists, such as all questions, just those recommended on examples papers, or specific topics that you need practice with
* you can also compile custom Tripos tests that mix and match questions.

## Production

ATAD should be able to run on any modern web server, like nginx or Apache.

Requirements:

* node >=v14 LTS
* a PostgreSQL database
* a desire to embrace The Node

### Deployment details

If on the SRCF's webserver, perform all the commands below after switching into your group:

`sudo -Hu atriposaday bash`

### Instructions

1. Clone the repository and change directories
`git clone https://github.com/matiasilva/atriposaday.git && cd atriposaday`

2. Install dependencies
`npm install`

3. Install `pm2`
ATAD uses `pm2` for process management.
`npm install pm2@latest -g`

4. Change database configuration in `app/config/config.js`
NB. The defaults for production are set up for `ident` auth.

5. Create the web server config file (shown below for Apache) and move it to your public directory (eg. `var/www` or `public_html`)

Example `.htaccess` file:

```apache
# don't show the default listing of files
DirectoryIndex disabled
# turn on mod_rewrite
RewriteEngine On
# set a few useful request headers
RequestHeader set Host expr=%{HTTP_HOST}
RequestHeader set X-Forwarded-For expr=%{REMOTE_ADDR}
RequestHeader set X-Forwarded-Proto expr=%{REQUEST_SCHEME}
RequestHeader set X-Real-IP expr=%{REMOTE_ADDR}
# RewriteCond %{HTTP_HOST} ^some.domain$
RewriteRule ^(.*)$ unix:/path/to/socket|http://my.domain/$1 [P,NE,L,QSA]
```

6. Migrate and seed the database

`NODE_ENV=production npx sequelize-cli db:migrate`
`NODE_ENV=production pm2snpx sequelize-cli db:seed:all`

You might also have to create the table, if you haven't already.

7. Ensure that the app starts on reboot by adding a `cron` entry
`crontab -e`
`@reboot /path/to/boot.sh`

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

There is a small edge case where the user logs in to Raven successfully, but hasn't yet confirmed their details, so the `req.user` param is populated with the CRSid instead of the Sequelize user. For all intents and purposes, we disregard this edge case when checking if the user is logged in, since it's unlikely they'd navigate to other pages requiring auth.

Solution: implement authRequired middleware that checks if req.user exists AND req.user instanceof User

Topic has two name fields: an internal name `name` that is all caps and snake cased, and a user-facing `prettyName`. Use `name` internally for ease of comparison.

Aim to minimze redirects, as each redirect queries the DB to deserialize the user.

We create a Date object to store the hour and minute we send the email, but I have to add a year, so I chose 2001, because that's when I was born :p


All paths in the app are relative to the root folder, ie. don't start this in  `app/`.

To examine Apache logs, perhaps use something like: https://goaccess.io/download