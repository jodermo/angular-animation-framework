# Angular Animation Framework 

| Frameworks |  | Links |
|    ---:| :---          | :---         |
| <img src="https://angular.io/assets/images/logos/angular/angular.svg" height="64"  alt="Angular Logo" /><br>Angular CLI | Client Side TypeScript App | [WEBSITE](https://angular.io)<br> [README](https://github.com/angular/angular-cli/blob/master/README.md)|
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/WebGL_Logo.svg/1199px-WebGL_Logo.svg.png" height="64"  alt="WebGL Logo" /><br>Three-js | 3D Graphic API | [WEBSITE](https://threejs.org/)<br> [README](https://github.com/mrdoob/three.js/blob/dev/README.md)|




<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.
###### *© 2020 - Moritz Petzka - [petzka.com](https://petzka.com/)*
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.5.

## Installation

Run `npm install -g @angular/cli` to install Angular CLI.
Run `npm install` to install dependencies.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Important Files

 * [/src/](./src)
    * [/app/..](./src/app)
       * [/three-animation/](./src/app/three-animation) <sub><sup>THREE.js animation framework component</sup></sub>
            * [three-animation.component.ts](./src/app/three-animation/three-animation.component.ts) <sub><sup>main component</sup></sub>
        * [/start-animation/](./src/app/start-animation) <sub><sup>demo component - how to</sup></sub>
             * [start-animation.component.ts](./src/app/start-animation/start-animation.component.ts)        

 - - -
# Other Helpful Deployment Stuff  
```bash
# pull with docker
$ docker pull mopet/tator:latest

# pull with npm:
$ npm run docker:pull



# build with docker
$ docker build -t mopet/tator:latest .

# build with npm:
$ npm run docker:build



# run image with docker
$ docker run -p 3000:3000 mopet/tator:latest

# run image w with npm:
$ npm run docker:build
```

#### for killing all current running docker container / images:

```bash
# List Images
$ docker ps -a

# Stop All Container
$ docker stop $(docker ps -a -q)

# Remove All Container
$ docker rm $(docker ps -a -q)

# Remove All Images
$ docker rmi $(docker images -q)

# All In One
$ docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q) && docker rmi $(docker images -q)
```

#### Installation - npm only (without docker)

```bash
# NestJS Server
$ npm install

# Angular App
$ cd tator-app/
$ npm install
```

#### Build App - npm only (without docker)

```bash
# NestJS Server
$ npm run build

# Angular App
$ npm run ng:build
```

#### Serve Dev Mode (Angular)

```bash
# ng serve (with proxies)
$ npm run ng:serve
```
  
#### Running The Server (NestJS)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
