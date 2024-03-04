import { credits } from "./credits";
import { Genre } from "./genre";
import { Video } from "./video";


export interface Movie {
    adult?: boolean;
    backdrop_path?: string;
    genres?: Genre[];
    id?: number;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    release_date?: Date;
    title?: string;
    videos?: Video[];
    credits ?: credits;
}