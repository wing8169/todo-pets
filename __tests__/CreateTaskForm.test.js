import { fireEvent, screen } from "@testing-library/react";
import CreateTaskForm from "../components/CreateTaskForm";
import { renderWithProviders } from "../utils/test-utils";
import BaseSnackbar from "../components/BaseSnackbar";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.mockClear();
});

// test block
describe("create task form", () => {
  test("creating tasks without title", async () => {
    renderWithProviders(
      <>
        <CreateTaskForm open={true} setOpen={() => {}} id="Test ID" />
        <BaseSnackbar />
      </>
    );

    const createTask = screen.getByTestId("createTask");

    fireEvent.click(createTask);

    expect(
      await screen.findByText(/Title must not be empty!/i)
    ).toBeInTheDocument();
  });
  test("creating tasks with title", async () => {
    renderWithProviders(
      <>
        <CreateTaskForm open={true} setOpen={() => {}} id="Test ID" />
        <BaseSnackbar />
      </>
    );

    const title = screen.getByTestId("baseTextAreaField");
    const createTask = screen.getByTestId("createTask");

    fetch.mockResponseOnce(JSON.stringify({}));
    fireEvent.change(title, { target: { value: "Title" } });
    fireEvent.click(createTask);

    expect(
      await screen.findByText(/Successfully created a task!/i)
    ).toBeInTheDocument();
  });
  test("creating tasks with network error", async () => {
    renderWithProviders(
      <>
        <CreateTaskForm open={true} setOpen={() => {}} id="Test ID" />
        <BaseSnackbar />
      </>
    );

    const title = screen.getByTestId("baseTextAreaField");
    const createTask = screen.getByTestId("createTask");

    fetch.mockReject(() => Promise.reject("API is down"));
    fireEvent.change(title, { target: { value: "Title" } });
    fireEvent.click(createTask);

    expect(await screen.findByText(/API is down/i)).toBeInTheDocument();
  });
});
