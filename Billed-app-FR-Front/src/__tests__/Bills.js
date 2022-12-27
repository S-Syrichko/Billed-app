/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe ("When I click the eye icon of the first bill", () => {
      test("Then the bill image and image name should be displayed", async () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }

        const testBills = new Bills({ document, onNavigate, store: mockStore, localStorage: null })

        await screen.getAllByTestId('icon-eye')[0]
        const firstIconEye = screen.getAllByTestId('icon-eye')[0]
        const testHandleClickIconEye = jest.fn(() => testBills.handleClickIconEye(firstIconEye))
        firstIconEye.addEventListener('click', testHandleClickIconEye)

        //Avoiding TypeError on $(...).modal
        $.fn.modal = jest.fn();

        //Simulate click
        userEvent.click(firstIconEye);

        await document.querySelector('.bill-proof-container')
        const billProofContainer = document.querySelector('.bill-proof-container')
        const imageFirstBill = screen.getByAltText("Bill")

        //Expectings
        expect(testHandleClickIconEye).toHaveBeenCalled()
        expect(billProofContainer).toBeTruthy()
        expect(imageFirstBill.getAttribute('src')).toMatch(/.*c1640e12-a24b-4b11-ae52-529112e9602a$/)
        expect(screen.getAllByText("preview-facture-free-201801-pdf-1.jpg")).toBeTruthy()

      })
    })
  })
})
