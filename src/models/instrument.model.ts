import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface InstrumentAttributes {
  id: number;
  ticker: string;
  name: string;
  type: string;
}

interface InstrumentCreationAttributes extends Optional<InstrumentAttributes, "id"> {}

class Instrument extends Model<InstrumentAttributes, InstrumentCreationAttributes> implements InstrumentAttributes {
  public id!: number;
  public ticker!: string;
  public name!: string;
  public type!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Instrument.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "instruments",
    timestamps: true,
  }
);

export default Instrument;
