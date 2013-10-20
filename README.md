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

- Keyboard commands are:
  - enter to take off
  - escape to land
  - "a" to go up
  - "z" to go down
  - arrow up to go forwards
  - arrow down to go backwards
  - arrow left to go left
  - arrow right to go right
- Leap Motion controls are:
  - open hand to take off
  - tilt forward to go forward
  - tilt back to go back
  - tilt left to go left
  - tilt right to go right
  - raise hand to go up
  - lower hand to go down
- Voice commands are:
  - "take off"
  - "land"
  - "stop"
  - "up"
  - "down"
  - "left"
  - "right"
  - "forwards"
  - "backwards"

More Info
---------

- [Parrot AR Drone Library](https://github.com/felixge/node-ar-drone)
- [Socket.IO](http://socket.io/)
- [Express.js](http://expressjs.com)
- [Node.js](http://nodejs.org)
