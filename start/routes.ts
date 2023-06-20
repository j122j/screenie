/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/login", "AuthController.loginForm").as("auth.login");
  Route.post("/login", "AuthController.login");
  Route.get("/register", "AuthController.registerForm").as("auth.register");
  Route.post("/register", "AuthController.register");
  Route.get("/logout", "AuthController.logout").as("auth.logout").middleware("auth");
}).prefix("/auth");

Route.get("/", "ScreenshotsController.index").as("screenshots.index").middleware("auth");
Route.post("/", "ScreenshotsController.store").as("screenshots.store").middleware("auth");
