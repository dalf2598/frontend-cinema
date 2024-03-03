import { jest } from "@jest/globals";
import { OPTIONS, API_MOVIE_ID_URL } from "../javascript/constants.js";
import { get_movie_by_id } from "../javascript/get-movie.js";
import mockApiResponse from "./mocks/get-movies-api-response.json";

describe("get_movie_by_id function", () => {
  afterEach(() => {
    global.fetch.mockClear();
  });
  const mockMovieId = "tt0000001"  

  it("should fetch movie by id successfully", async () => {
    const mockMovieResult = mockApiResponse.results.find((movie) => movie.id === mockMovieId);
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(`{"results": ${JSON.stringify(mockMovieResult)}}`),
      })
    );
    const movie = await get_movie_by_id(mockMovieId);
    expect(movie).toEqual(mockMovieResult);
    expect(fetch).toHaveBeenCalledWith(API_MOVIE_ID_URL.replace("{id}", mockMovieId), OPTIONS);
  });

  it("should print an error to console when fails to fetch the movie by id", async () => {
    const mockFailureMessage = "Invalid ID, movie not found";
    global.fetch = jest.fn(() => Promise.reject(mockFailureMessage));
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => jest.fn());
    await get_movie_by_id(mockMovieId);
    expect(consoleErrorMock).toHaveBeenCalledWith(mockFailureMessage);
  });
});