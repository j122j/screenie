import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Queue } from "@ioc:Setten/Queue";

export default class ScreenshotsController {
  public async index({ view, auth }: HttpContextContract) {
    const screenshots = await auth.user!.related("screenshots").query().orderBy("id", "desc");
    return view.render("screenshots/index", {
      screenshots,
    });
  }

  public async store({ request, auth, session, response }: HttpContextContract) {
    const url = request.input("url");

    const screenshot = await auth.user!.related("screenshots").create({
      url,
      status: "pending",
    });

    await screenshot.save();
    await Queue.dispatch("App/Jobs/TakeScreenshot", { screenshotId: screenshot.id });

    session.flash("success", "Screenshot added successfully");
    response.redirect("/");
  }
}
