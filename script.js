let expenses = [];
let totalAmount = 0;
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expnese-table-body');
const totalAmountCell = document.getElementById('total-amount');
const expenseData = {};
const expenseChartCtx = document.getElementById('expenseChart').getContext('2d');
let expenseChart;

function updateChart() {
    const labels = Object.keys(expenseData);
    const data = Object.values(expenseData);

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(expenseChartCtx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384'
                ],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2
        }
    });
    
}


addBtn.addEventListener('click', function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    const expense = { category, amount, date };
    expenses.push(expense);

    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;
 
    expenseData[category] = (expenseData[category] || 0) + amount;
    updateChart();

    addExpenseRow(expense);
    clearInputs();
});

function addExpenseRow(expense) {
    const newRow = expensesTableBody.insertRow();

    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const actionsCell = newRow.insertCell();

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        expenses.splice(expenses.indexOf(expense), 1);
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;

        expenseData[expense.category] -= expense.amount;
        if (expenseData[expense.category] === 0) delete expenseData[expense.category];
        updateChart();

        expensesTableBody.removeChild(newRow);
    });


    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', function () {
        categorySelect.value = expense.category;
        amountInput.value = expense.amount;
        dateInput.value = expense.date;

        expenses.splice(expenses.indexOf(expense), 1);
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;

        expenseData[expense.category] -= expense.amount;
        if (expenseData[expense.category] === 0) delete expenseData[expense.category];
        updateChart();

        expensesTableBody.removeChild(newRow);
        amountInput.focus();
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
}

function clearInputs() {
    categorySelect.value = '';
    amountInput.value = '';
    dateInput.value = '';
}
