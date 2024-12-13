import { DataTypes, Model, Optional, Association } from "sequelize";
import sequelize from "../database";
import Instruments from "./instrument.model";

interface OrderAttributes {
  id: number;
  instrumentId: number | null; 
  userId: number;
  side: "BUY" | "SELL" | "CASH_IN" | "CASH_OUT";
  size: number;
  price?: number;
  type: "MARKET" | "LIMIT";
  status: "NEW" | "FILLED" | "REJECTED" | "CANCELLED";
  datetime: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, "id" | "price"> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public instrumentId!: number | null; 
  public userId!: number; 
  public side!: "BUY" | "SELL" | "CASH_IN" | "CASH_OUT"; 
  public size!: number; 
  public price?: number; 
  public type!: "MARKET" | "LIMIT"; 
  public status!: "NEW" | "FILLED" | "REJECTED" | "CANCELLED";
  public datetime!: Date; 

  
  public instrument?: Instruments;

  
  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date; 

  
  public static associations: {
    instrument: Association<Order, Instruments>;
  };
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    instrumentId: {
      type: DataTypes.INTEGER,
      allowNull: true, 
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    side: {
      type: DataTypes.ENUM("BUY", "SELL", "CASH_IN", "CASH_OUT"),
      allowNull: false,
    },
    size: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("MARKET", "LIMIT"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("NEW", "FILLED", "REJECTED", "CANCELLED"),
      allowNull: false,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: true,
  }
);


Order.belongsTo(Instruments, {
  foreignKey: "instrumentId",
  as: "instrument", 
});

export default Order;
