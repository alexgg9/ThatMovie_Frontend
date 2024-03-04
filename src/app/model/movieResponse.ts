import { Movie } from "./movie";

export interface MovieResponse {
    page?: number;
    total_pages?: number;
    total_results?: number;
    results?: Movie[];
}