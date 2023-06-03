An imageboard with the usual set of features and support for real time user boards creation/moderation and post deletion/editing.  
Uses Django REST backend server and lightweight React single page frontend.  

While fully anonymous when browsing, a user gets assigned a random ID after first post or board creation, which is then stored on both server and in the user's browser storage.  
That ID allows to authenticate the user's request when deleting or editing posts, and also when moderating a user created board.  

**Currently in development and lacking many features.**  

It can quite easily be installed using [Docker](https://docs.docker.com/get-docker/) (Desktop or Engine with compose plugin):
```shell
# 1. Сlone the repo:
git clone https://github.com/ts213/mboard.git
# 2. Change the directory:
cd mboard 
# 3. make a copy of .env.example file; use "copy" on Windows
cp .env.example .env
# 4. Download Docker images, then build and run containers:
docker compose up
# 5. After successful installation, it should be running at:
http://localhost:8080/
# 6. Shut it down after with "ctrl-c"
``` 
---
#### Development installation; installation without Docker:
Requirements:  
Python 3.11 +  
Node.js 16+  
PostgreSQL 15+  
Redis 6+  
<sup><sub>Earlier versions might work too but haven't been tested.</sub></sup>  

#### Installation:  
```shell
# repeat steps 1-3 from above
#
# install PostgreSQL and Redis and have them running at their default ports
#
# install python dependecies:
pip install requirements.txt
# install nodejs dependecies:
npm install
# replace the following variables in .env files with:
VITE_API=http://127.0.0.1:8000/
REDIS_HOST=redis://127.0.0.1:6379
DB_HOST=127.0.0.1
# run python server
python manage.py runserver
# run nodejs server
npm run dev
# frontend server should be running at:
http://localhost:5173/

```
<sub>
Refer to .env file for various settings.
</sub>
