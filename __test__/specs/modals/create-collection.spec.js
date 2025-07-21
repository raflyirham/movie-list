import { fireEvent, render, screen } from "@testing-library/react";
import CreateCollectionModal from "@/app/movies/modals/create-collection-modal";

describe("Create Collection Modal", () => {
  describe("when the modal is open", () => {
    beforeEach(() => {
      render(<CreateCollectionModal />);
    });

    test("should render the modal", () => {
      expect(
        screen.getByTestId("create-collection-modal-input")
      ).toBeInTheDocument();
    });

    test("submit button should be disabled when input is empty", () => {
      const submitButton = screen.getByTestId("create-collection-modal-submit");
      expect(submitButton).toBeDisabled();
    });

    test("submit button should be enabled when input is not empty", () => {
      const input = screen.getByTestId(
        "create-collection-modal-input-collection-name"
      );
      fireEvent.change(input, { target: { value: "Test Collection" } });
      const submitButton = screen.getByTestId("create-collection-modal-submit");
      expect(submitButton).toBeEnabled();
    });
  });
});
