/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    beforeEach(() => {
      document.body.innerHTML = NewBillUI();

      window.localStorage.clear();
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "johndoe@email",
        })
      );
    });
    afterEach(() => {
      document.body.innerHTML = "";
    });
    test("Then I should not be able to upload .pdf extension file", async () => {
      const newBill = new NewBill({
        document,
        onNavigate: null,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const inputDOM = screen.getByLabelText("Justificatif");
      const testFile = new File(["pdfTest"], "test.pdf", {
        type: "application/pdf",
      });

      //Test function
      const testHandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputDOM.addEventListener("change", testHandleChangeFile);
      //Spying results
      const spyGetItem = jest.spyOn(localStorageMock, "getItem");
      const spyStore = jest.spyOn(mockStore, "bills");

      //Simulating upload
      await userEvent.upload(inputDOM, testFile);

      //Expectings
      expect(testHandleChangeFile).toHaveBeenCalled();
      expect(spyGetItem).not.toHaveBeenCalled();
      expect(spyStore).not.toHaveBeenCalled();
      expect(newBill.fileName).toBeNull();
      expect(newBill.billId).toBeNull();
      expect(newBill.fileUrl).toBeNull();
    });
    test("Then I should be able to upload .jpg extension file", async () => {
      const newBill = new NewBill({
        document,
        onNavigate: null,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const inputDOM = screen.getByLabelText("Justificatif");
      const testFile = new File(["jpgTest"], "test.jpg", {
        type: "image/jpg",
      });

      //Test function
      const testHandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputDOM.addEventListener("change", testHandleChangeFile);

      //Spying results
      const spyGetItem = jest.spyOn(localStorageMock, "getItem");
      const spyStore = jest.spyOn(mockStore, "bills");

      //Simulating upload
      await userEvent.upload(inputDOM, testFile);

      //Expectings
      expect(testHandleChangeFile).toHaveBeenCalled();
      expect(spyGetItem).toHaveBeenCalledWith("user");
      expect(spyStore).toHaveBeenCalled();
      expect(newBill.fileName).toBe("test.jpg");
      expect(newBill.billId).toBe("1234");
      expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg");
      expect(inputDOM.files[0]).toStrictEqual(testFile);
    });
    test("Then I should be able to upload .png extension file", async () => {
      const newBill = new NewBill({
        document,
        onNavigate: null,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const inputDOM = screen.getByLabelText("Justificatif");
      const testFile = new File(["pngTest"], "test.png", {
        type: "image/png",
      });

      //Test function
      const testHandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputDOM.addEventListener("change", testHandleChangeFile);

      //Spying results
      const spyGetItem = jest.spyOn(localStorageMock, "getItem");
      const spyStore = jest.spyOn(mockStore, "bills");

      //Simulating upload
      await userEvent.upload(inputDOM, testFile);

      //Expectings
      expect(testHandleChangeFile).toHaveBeenCalled();
      expect(spyGetItem).toHaveBeenCalledWith("user");
      expect(spyStore).toHaveBeenCalled();
      expect(newBill.fileName).toBe("test.png");
      expect(newBill.billId).toBe("1234");
      expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg");
      expect(inputDOM.files[0]).toStrictEqual(testFile);
    });
    test("Then I should be able to upload .jpeg extension file", async () => {
      const newBill = new NewBill({
        document,
        onNavigate: null,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const inputDOM = screen.getByLabelText("Justificatif");
      const testFile = new File(["jpegTest"], "test.jpeg", {
        type: "image/jpeg",
      });

      //Test function
      const testHandleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      inputDOM.addEventListener("change", testHandleChangeFile);

      //Spying results
      const spyGetItem = jest.spyOn(localStorageMock, "getItem");
      const spyStore = jest.spyOn(mockStore, "bills");

      //Simulating upload
      await userEvent.upload(inputDOM, testFile);

      //Expectings
      expect(testHandleChangeFile).toHaveBeenCalled();
      expect(spyGetItem).toHaveBeenCalledWith("user");
      expect(spyStore).toHaveBeenCalled();
      expect(newBill.fileName).toBe("test.jpeg");
      expect(newBill.billId).toBe("1234");
      expect(newBill.fileUrl).toBe("https://localhost:3456/images/test.jpg");
      expect(inputDOM.files[0]).toStrictEqual(testFile);
    });
    describe("When I submit a new bill", () => {
      test("Then the new bill displays at the Bills page", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };
        const newBill = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        //Simulating upload
        const inputDOM = screen.getByLabelText("Justificatif");
        const testFile = new File(["jpgTest"], "test.jpg", {
          type: "image/jpg",
        });
        await userEvent.upload(inputDOM, testFile);

        // Completing form
        screen.getByTestId("expense-type").value = "Transports"
        screen.getByTestId("expense-name").value = "Test name"
        screen.getByTestId("datepicker").value = "2020-05-08"
        screen.getByTestId("amount").value = "120"
        screen.getByTestId("vat").value = "70"
        screen.getByTestId("pct").value = "30"
        screen.getByTestId("commentary").value = "Test submit"

        // Spying results
        const spyUpdateBill = jest.spyOn(newBill, 'updateBill')

        //Test function
        const submitButton = screen.getByTestId('form-new-bill')
        const testHandleSubmit = jest.fn((e) => newBill.handleSubmit(e))
        submitButton.addEventListener('submit', testHandleSubmit)

        //Simulating form submit
        await userEvent.click(screen.getByText('Envoyer'));

        //Expectations
        expect(testHandleSubmit).toHaveBeenCalled();
        expect(spyUpdateBill.mock.calls[0][0].type).toBe('Transports');
        expect(spyUpdateBill.mock.calls[0][0].name).toBe("Test name");
        expect(spyUpdateBill.mock.calls[0][0].amount).toBe(120);
        expect(spyUpdateBill.mock.calls[0][0].date).toBe('2020-05-08');
        expect(spyUpdateBill.mock.calls[0][0].vat).toBe('70');
        expect(spyUpdateBill.mock.calls[0][0].pct).toBe(30);
        expect(spyUpdateBill.mock.calls[0][0].commentary).toBe('Test submit');
        expect(spyUpdateBill.mock.calls[0][0].fileName).toBe("test.jpg");
        expect(spyUpdateBill.mock.calls[0][0].status).toBe("pending");
        // It should render the Bills page
        await screen.getByText('Mes notes de frais');
        expect(screen.getByText('Mes notes de frais')).toBeTruthy()
      });
    });
  });
});
//POST
describe("Given I am a user connected as employee", () => {
  describe("When I navigate to Bills page", () => {
    test("post a new bill with mock API POST", async () => {
      
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "e@e" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      
      await screen.getByText("Envoyer une note de frais")

      //Simulating upload
      const input = screen.getByTestId('file')
      const testFile = new File(["jpgTest"], "test.jpg", {
        type: "image/jpg",
      });
      await userEvent.upload(input, testFile);

      // Completing form
      screen.getByTestId("expense-type").value = "Transports"
      screen.getByTestId("expense-name").value = "Test name"
      screen.getByTestId("datepicker").value = "2020-05-08"
      screen.getByTestId("amount").value = "120"
      screen.getByTestId("vat").value = "70"
      screen.getByTestId("pct").value = "30"
      screen.getByTestId("commentary").value = "Test submit"

      //Spying results
      jest.spyOn(mockStore, "bills")
      
      //Simulating form submit
      await userEvent.click(screen.getByText('Envoyer'))

      await screen.getByText("Mes notes de frais")
      const billTest1  = screen.getByText("test1")

      //Expectations
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      expect(billTest1).toBeTruthy()
      expect(mockStore.bills).toHaveBeenCalled()
    })
  })
})
