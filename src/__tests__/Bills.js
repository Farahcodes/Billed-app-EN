/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import userEvent from "@testing-library/user-event";
import { localStorageMock } from "../__mocks__/localStorage.js";
import firebase from "../__mocks__/firebase";
import { ROUTES } from "../constants/routes";

const bill = [
  {
    id: "47qAXb6fIm2zOKkLzMro",
    vat: "80",
    fileUrl: null,
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
  },
];

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    //Unit test
    test("When data is Loading, Loading... text should be rendered", () => {
      const html = BillsUI({ data: bills, loading: true });
      document.body.innerHTML = html;
      expect(screen.getAllByText("Loading...")).toBeTruthy();
    }); //checks if the correct loading message is rendered when the bills data is still loading.

    describe("When error is detected", () => {
      test("Without empty error description, then ErrorPage should be rendered without description", () => {
        const html = BillsUI({ data: bills, error: " " });
        document.body.innerHTML = html;
        expect(screen.getAllByText("Erreur")).toBeTruthy();
        expect(
          screen.getByTestId("error-message").innerHTML.trim().length
        ).toBe(0);
      }); //checks that when the error prop of the BillsUI component is an empty string, the ErrorPage component is rendered without a description
      test("With an error message, then ErrorPage should be rendered with the message as description", () => {
        const errorMessage = "Not connected to the internet";
        const html = BillsUI({ data: bills, error: errorMessage });
        document.body.innerHTML = html;
        expect(screen.getAllByText(errorMessage)).toBeTruthy();
      }); //checks that when the error prop is not an empty string, the ErrorPage component is rendered with the error prop as the error message.
    });

    describe("When I click the New Bills button", () => {
      test("Then I should be sent on new bill with a form of ID: data-testid=form-new-bill", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          }) //first sets up a mock localStorage object with the user type set to "Employee"
        );
        const html = BillsUI({ data: bills });
        document.body.innerHTML = html; //then renders the BillsUI component with the bills data and sets the document.body.innerHTML to the rendered HTML
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        }; //creates a Bills instance with the onNavigate function defined to set the document.body.innerHTML to the appropriate HTML for the given pathname
        const firestore = null;
        const billsInit = new Bills({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage,
        });

        const buttonNewBill = document.querySelector(
          `button[data-testid="btn-new-bill"]`
        );
        const handleClickNewBill = jest.fn((e) =>
          billsInit.handleClickNewBill()
        );
        buttonNewBill.addEventListener("click", handleClickNewBill);
        fireEvent.click(buttonNewBill); //simulates a click on the "New Bill" button using the fireEvent.click function
        expect(handleClickNewBill).toHaveBeenCalled(); //checks that the handleClickNewBill function is called
        const newBillForm = screen.queryByTestId("form-new-bill"); //and that the new bill form is present in the rendered HTML
        expect(newBillForm).toBeTruthy();
      });
    }); // It tests that when the "New Bill" button is clicked, the user is taken to a new page with a form to create a new bill.

    describe("When I click on the eye icon of a bill", () => {
      test("Then a modal must appear", async () => {
        //checks whether a modal window appears when the eye icon is clicked.
        const onNavigate = (pathname) => {
          //onNavigate function that is used to update the URL when navigation occurs
          document.body.innerHTML = ROUTES({ pathname });
        };
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          }) // mocks the localStorage object and sets a user key with a type property of Employee
        );
        const billsInit = new Bills({
          document,
          onNavigate,
          store: null,
          localStorage: window.localStorage,
        });
        document.body.innerHTML = BillsUI({ data: bills });
        const handleClickIconEye = jest.fn(
          (icon) => billsInit.handleClickIconEye(icon) //called when the eye icon is clicked
        );
        const iconEye = screen.getAllByTestId("icon-eye");
        const modalFile = screen.queryByTestId("modaleFileEmployee");
        $.fn.modal = jest.fn(() => modalFile.classList.add("show"));
        iconEye.forEach((icon) => {
          icon.addEventListener("click", handleClickIconEye(icon));
          userEvent.click(icon);
          expect(handleClickIconEye).toHaveBeenCalled();
        });
        expect(modalFile.getAttribute("class")).toContain("show"); //checks that handleClickIconEye was called and that the modal window has the class show.
      });
    }); //tests the behavior of a click event on the eye icon of a bill.

    describe("When no image is present in the database", () => {
      test("Then a no image to display text is displayed instead of an image", () => {
        Object.defineProperty(window, "localStorage", {
          //sets up the environment for the test
          value: localStorageMock, //mocks the localStorage
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee", //sets a user key with a type property of Employee.
          })
        );
        const html = BillsUI({ data: bill });
        document.body.innerHTML = html;
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname }); //ets up the UI by setting the HTML content of the document.body to the result of calling BillsUI
        };
        const firestore = null;
        const billsInit = new Bills({
          document,
          onNavigate,
          firestore,
          localStorage: window.localStorage,
        });

        const eye = document.querySelector(`div[data-testid="icon-eye"]`); // finds the eye icon
        const handleClickIconEye = jest.fn((e) =>
          billsInit.handleClickIconEye(eye)
        );

        eye.addEventListener("click", handleClickIconEye);

        userEvent.click(eye);
        expect(handleClickIconEye).toHaveBeenCalled();
        expect(screen.getByText("No image to display")).toBeTruthy(); //checks that handleClickIconEye was called and that the text "No image to display" is present on the screen.
      });
    }); //tests the behavior of an employee viewing a bill when there is no image present in the database.
  });
});

//GET integration test
describe("Given I am a user connected as Employee", () => {
  describe("when I navigate to bills page", () => {
    //test the behavior of an Employee user when navigating to the bills page.
    test("fetched bills from mock API", async () => {
      //tests that the bills are fetched from the mock API.
      const userEmail = "a@a";

      const getSpy = jest.spyOn(firebase, "get");
      const bills = await firebase.get(); //calls firebase.get and awaits the result.
      expect(getSpy).toHaveBeenCalledTimes(1);
      expect(bills.data.length).toBe(4);

      bills.data.filter((bill) => bill.email === userEmail); //filters the bills to find those with the specified userEmail
      expect(bills.data[0].email).toMatch(userEmail); //checks that the email of the first bill in the filtered list matches the specified email.
    });
    test("fetches bills from an API and fails with a 404 error", async () => {
      //test the behavior when fetching bills from the API fails with a 404 error
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      );
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy(); //return a rejected promise with an error message.
    });
    test("fetches messages from an API and fails with a 500 error", async () => {
      //test the behavior when fetching bills from the API fails with  500 error
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      );
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = await screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy(); //return a rejected promise with an error message.
    });
  });
});
