import { Movie } from "./movie";

export class MovieResponse {
    page?: number;
    total_pages?: number;
    total_results?: number;
    results?: Movie[];
}