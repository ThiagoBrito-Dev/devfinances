const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50000,
    date: "29/07/2021",
  },
  {
    id: 2,
    description: "Website",
    amount: 500000,
    date: "29/07/2021",
  },
  {
    id: 3,
    description: "Internet",
    amount: -20000,
    date: "29/07/2021",
  },
];

const Modal = {
  toggle() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.toggle("active");
  },
};

const Transaction = {
  sumIncomes() {
    let incomes = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        incomes += transaction.amount;
      }
    });

    return incomes;
  },
  sumExpenses() {
    let expenses = 0;

    transactions.forEach((transaction) => {
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
  addTransaction(transaction) {
    const tableBody = document.querySelector("tbody");
    const tableRow = document.createElement("tr");
    const tableData = DOM.innerHTMLTransaction(transaction);

    tableRow.innerHTML = tableData;
    tableBody.appendChild(tableRow);
  },
  innerHTMLTransaction(transaction) {
    const amountClass = transaction.amount > 0 ? "income" : "expense";
    const formattedAmount = Utils.formatCurrency(transaction.amount);

    const tableData = `
      <td class="description">${transaction.description}</td>
      <td class="${amountClass}">${formattedAmount}</td>
      <td>${transaction.date}</td>
      <td>
        <img src="assets/minus.svg" alt="Remover transação" />
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
};

transactions.forEach((transaction) => {
  DOM.addTransaction(transaction);
});

DOM.updateBalance();
