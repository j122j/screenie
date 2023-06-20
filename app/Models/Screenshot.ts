import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column, computed } from "@ioc:Adonis/Lucid/Orm";
import Drive from "@ioc:Adonis/Core/Drive";
import User from "./User";

export default class Screenshot extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public userId: number;

  @column()
  public url: string;

  @column()
  public status: string;

  @column({})
  public image: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  public imageUrl() {
    if (this.image) {
      return Drive.getUrl(`screenshots/${this.image}.jpeg`);
    } else {
      return null;
    }
  }
}
