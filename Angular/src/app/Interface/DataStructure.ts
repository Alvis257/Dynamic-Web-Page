export interface DataStructure {
    id: number;
    name: string;
    Owner: string;
    status: string;
    creationTime: Date;
    responsible: string;
    type: string;
    JsonData: any;
}

export interface MinimalDataStructure {
    name: string;
    type: string;
    responsible: string;
  }