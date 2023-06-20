import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
  public async loginForm({ view }: HttpContextContract) {
    return view.render("auth/login");
  }

  public async registerForm({ view }: HttpContextContract) {
    return view.render("auth/register");
  }

  public async login({ auth, request, response, session }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.required(), rules.email()]),
        password: schema.string([rules.required()]),
      }),
      messages: {
        "email.required": "Email is required to login",
        "email.email": "Email is not valid",
        "password.required": "Password is required to login",
      },
    });

    try {
      await auth.use("web").attempt(payload.email, payload.password);
    } catch (e) {
      session.flash("errors.password", "Wrong password");
      return response.redirect("/auth/login");
    }
    response.redirect("/");
  }

  public async register({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate({
      schema: schema.create({
        email: schema.string({}, [
          rules.required(),
          rules.email(),
          rules.unique({ table: "users", column: "email" }),
        ]),
        password: schema.string({}, [rules.required(), rules.confirmed(), rules.minLength(8)]),
      }),
      messages: {
        "email.required": "Email is required to register",
        "email.email": "Email is not valid",
        "email.unique": "Email already used",
        "password.required": "Password is required to register",
        "password.confirmed": "Password confirmation does not match",
        "password.minLength": "Password must be at least 8 characters",
      },
    });

    const user = new User();
    user.email = email;
    user.password = password;
    await user.save();

    await auth.use("web").login(user);

    response.redirect("/");
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth
      .use("web")
      .logout()
      .catch(() => {});

    response.redirect("/");
  }
}
