import { cast } from "./cast";
import { crew } from "./crew";

export interface credits{
    id ?: number;
    cast ?: cast[];
    crew ?: crew[];
}