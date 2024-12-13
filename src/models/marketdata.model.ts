import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface MarketDataAttributes {
  id: number;
  instrumentId: number;
  high: number;
  low: number;
  open: number;
  close: number;
  previousClose: number;
  datetime: Date;
}

interface MarketDataCreationAttributes extends Optional<MarketDataAttributes, "id"> {}

class MarketData extends Model<MarketDataAttributes, MarketDataCreationAttributes> implements MarketDataAttributes {
  public id!: number;
  public instrumentId!: number;
  public high!: number;
  public low!: number;
  public open!: number;
  public close!: number;
  public previousClose!: number;
  public datetime!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MarketData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    instrumentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    high: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    low: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    open: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    close: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    previousClose: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "marketdata",
    timestamps: true,
  }
);

export default MarketData;
