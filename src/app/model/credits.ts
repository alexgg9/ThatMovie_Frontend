import { cast } from "./cast";
import { crew } from "./crew";

export class credits{
    id ?: number;
    cast ?: cast[];
    crew ?: crew[];
}