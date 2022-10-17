import { fireEvent, screen } from "@testing-library/react";
import UpdateTaskForm from "../components/UpdateTaskForm";
import { renderWithProviders } from "../utils/test-utils";
import BaseSnackbar from "../components/BaseSnackbar";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.mockClear();
});

// test block
describe("update task form", () => {
  test("updating tasks without title", async () => {
    renderWithProviders(
      <>
        <UpdateTaskForm
          open={true}
          setOpen={() => {}}
          id="Test ID"
          title=""
          status={false}
          dueAt={new Date()}
        />
        <BaseSnackbar />
      </>
    );

    const button = screen.getByTestId("updateTask");
    fireEvent.click(button);

    expect(
      await screen.findByText(/Title must not be empty!/i)
    ).toBeInTheDocument();
  });
  test("updating tasks with title", async () => {
    renderWithProviders(
      <>
        <UpdateTaskForm
          open={true}
          setOpen={() => {}}
          id="Test ID"
          title=""
          status={false}
          dueAt={new Date()}
        />
        <BaseSnackbar />
      </>
    );

    const title = screen.getByTestId("baseTextAreaField");
    const updateTask = screen.getByTestId("updateTask");

    fetch.mockResponseOnce(JSON.stringify({}));
    fireEvent.change(title, { target: { value: "Title" } });
    fireEvent.click(updateTask);

    expect(
      await screen.findByText(/Successfully updated the task!/i)
    ).toBeInTheDocument();
  });
  test("updating tasks with network error", async () => {
    renderWithProviders(
      <>
        <UpdateTaskForm
          open={true}
          setOpen={() => {}}
          id="Test ID"
          title=""
          status={false}
          dueAt={new Date()}
        />
        <BaseSnackbar />
      </>
    );

    const title = screen.getByTestId("baseTextAreaField");
    const updateTask = screen.getByTestId("updateTask");

    fetch.mockReject(() => Promise.reject("API is down"));
    fireEvent.change(title, { target: { value: "Title" } });
    fireEvent.click(updateTask);

    expect(await screen.findByText(/API is down/i)).toBeInTheDocument();
  });
  test("deleting tasks", async () => {
    renderWithProviders(
      <>
        <UpdateTaskForm
          open={true}
          setOpen={() => {}}
          id="Test ID"
          title=""
          status={false}
          dueAt={new Date()}
        />
        <BaseSnackbar />
      </>
    );

    const deleteTask = screen.getByTestId("deleteTask");

    fetch.mockResponseOnce(JSON.stringify({}));
    fireEvent.click(deleteTask);

    expect(
      await screen.findByText(/Successfully deleted the task./i)
    ).toBeInTheDocument();
  });
  test("deleting tasks with network error", async () => {
    renderWithProviders(
      <>
        <UpdateTaskForm
          open={true}
          setOpen={() => {}}
          id="Test ID"
          title=""
          status={false}
          dueAt={new Date()}
        />
        <BaseSnackbar />
      </>
    );

    const deleteTask = screen.getByTestId("deleteTask");

    fetch.mockReject(() => Promise.reject("API is down"));
    fireEvent.click(deleteTask);

    expect(await screen.findByText(/API is down/i)).toBeInTheDocument();
  });
});
