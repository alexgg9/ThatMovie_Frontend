import { Member } from "./member";
import { Movie } from "./movie";

export interface Review {
    id?: number;
    content?: string;
    rating?: number;
    member?: Member;
    created_at?: Date;
    movie?:Movie;
}