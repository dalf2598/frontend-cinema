import { jest } from "@jest/globals";
import { OPTIONS, API_URL } from "../javascript/constants.js";
import { get_movies } from "../javascript/get-movies.js";
import mockApiResponse from "./mocks/get-movies-api-response.json";

describe("get_movies function", () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it("should fetch movies successfully", async () => {
    const mockMovieResults = mockApiResponse.results;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(`{"results": ${JSON.stringify(mockMovieResults)}}`),
      })
    );
    const movies = await get_movies();
    expect(movies).toEqual(mockMovieResults);
    expect(fetch).toHaveBeenCalledWith(API_URL, OPTIONS);
  });

  it("should print an error to console when fails to fetch movies", async () => {
    const mockFailureMessage = "You are not subscribed to this API";
    global.fetch = jest.fn(() => Promise.reject(mockFailureMessage));
    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => jest.fn());
    await get_movies();
    expect(consoleErrorMock).toHaveBeenCalledWith(mockFailureMessage);
  });
});