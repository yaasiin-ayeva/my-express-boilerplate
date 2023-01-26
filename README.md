# my-express-starter-project
Basic expressJS project for flexible applications following dotenv configurations. 
User management, JWT & Bcrypt for authentication, Cors, Mysql

# Steps to run this project:

1. Run :
```bash
npm i
```
2. Please make sure to check you environment. We're using in this project dotenv architecture.<br>
Rename the `./src/.env.example` file to `./src/.env` and then set up inside this file environnement settings

3. Finally Run : 
```bash
npm run dev
```

## Project structure

| Location             |  Content                                   |
|----------------------|--------------------------------------------|
| `/src/.env`  | Environnement settings                    |
| `/src/assets`  | Assets folder                     |
| `/src/entity`   | Entity files wrote with typeORM decorators  |
| `/src/dump`   | DB dump for some tables (alternative for seeders)  |
| `/src/interface`   | Interface for some entities  |
| `/src/service`   | All services file about each entity |
| `/src/controller`   | All controllers file for each service file |
| `/src/route`        | Routes organized by entity with an index |
| `/src/middleware`   | Middlewares for some routes  |
| `/src/index.ts` | API Entry Point with server configurations |
| `/src/dto`     | DTOs for entities          |
| `/src/configs`     | Imported project configurations from an .env file  |
| `/postman`     | Exported postman collection for the project |

## Check Postman Collection for each api
https://documenter.getpostman.com/view/23479319/2s8ZDeSdNg

[link-author]: https://github.com/yaasiin-ayeva
