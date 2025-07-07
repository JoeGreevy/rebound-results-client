export interface Feature {
    name: string;
    category: string;
    key: string;
}

export type Condition = "start" | "end";
export interface RowVal {
  key: string;
  val: number;
  std: number;
  condition: Condition;
}
export interface Row {
  id : string;
  vals: RowVal[];
}