import { Member } from "./member";
import { Movie } from "./movie";

export interface Playlist {
    id ?: number;
    name ?: string;
    like ?: boolean;
    crested_at ?: Date;
    movies ?: Movie[];
    member ?: Member;
}