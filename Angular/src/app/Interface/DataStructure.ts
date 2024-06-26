import { MatButton } from "@angular/material/button";

export interface DataStructure {
    id: number;
    name: string;
    status: string;
    creationTime: Date;
    responsible: string;
    type: string;
}