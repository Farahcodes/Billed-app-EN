import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.firestore = firestore;
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    );
    if (buttonNewBill)
      buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", (e) => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = (e) => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
    if (billUrl === "null") {
      $("#modaleFile")
        .find(".modal-body")
        .html(
          `<div style='text-align: center;'><p>No image to display</p></div>`
        );
      if (typeof $("#modaleFile").modal === "function")
        $("#modaleFile").modal("show");
    } else {
      $("#modaleFile")
        .find(".modal-body")
        .html(
          `<div style='text-align: center;'><img width=${imgWidth} src="${billUrl}" alt="justification"/></div>`
        );
      if (typeof $("#modaleFile").modal === "function")
        $("#modaleFile").modal("show");
    }
  };

  // no need to cover this function by tests
  /* istanbul ignore next */
  getBills = () => {
    const userEmail = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).email
      : "";
    if (this.firestore) {
      return this.firestore
        .bills()
        .get()
        .then((snapshot) => {
          const bills = snapshot.docs
            .map((doc) => {
              console.log("doc is", doc);
              try {
                return {
                  ...doc.data(),
                  date: formatDate(doc.data().date),
                  status: formatStatus(doc.data().status),
                };
              } catch (e) {
                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                // log the error and return unformatted date in that case
                console.log(e, "for", doc.data());
                return {
                  ...doc.data(),
                  date: doc.data().date,
                  status: formatStatus(doc.data().status),
                };
              }
            })
            .filter((bill) => bill.email === userEmail);
          console.log("length", bills.length);
          return bills;
        })
        .catch((error) => {
          console.log("error---", error);
          const bills = [
            {
              id: "47qAXb6fIm2zOKkLzMro",
              vat: "80",
              fileUrl:
                "https://plus.unsplash.com/premium_photo-1672252617589-35d9a810c2d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c3BhaW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
              status: "pending",
              type: "Hôtel et logement",
              commentary: "séminaire billed",
              name: "just a test",
              fileName: "preview-facture-free-201801-pdf-1.jpg",
              date: "2023-04-04",
              amount: 400,
              commentAdmin: "ok",
              email: "a@a",
              pct: 20,
            },
            {
              id: "BeKy5Mo4jkmdfPGYpTxZ",
              vat: "",
              amount: 100,
              name: "test1",
              fileName: "1592770761.jpeg",
              commentary: "plop",
              pct: 20,
              type: "Transports",
              email: "a@a",
              fileUrl:
                "https://images.unsplash.com/photo-1495562569060-2eec283d3391?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3BhaW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
              date: "2023-01-01",
              status: "refused",
              commentAdmin: "Not ok",
            },
            {
              id: "UIUZtnPQvnbFnB0ozvJh",
              name: "test3",
              email: "a@a",
              type: "Services en ligne",
              vat: "60",
              pct: 20,
              commentAdmin: "bon bah d'accord",
              amount: 300,
              status: "accepted",
              date: "2023-03-03",
              commentary: "",
              fileName:
                "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
              fileUrl:
                "https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3BhaW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            },
            {
              id: "qcCK3SzECmaZAGRrHjaC",
              status: "refused",
              pct: 20,
              amount: 200,
              email: "a@a",
              name: "test2",
              vat: "40",
              fileName: "preview-facture-free-201801-pdf-1.jpg",
              date: "2023-02-02",
              commentAdmin: "Please provide a valid invoice",
              commentary: "test2",
              type: "Restaurants et bars",
              fileUrl:
                "https://images.unsplash.com/photo-1561632669-7f55f7975606?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c3BhaW58ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
            },
          ];
          return bills;
        });
    }
  };
}
