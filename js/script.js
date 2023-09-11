const btnLoginCta = document.querySelector(".btn-login-cta");
const btnRegisterCta = document.querySelector(".btn-register-cta");
const btnRegister = document.querySelector(".register-btn");
const btnLogin = document.querySelector(".login-btn");
const btnTransfer = document.querySelector(".transfer-btn");
const formLogin = document.querySelector(".form-login");
const formRegister = document.querySelector(".form-register");
const overlay = document.querySelector(".overlay");
const registerNameInput = document.querySelector(".register-name");
const registerUsernameInput = document.querySelector(".register-username");
const registerPinInput = document.querySelector(".register-pin");
const registerConfirmPinInput = document.querySelector(".register-confirm-pin");
const regSmallEl = document.querySelectorAll(".form-error");
const registerInputEl = document.querySelectorAll(".register-input");
const loginInputEl = document.querySelectorAll(".login-input");
const loginUsername = document.querySelector(".login-username");
const loginPin = document.querySelector(".login-pin");
const allInputs = document.querySelectorAll("input");
const congratsModal = document.querySelector(".congrats-modal");
const congratsModalText = document.querySelector(".congrats-text");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");
const mainPage = document.querySelector(".main");
const homePage = document.querySelector(".header");
const homeIconSection = document.querySelector(".home-icon-box");
const greetingEl = document.querySelector(".greeting");
const sideNavItems = document.querySelector(".nav-items");
const sideNavLinks = document.querySelectorAll(".nav-link");
const dashboardContents = document.querySelectorAll(".dashboard-content");
const date = document.querySelector(".date");
const linkLogout = document.querySelector(".log-out");
const transactionsContainer = document.querySelector(".transactions");
const loginUsernameValue = loginUsername.value.trim();
const loginPinValue = loginPin.value.trim();
const curBalanceEl = document.querySelector(".current-bal");
const incBalanceEl = document.querySelector(".incomes-bal");
const expBalanceEl = document.querySelector(".expenses-bal");
const homeIcon = document.querySelectorAll(".home-icon");
const receiverAccTransfer = document.querySelector(".input-account");
const purpTransfer = document.querySelector(".input-purpose");
const pinTransfer = document.querySelector(".input-pin");
const amountTransfer = document.querySelector(".input-amount");
const loginBtnCont = document.querySelector(".btn-cont-login");

const storedUsers = JSON.parse(localStorage.getItem("storedUsers")) || [];
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// To clear Input Fields
const clearInputFields = function () {
  allInputs.forEach((input) => {
    input.value = "";
  });
};

// To clear error messages
const clearErrorMessages = function () {
  regSmallEl.forEach((s) => (s.style.visibility = "hidden"));
};

// Display Page
const displayPage = function () {
  mainPage.classList.add("hidden");
  homePage.classList.remove("hidden");
  // homeIconSection.classList.remove("hidden");
};

// Hide Page
const hidePage = function () {
  mainPage.classList.remove("hidden");
  homePage.classList.add("hidden");

  sideNavLinks.forEach((link) => link.classList.remove("active"));
  document.querySelector(".nav-link").classList.add("active");

  dashboardContents.forEach((d) => {
    d.classList.remove("dashboard-active");
  });
  document.querySelector(".dashboard-1").classList.add("dashboard-active");
};

// Setting error message
const setError = (element, message) => {
  const formControl = element.parentElement;
  const errorDisplay = formControl.querySelector("small");

  errorDisplay.textContent = message;
  errorDisplay.style.visibility = "visible";
};

// Taking the first name out of the full name
const cutFirstName = function (fullName) {
  return fullName.split(" ")[0];
};

// Format Date
const dateFormat = function (dateNew) {
  const date = `${dateNew.getDate()}`.padStart(2, 0);
  const month = `${dateNew.getMonth() + 1}`.padStart(2, 0);
  const year = `${dateNew.getFullYear()}`;

  return `${date}/${month}/${year}`;
};

console.log(dateFormat(new Date()));

// Displaying movements
const displayMovements = (user) => {
  transactionsContainer.innerHTML = "";

  user.movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "transfer";

    const displayDetails = user.details[i];
    const displayDates = dateFormat(user.movementDates[i]);

    const html = ` <div class="transaction">
                <div class="transaction-title id"><p>#00${i + 1}</p></div>
                <div class="transaction-title date"><p>${displayDates}</p></div>
                <div class="transaction-title type type-${type}">
                 <p>${type.toUpperCase()}</p>
                </div>
                <div class="transaction-title details">
                  <p>${displayDetails}</p>
                </div>
                <div class="transaction-title type-${type}  amount">
                  <p>N${Math.abs(mov)}</p>
                </div>
              </div>`;
    transactionsContainer.insertAdjacentHTML("afterbegin", html);
  });
};

// let initialBalance = 100000;

const options = {
  style: "currency",
  currency: "NGN",
};

// Displaying Balances
const displayBalance = (user) => {
  user.balance = user.movements.reduce((acc, mov) => acc + mov, 0);
  curBalanceEl.textContent = new Intl.NumberFormat("en-US", options).format(
    user.balance
  );
};

// Displaying Balances
const displayIncome = (user) => {
  const incomes = user.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  incBalanceEl.textContent = new Intl.NumberFormat("en-US", options).format(
    incomes
  );
};

// Displaying Expenses
const displayExpense = (user) => {
  const expenses = user.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  expBalanceEl.textContent = new Intl.NumberFormat("en-US", options).format(
    Math.abs(expenses)
  );
};

// Implementing Transfers

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Transferred");
  const receiverAccVal = receiverAccTransfer.value;
  const amountTransferVal = Number(amountTransfer.value);
  const purpTransferVal = purpTransfer.value;
  const pinTransferVal = pinTransfer.value;

  const recipient = storedUsers.find((user) => user.account == receiverAccVal);

  if (
    receiverAccVal === "" ||
    amountTransferVal === "" ||
    purpTransferVal === "" ||
    pinTransferVal === ""
  ) {
    alert("KINDLY INPUT YOUR TRANSACTION DETAILS!");
    return;
  }

  if (!recipient) {
    alert("ACCOUNT DOES NOT EXIST!");
    return;
  }

  console.log(currentUser);
  console.log(recipient.movements);
  console.log(currentUser.balance);

  receiverAccTransfer.value =
    amountTransfer.value =
    purpTransfer.value =
    pinTransfer.value =
      "";

  if (
    recipient &&
    amountTransferVal > 0 &&
    pinTransferVal === currentUser.pin &&
    recipient?.account !== currentUser.account &&
    currentUser.balance > amountTransferVal
  ) {
    // Update transfer
    currentUser.movements.push(-amountTransferVal);
    currentUser.details.push(purpTransferVal);
    recipient.movements.push(amountTransferVal);
    recipient.details.push(purpTransferVal);

    // Update Date
    currentUser.movementDates.push(new Date());
    recipient.movementDates.push(new Date());

    displayMovements(currentUser);
    displayBalance(currentUser);
    displayIncome(currentUser);
    displayExpense(currentUser);

    localStorage.setItem("storedUsers", JSON.stringify(storedUsers));
    return;
  }

  if (currentUser.balance < amountTransferVal) {
    alert("YOU HAVE INSUFFICIENT FUNDS!");
    return;
  }

  if (pinTransferVal !== currentUser.pin) {
    alert("INCORRECT PIN!");
  }
});

// Hide overlay
overlay.addEventListener("click", function (e) {
  formLogin.classList.add("hidden");
  formRegister.classList.add("hidden");
  congratsModal.classList.add("hidden");
  overlay.classList.add("hidden");

  clearInputFields();
  clearErrorMessages();
});

// Reveal Login Form
btnLoginCta.addEventListener("click", function (e) {
  e.preventDefault();

  formRegister.classList.add("hidden");
  overlay.classList.add("hidden");

  formLogin.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

registerLink.addEventListener("click", function (e) {
  e.preventDefault();

  clearInputFields();

  formLogin.classList.add("hidden");
  overlay.classList.add("hidden");

  formRegister.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

loginLink.addEventListener("click", function (e) {
  e.preventDefault();

  clearInputFields();

  formRegister.classList.add("hidden");
  overlay.classList.add("hidden");

  formLogin.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

// Reveal Registration form
btnRegisterCta.addEventListener("click", function (e) {
  e.preventDefault();

  formLogin.classList.add("hidden");
  overlay.classList.add("hidden");

  formRegister.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

registerInputEl.forEach((input) => {
  input.addEventListener("input", clearErrorMessages);
});

loginInputEl.forEach((input) => {
  input.addEventListener("input", clearErrorMessages);
});

// Validating Inputs
btnRegister.addEventListener("click", function (e) {
  e.preventDefault();
  const registerNameInputValue = registerNameInput.value.trim();
  const registerUsernameInputValue = registerUsernameInput.value.trim();
  const registerPinInputValue = registerPinInput.value.trim();
  const registerConfirmPinInputValue = registerConfirmPinInput.value.trim();
  let randomNumber = Math.floor(Math.random() * 1000000);

  // Check if input box is empty
  if (registerNameInputValue === "") {
    setError(registerNameInput, "All fields are required");
  }

  if (registerUsernameInputValue === "") {
    setError(registerUsernameInput, "All fields are required");
  }

  if (registerPinInputValue === "") {
    setError(registerPinInput, "All fields are required");
  }

  if (registerConfirmPinInputValue === "") {
    setError(registerConfirmPinInput, "All fields are required");
  }

  if (registerPinInputValue !== registerConfirmPinInputValue) {
    setError(registerConfirmPinInput, "Pins do not match!");
    setError(registerPinInput, "Pins do not match!");
  }

  if (
    registerNameInputValue !== "" &&
    registerUsernameInputValue !== "" &&
    registerPinInputValue !== "" &&
    registerConfirmPinInputValue !== "" &&
    registerPinInputValue === registerConfirmPinInputValue
  ) {
    const newUser = {
      fullname: registerNameInputValue,
      username: registerUsernameInputValue,
      pin: registerPinInputValue,
      account: randomNumber,
      movements: [],
      movementDates: [],
      details: [],
    };

    storedUsers.push(newUser);

    localStorage.setItem("storedUsers", JSON.stringify(storedUsers));

    // alert("Congratulations! You now have a Fictional UBA account");
    // const accountNumber = randomNumber;

    // storedUsers.forEach((acc) => {
    //   console.log(user);
    // });

    congratsModal.classList.remove("hidden");
    congratsModalText.innerHTML = `Congratulations, ${cutFirstName(
      registerNameInputValue
    )}, <br> Your account number is <span style="color: green; font-weight: bold;">${randomNumber}.</span> <br> <br> Kindly memorize your account number for future <em>Fictional</em> transactions. <br> But if you can't, then copy it and save it somewhere.😉`;

    formRegister.classList.add("hidden");
    // overlay.classList.add("hidden");

    // formLogin.classList.remove("hidden");
    // overlay.classList.remove("hidden");
    loginBtnCont.addEventListener("click", function (e) {
      e.preventDefault();

      congratsModal.classList.add("hidden");
      formLogin.classList.remove("hidden");
      //  overlay.classList.add("hidden");
    });
  }
});

// Setting error messages

// Validate registration details
// Validate Name
// Validate username
// Validate pin
// Validate confirm pin

// Validate Name
let currentUser;

// Implementing Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  // console.log(loginUsername.value, loginPin.value);
  // const loginUsernameValue = loginUsername.value.trim();
  // const loginPinValue = loginPin.value.trim();

  // Checking for empty values on both inputs
  if (loginUsername.value === "" && loginPin.value === "") {
    setError(loginUsername, "Please enter a username");
    setError(loginPin, "Please enter a pin");
    return;
  }
  // Checking for empty values on username input
  if (loginUsername.value === "") {
    setError(loginUsername, "Please enter a username");
    return;
  }

  // Checking for empty values on pin inputs
  if (loginPin.value === "") {
    setError(loginPin, "Please enter a pin");
    return;
  }

  // console.log(storedUsers);()

  // const userExists = storedUsers.some(
  //   (user) => user.username === loginUsernameValue
  // );

  currentUser = storedUsers.find(
    (user) => user.username === loginUsername.value
  );
  console.log(currentUser);

  if (currentUser) {
    if (currentUser.pin === loginPin.value) {
      // document.querySelector(".error-flex").style.backgroundColor = "green";
      // document.querySelector(".error-flex").classList.remove("hidden");
      // document.querySelector(".error-flex").textContent =
      //   "You have logged in succesfully!";
      // alert("Success");
      displayPage();
      greetingEl.textContent = `Good Afternoon, ${cutFirstName(
        currentUser.fullname
      )}`;
      displayMovements(currentUser);
      displayBalance(currentUser);
      displayIncome(currentUser);
      displayExpense(currentUser);
      clearInputFields();
    } else {
      // document.querySelector(".error-flex").classList.remove("hidden");
      // document.querySelector(".error-flex").textContent =
      //   "Request failed! Invalid username and password combination!";

      alert("Request failed! Invalid username and password combination.");
      clearInputFields();
    }
  } else {
    // document.querySelector(".error-flex").classList.remove("hidden");
    // document.querySelector(".error-flex").textContent =
    //   "Request failed! Invalid username and password combination!";
    alert("Request failed! Invalid username and password combination.");
    clearInputFields();
  }

  // if (
  //   currentUser.username !== loginUsernameValue ||
  //   currentUser.pin !== loginPinValue
  // ) {
  //   alert("Request failed! Invalid username and password combination.");
  // } else {
  //   alert("Success");
  // }

  // if (currentUser !== loginUsernameValue) {
  //   alert("Failure");
  // }else if(currentUser === loginUsernameValue){

  // }

  // if (userExists && loginPinValue === currentUser.pin) {
  //   alert("Success");
  // } else {
  //   alert("Request failed! Invalid username and password combination.");
  // }

  // if (user.pin === loginPinValue) {
  //   alert("Success");
  // } else {
  //   alert("Failure");
  // }
  // const displayMovements = function (user) {
  //   console.log(currentUser);
  //   transactionsContainer.innerHTML = "";

  //   currentUser.movements.forEach((mov, i) => {
  //     const now = new Date();
  //     console.log(now);
  //     const date = `${now.getDate()}`.padStart(2, 0);
  //     const month = `${now.getMonth() + 1}`.padStart(2, 0);
  //     const year = now.getFullYear();
  //     const type = mov > 0 ? "deposit" : "withdrawal";

  //     const html = ` <div class="transaction">
  //               <div class="transaction-title id"><p>#00${index + 1}</p></div>
  //               <div class="transaction-title date"><p>${date}/${month}/${year}</p></div>
  //               <div class="transaction-title type type-${type}">
  //                <p>${type.toUpperCase()}</p>
  //               </div>
  //               <div class="transaction-title details">
  //                 <p>Sunglasses part payment</p>
  //               </div>
  //               <div class="transaction-title type-${type}  amount">
  //                 <p>${currencyFormat(
  //                   Math.abs(income),
  //                   navigator.language,
  //                   acc.currency
  //                 )}</p>
  //               </div>
  //             </div>`;
  //     transactionsContainer.insertAdjacentHTML("afterbegin", html);
  //   });
  // };

  // displayMovements(currentUser);
});

// Implementing Logout
linkLogout.addEventListener("click", function (e) {
  e.preventDefault();

  hidePage();
});

// Navigating Dashboard links (Changing Tabs)

sideNavItems.addEventListener("click", function (e) {
  e.preventDefault();

  const clicked = e.target.closest(".nav-link");
  console.log(clicked);

  console.log(clicked.dataset.tab);
  sideNavLinks.forEach((link) => link.classList.remove("active"));
  clicked.classList.add("active");

  dashboardContents.forEach((d) => {
    d.classList.remove("dashboard-active");
  });
  console.log(clicked);
  document
    .querySelector(`.dashboard-${clicked.dataset.tab}`)
    .classList.add("dashboard-active");
  console.log(`.dashboard-${clicked.dataset.tab}`);
});

homeIcon.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const clicked = e.target.closest(".home-icon");
    console.log(e.target);
    // link.classList.remove("active");

    console.log(clicked.dataset.tab);

    dashboardContents.forEach((d) => {
      d.classList.remove("dashboard-active");
    });
    document
      .querySelector(`.dashboard-${clicked.dataset.tab}`)
      .classList.add("dashboard-active");
  });
});

// Setting the date

const displayDate = setInterval(function () {
  const now = new Date();
  // console.log(now);
  // const nowDate = `${now.getDate()}`.padStart(2, 0);
  // const month = `${now.getMonth() + 1}`.padStart(2, 0);
  // const year = now.getFullYear();
  // const hour = `${now.getHours()}`.padStart(2, 0);
  // const minutes = `${now.getMinutes()}`.padStart(2, 0);

  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  date.textContent = new Intl.DateTimeFormat("en-US", options).format(now);
}, 1000);

// const options = {
//   style: "currency",
//   currency: "NGN",
// };

// const num = 655424345;
// console.log(new Intl.NumberFormat("en-US", options).format(num));

console.log(new Date());
