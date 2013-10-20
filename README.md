Copter of Doom
==============

> It'll be the death of you

Installation Instructions
-------------------------

1. Install Node.js
2. `brew install ffmpeg`
3. Install Leiningen
4. checkout this repository
5. cd into the repository
6. `npm install`
7. cd into speechr
8. `lein run`
9. `cd ..`
10. `node app.js`
11. `ffmpeg -i tcp://192.168.1.1:5555 -f mpeg1video -b 0 -b:v 800k -r 30 http://127.0.0.1:8082/test/640/360/`
12. open http://localhost:3000/

Usage Instructions
------------------

- Press the takeoff button to take off
- Press the land button to land

More Info
---------

- [Parrot AR Drone Library](https://github.com/felixge/node-ar-drone)
- [Socket.IO](http://socket.io/)
- [Express.js](http://expressjs.com)
- [Node.js](http://nodejs.org)
