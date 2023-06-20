import { TakeScreenshotPayload } from "App/Jobs/TakeScreenshot";

declare module "@ioc:Setten/Queue" {
  interface JobsList {
    "App/Jobs/TakeScreenshot": TakeScreenshotPayload;
  }
}
