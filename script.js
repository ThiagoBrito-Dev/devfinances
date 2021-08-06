const Modal = {
  toggle() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.toggle("active");
  },
};

const Storage = {
  get() {
    const transactions = JSON.parse(localStorage.getItem("transactions"));
    return transactions || [];
  },
  set(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },
  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },
  sumIncomes() {
    let incomes = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        incomes += transaction.amount;
      }
    });

    return incomes;
  },
  sumExpenses() {
    let expenses = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });

    return expenses;
  },
  calculateTotal() {
    const incomes = Transaction.sumIncomes();
    const expenses = Transaction.sumExpenses();
    const result = incomes + expenses;

    return result;
  },
};

const DOM = {
  tableBody: document.querySelector("tbody"),

  addTransaction(transaction, index) {
    const tableRow = document.createElement("tr");
    const tableData = DOM.innerHTMLTransaction(transaction, index);

    tableRow.innerHTML = tableData;
    DOM.tableBody.appendChild(tableRow);
  },
  innerHTMLTransaction(transaction, index) {
    const amountClass = transaction.amount > 0 ? "income" : "expense";
    const formattedAmount = Utils.formatCurrency(transaction.amount);

    const tableData = `
      <td class="description">${transaction.description}</td>
      <td class="${amountClass}">${formattedAmount}</td>
      <td>${transaction.date}</td>
      <td>
        <button type="button" onclick=Transaction.remove(${index})>
          <img src="assets/minus.svg" alt="Remover transação" />
        </button>
      </td>
    `;

    return tableData;
  },
  updateBalance() {
    const incomesDisplay = document.querySelector("#incomes-display");
    const expensesDisplay = document.querySelector("#expenses-display");
    const totalAmountDisplay = document.querySelector("#total-display");

    incomesDisplay.innerHTML = Utils.formatCurrency(Transaction.sumIncomes());
    expensesDisplay.innerHTML = Utils.formatCurrency(Transaction.sumExpenses());
    totalAmountDisplay.innerHTML = Utils.formatCurrency(
      Transaction.calculateTotal()
    );
  },
  clearTransactions() {
    DOM.tableBody.innerHTML = "";
  },
};

const Utils = {
  formatCurrency(amount) {
    const mathSign = amount < 0 ? "-" : "";

    amount = String(amount).replace(/\D/g, "");
    amount = amount / 100;
    amount = amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const formattedAmount = mathSign + amount;
    return formattedAmount;
  },
  formatAmount(value) {
    const formattedValue = Math.round(value * 100);
    return formattedValue;
  },
  formatDate(value) {
    const formattedValue = value.split("-").reverse().join("/");
    return formattedValue;
  },
};

const Form = {
  descriptionElement: document.querySelector("input#description"),
  amountElement: document.querySelector("input#amount"),
  dateElement: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.descriptionElement.value,
      amount: Form.amountElement.value,
      date: Form.dateElement.value,
    };
  },
  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },
  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },
  clearFields() {
    Form.descriptionElement.value = "";
    Form.amountElement.value = "";
    Form.dateElement.value = "";
  },
  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();

      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      Modal.toggle();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  initialize() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });
    Storage.set(Transaction.all);
    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    App.initialize();
  },
};

App.initialize();
