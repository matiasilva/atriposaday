<h1 align="center"><a href="https://atriposaday.lt0.org.uk" target="_blank" rel="noopener noreferrer"><img width="100" alt="tripos_bg" src="https://user-images.githubusercontent.com/23108156/109943464-22dd4b00-7ccd-11eb-8613-706c415109eb.png"></a></h1>

> A Tripos a Day keeps the DoS away...!

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://atriposaday.lt0.org.uk) [![](https://img.shields.io/badge/unicorn-approved-ff69b4.svg)](https://atriposaday.lt0.org.uk)

# A Tripos A Day

_A Tripos a Day_ helps you become a better engineer.

## Features

- subscribe to pre-defined topics (lists of questions) at a frequency of your choice
- receive random Tripos questions straight in your inbox
- track your Tripos paper progress against all papers released since 1996
- bookmark Tripos questions that you want to revisit
- randomly sets you Tripos questions at a frequency of your choice

### Upcoming

- compile custom Tripos tests that mix and match questions
- "question bank"
- export your progress

## Architecture

_A Tripos a Day_ is a simple web application with a node backend using express, a PostgreSQL database and Handlebars for rendering templates.

A Python script has been developed that loads in Tripos papers and via the help of a simple aLgoRitHM we designed, outputs neatly cropped questions for viewing.

## Production deployment

ATAD should be able to run on any modern web server, like nginx or Apache. The only (known) running instance is deployed on Apache.

### Requirements

- a web server capable of reverse proxying
- node >=v14 LTS
- a PostgreSQL database
- `yq`
- a desire to embrace The Node

### Checklist

1. Clone the repository and change directories

   - `git clone https://github.com/matiasilva/atriposaday.git`
   - `cd atriposaday`

2. Install dependencies

   `npm install`

3. Install pm2

   `npm install pm2@latest -g`
   ATAD uses pm2 for process management.

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

   - `NODE_ENV=production npx sequelize-cli db:migrate`
   - `NODE_ENV=production npx sequelize-cli db:seed:all`

   You might also have to create the table, if you haven't already. This runs the "admin" migration, so set up your admin user details in the respective seeder file.

7. Ensure that the app starts on reboot by adding a `cron` entry

   - `crontab -e`
   - `@reboot /path/to/boot.sh`

8. Ensure that the mailer is set up by adding a `cron` entry

   - `crontab -e`
   - `*/15 * * * * /path/to/mailer.sh >> /your/log/file.log 2>&1`

9. Install `yq` if not available

   ```shell
   wget https://github.com/mikefarah/yq/releases/download/v4.6.1/yq_linux_arm -O ./yq &&\
       chmod +x ./yq
   ```

10. Set mail config

   Example config for `ppsw`

   ```js
       config: {
        host: 'ppsw.cam.ac.uk',
        port: 25,
        secure: false,
        logger: true,
        debug: false,
        pool: true
    }
   ```

### Further details

If on the SRCF's webserver, perform all the commands below after switching into your group:

`sudo -Hu atriposaday bash`

## Development

Docker is used for development. Spin up the two necessary containers with the simple development bash script located in `app/scripts/develop.sh`. To avoid headaches, develop on a UNIX-like OS.

### Tips

Creating a new model:

`npx sequelize-cli model:generate --name User --attributes firstName:string`

Generate a seed file:

`npx sequelize-cli seed:generate --name demo-user`

## Credits

Credits for the initial idea go to Jeremy, who turned this into something with me!

Thanks to the [Student-Run Computing Facility](https://www.srcf.net/) for the hosting!

## Technical notes

- There is no if/else for topics (as there is with user subs) as there will always be root-level topics that are added in seeders.
- There is a small edge case where the user logs in to Raven successfully, but hasn't yet confirmed their details, so the `req.user` param is populated with the CRSid instead of the Sequelize user. For all intents and purposes, we disregard this edge case when checking if the user is logged in, since it's unlikely they'd navigate to other pages requiring auth.
- Solution: implement authRequired middleware that checks if req.user exists AND req.user instanceof User
- Topic has two name fields: an internal name `name` that is all caps and snake cased, and a user-facing `prettyName`. Use `name` internally for ease of comparison.
- Aim to minimze redirects, as each redirect queries the DB to deserialize the user.
- We create a Date object to store the hour and minute we send the email, but I have to add a year, so I chose 2001, because that's when I was born :p
- All paths in the app are relative to the root folder, ie. don't start this in `app/`.
- To examine Apache logs, perhaps use something like: https://goaccess.io/download
- Need to copy favicon.ico on SRCF to public dir
- Images are read in the following manner: `<question number>_<index>.png`
  - where index, starting from 0, counts the number of graphs/assets associated with that question. The plain question should just be `<question number>.png`.
- UserAnswerableStat stores all the information tying a user and a question. It is put into the DB as a junction table with additional information on whether a user has completed, bookmarked and the user's difficulty response. A row is only created once the user has submitted any of the above, otherwise assume all properties are false.
- Note the difference between question and answerable. answerable is the generic type, while question is used in user-facing scenarios.
- I need to find a better way of sending users questions they've answered. At present we pick two at random from the topic's pool and then filter. The reverse needs to happen.
