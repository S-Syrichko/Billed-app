/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ROUTES } from "../constants/routes";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

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
  });
});
