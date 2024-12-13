export interface OrderData {
    userId: number;
    instrumentId?: number | null;
    side: "BUY" | "SELL" | "CASH_IN" | "CASH_OUT";
    size: number;
    price?: number;
    type: "MARKET" | "LIMIT";
    status: "NEW" | "FILLED" | "REJECTED" | "CANCELLED";
    datetime?: Date;
  }

  export interface OrderCreationAttributes extends OrderData {
    datetime: Date; 
  }



