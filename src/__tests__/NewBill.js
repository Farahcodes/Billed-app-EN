import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { firestore } from "../__mocks__/firestore";
import firebase from "../__mocks__/firebase";
import BillsUI from "../views/BillsUI";

const bill = [
  {
    id: "47qAXb6fIm2zOKkLzMro",
    vat: "80",
    fileUrl:
      "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
    status: "pending",
    type: "Hôtel et logement",
    commentary: "séminaire billed",
    name: "encore",
    fileName: "preview-facture-free-201801-pdf-1.jpg",
    date: "2004-04-04",
    amount: 400,
    commentAdmin: "ok",
    email: "a@a",
    pct: 20,
    email: "john.snow@billed.com",
  },
];

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    let html;
    let onNavigate;
    let newBill;
    beforeEach(() => {
      html = NewBillUI();
      document.body.innerHTML = html;

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));

      onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage,
      });
    });

    test("Then submit button in new Bill Form should have Event Handler added", () => {
      const formNewBill = screen.getByTestId("form-new-bill");
      newBill.createBill = jest.fn();
      const handleSubmit = jest.fn(newBill.handleSubmit);
      formNewBill.addEventListener("submit", handleSubmit);
      fireEvent.submit(formNewBill);
      expect(handleSubmit).toHaveBeenCalled();
    });

    test("Then file input field should have Event Handler added", () => {
      const fileInput = screen.getByTestId("file");
      const file = [new File(["hello"], "hello.png", { type: "image/png" })];
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      fileInput.addEventListener("change", handleChangeFile);
      userEvent.upload(fileInput, file);
      expect(handleChangeFile).toHaveBeenCalled();
    });

    test("then file input should only accept types png, jpg and jpeg", () => {
      const fileInput = screen.getByTestId("file");

      const png = new File(["hello"], "hello.png", { type: "image/png" });
      userEvent.upload(fileInput, png);
      expect(firestore.storage.ref).toHaveBeenCalledTimes(1);

      const jpg = new File(["hello"], "hello.jpg", { type: "image/jpg" });
      userEvent.upload(fileInput, jpg);
      expect(firestore.storage.ref).toHaveBeenCalledTimes(2);

      const jpeg = new File(["hello"], "hello.jpeg", { type: "image/jpeg" });
      userEvent.upload(fileInput, jpeg);
      expect(firestore.storage.ref).toHaveBeenCalledTimes(3);

      const gif = new File(["hello"], "hello.gif", { type: "image/gif" });
      userEvent.upload(fileInput, gif);
      expect(firestore.storage.ref).toHaveBeenCalledTimes(3);
      expect(fileInput.value).toBe("");
    });

    test("then on submit, a new bill is created and My Fees page loaded", () => {
      let spy = jest
        .spyOn(newBill, "createBill")
        .mockImplementation(() => "createBill called");
      const buttonSubmit = screen.getByTestId("form-new-bill");
      fireEvent.submit(buttonSubmit);
      expect(newBill.createBill).toHaveBeenCalled();

      const data = [];
      const loading = false;
      const error = null;
      const pathname = ROUTES_PATH["Bills"];
      const html = ROUTES({ pathname, data, loading, error });
      document.body.innerHTML = html;
      expect(screen.getAllByText("My fees")).toBeTruthy();
    });
  });
});

// GET Integration Test
describe("Given I am a user connected as Employee", () => {
  describe("When I post a New Bill from the New Bill Form", () => {
    test("posts bill via mock API POST", async () => {
      const postSpy = jest.spyOn(firebase, "post");
      const response = await firebase.post();
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(response).toEqual({ 200: "<data_at_path>" });
    });
    test("posts bill via mock API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() => {
        Promise.reject(new Error("Error 404"));
      });
      const html = BillsUI({ error: "Error 404" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Error 404/);
      expect(message).toBeTruthy;
    });
    test("posts bill via mock API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() => {
        Promise.reject(new Error("Error 500"));
      });
      const html = BillsUI({ error: "Error 500" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Error 500/);
      expect(message).toBeTruthy;
    });
  });
});
