import { credits } from "./credits";

export class Movie {
    adult?: boolean;
    backdrop_path?: string;
    genre_ids?: number[];
    genre_names?: string[];
    id?: number;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    release_date?: Date;
    title?: string;
    video?: boolean;
    credits ?: credits;
}