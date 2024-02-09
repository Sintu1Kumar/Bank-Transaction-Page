"use strict";

//* Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance-value");
const labelSumIn = document.querySelector(".summary-value-in");
const labelSumOut = document.querySelector(".summary-value-out");
const labelSumInterest = document.querySelector(".summary-value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".form-btn-transfer");
const btnLoan = document.querySelector(".form-btn-loan");
const btnClose = document.querySelector(".form-btn-close");
const btnSort = document.querySelector(".btn-sort");

const inputLoginUsername = document.querySelector(".login-input-user");
const inputLoginPin = document.querySelector(".login-input-pin");
const inputTransferTo = document.querySelector(".form-input-to");
const inputTransferAmount = document.querySelector(".form-input-amount");
const inputLoanAmount = document.querySelector(".form-input-loan-amount");
const inputCloseUsername = document.querySelector(".form-input-user");
const inputClosePin = document.querySelector(".form-input-pin");


const accounts = [
  {
    owner: "Sintu Kumar",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
  },

  {
    owner: "Vivek Kumar",
    movements: [5000, 3400, -150, 790, -3120, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  },

  {
    owner: "Naman Verma",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  },

  {
    owner: "Mohit Singh",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  },
];
console.log(accounts)

const displayMovements = function (movements) {
  // emptying a movements div
  containerMovements.innerHTML = "";

  // creating movements row
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdraw";
    const html = `
      <div class="movements-row">
        <div class="movements-type movements-type-${type}">${i + 1
      } ${type}</div>
        <div class="movements-value">${mov}₹</div>
      </div>
    `;

    // adding movements rows in movements div
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

displayMovements(accounts[0].movements);

const displaySummary = (movement) => {
  const income = movement
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

labelSumIn.textContent = `${income}₹`;

const out = movement
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);

labelSumOut.textContent = `${out}₹`;

const interest = movement
  .filter(mov => mov > 0)
  .map(deposit => (deposit * 1.2) / 100)
  .filter((int, i) => {
    return int > 1;
  })
  .reduce((acc, int) => acc + int, 0);

labelSumInterest.textContent = `${interest}₹`;
};

displaySummary(accounts[0].movements);

const createUserName = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (name) {
        return name[0];
      })
      .join("");
  });
};

createUserName(accounts);

const calcDisplayBalance = (acc) => {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}₹`;
  acc.balance = balance;
};

let currentAccount;

const updateUI = (acc)=>{
   // Display movements
   displayMovements(acc.movements);
   // Display balance
   calcDisplayBalance(acc);
   // Display Summary
   displaySummary(acc.movements);
}

// Event Handler
btnLogin.addEventListener("click", function(e){
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(function(acc){
    return acc.username == inputLoginUsername.value;
  });

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;
    containerApp.style.opacity = 100;
    updateUI(currentAccount);

    inputLoginUsername.value = "";
    inputLoginPin.value = "";
  }
  else{
    labelWelcome.textContent = `WRONG PASSWORD`;
  }
});

btnTransfer.addEventListener("click", function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find((acc)=>{
    return acc.username === inputTransferTo.value;
  });

  if(amount > 0 && receiverAcc && currentAccount.balance > amount && receiverAcc?.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

