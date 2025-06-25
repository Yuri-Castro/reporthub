export type ElementType =
  | "text"
  | "chart"
  | "table"
  | "divider"
  | "image"
  | "quote"
  | "emoji";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ReportElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  content: any;
  style: {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
    fontSize?: number;
    fontWeight?: string;
    thickness?: number;
    lineStyle?: string;
    marginVertical?: number;
  };
}

export interface ChartData {
  name: string;
  value: number;
}
