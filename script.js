// ตัวแปรสำหรับเก็บรายการค่าใช้จ่าย
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// สีสำหรับแต่ละประเภทค่าใช้จ่าย
const categoryColors = {
    food: '#FF6384',
    transport: '#36A2EB',
    entertainment: '#FFCE56',
    shopping: '#4BC0C0',
    bills: '#9966FF'
};

// แปลงชื่อประเภทเป็นภาษาไทย
const categoryNames = {
    food: 'อาหาร',
    transport: 'การเดินทาง',
    entertainment: 'บันเทิง',
    shopping: 'ช้อปปิ้ง',
    bills: 'ค่าบริการ'
};

// สร้างกราฟ
let expenseChart;

// เมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    // สร้างกราฟครั้งแรก
    createChart();
    // แสดงรายการค่าใช้จ่าย
    displayExpenses();
    // อัพเดทยอดรวม
    updateTotal();
});

// จัดการการส่งฟอร์ม
document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // รับค่าจากฟอร์ม
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;

    // เพิ่มรายการใหม่
    addExpense(description, amount, category);

    // รีเซ็ตฟอร์ม
    e.target.reset();
});

// เพิ่มรายการค่าใช้จ่าย
function addExpense(description, amount, category) {
    // สร้างออบเจ็กต์รายการใหม่
    const expense = {
        id: Date.now(),
        description,
        amount,
        category,
        date: new Date().toLocaleDateString()
    };

    // เพิ่มลงในอาเรย์
    expenses.push(expense);

    // บันทึกลง localStorage
    saveToLocalStorage();

    // อัพเดทการแสดงผล
    displayExpenses();
    updateTotal();
    updateChart();
}

// ลบรายการค่าใช้จ่าย
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    saveToLocalStorage();
    displayExpenses();
    updateTotal();
    updateChart();
}

// แสดงรายการค่าใช้จ่าย
function displayExpenses() {
    const expenseItems = document.getElementById('expenseItems');
    expenseItems.innerHTML = '';

    // เรียงลำดับจากใหม่ไปเก่า
    expenses.sort((a, b) => b.id - a.id).forEach(expense => {
        const div = document.createElement('div');
        div.className = 'expense-item';
        div.innerHTML = `
            <div class="expense-info">
                <strong>${expense.description}</strong>
                <div class="expense-category">${categoryNames[expense.category]} - ${expense.date}</div>
            </div>
            <div class="expense-amount">
                ${expense.amount.toLocaleString()} บาท
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">ลบ</button>
            </div>
        `;
        expenseItems.appendChild(div);
    });
}

// อัพเดทยอดรวม
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    document.getElementById('totalAmount').textContent = `${total.toLocaleString()} บาท`;
}

// สร้างกราฟ
function createChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.values(categoryNames),
            datasets: [{
                data: [],
                backgroundColor: Object.values(categoryColors)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    updateChart();
}

// อัพเดทข้อมูลกราฟ
function updateChart() {
    // คำนวณยอดรวมแต่ละประเภท
    const categoryTotals = {};
    Object.keys(categoryNames).forEach(category => {
        categoryTotals[category] = expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0);
    });

    // อัพเดทข้อมูลกราฟ
    expenseChart.data.datasets[0].data = Object.values(categoryTotals);
    expenseChart.update();
}

// บันทึกข้อมูลลง localStorage
function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}