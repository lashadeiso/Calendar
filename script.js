let count = 0;
let eventDate = null;
let eventForDay = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const backButton = document.querySelector(".backButton");
const nextButton = document.querySelector(".nextButton");
const calendar = document.querySelector(".calendar-display");
const currentMonth = document.querySelector(".current-month");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ლაივ დროის ფუნქცია(ანუ საათი)
function liveTime() {
  const curTime = document.querySelector(".cur-time");
  curTime.innerHTML = new Date().toLocaleTimeString();
}

//უნდა გვახსოვდეს შემდეგი რამ:
//  const dt = new Date();
//  const month = dt.getMonth();
//  console.log(month);
// თვეს დაგვიბეჭდავს ყოველთვის რეალური თვეზე ერთით ნაკლებს,ანუ მაგალითად თუ არის მეცხრე
// თვე დაგვიბეჭდავს 8-ს,რადგანაც რეალურად dt.getMonth() არის ინდექსი და არა თვე,ანუ გვაქვს
// მასივი სადაც ჩალაგებულია თვეები და ინდექსაცია ცხადია იწყება 0 იდან. შესაბამისად იანვარი
// იქნება 0 ინდექსზე,თებერვალი 1 ზე და ა.შ. ამიტომაც როცა გვინდა რეალური თვის ამოღება უნდა
// დავწეროთ console.log(month+1)

//ეხლა რაც შეეხება დღეებს:
// const dt = new Date();
// const day = dt.getDate();
// console.log(day);
// აქ თვისგან განსხვავებით დაგვიბეჭდავს რეალურ რიცხვს,რა რიცხვიც არის მიმდინარე თვის.
// ანუ ინდექსის მნიშვნელობა ემთხვევა რიცხვის მნიშვნელობას,ხოლო 0 ინდექსზე დგას გასული თვის
// ბოლო დღე,ანუ ბოლო რიცხვი. -1 ინდექსზე დგას გასული თვის ბოლოდან მეორე რიცხვი და ა.შ
// შესაბამისად თუ გვინდა გვაიგოთ მიმდინარე თვე რა რიცხვით მთვარდება,უნდა დავწეროთ შემდეგი:
// const daysInMonth = new Date(year, month + 1, 0).getDate();
// ანუ გადავეცით წელი,თვე და 0 ინდექსი. ქვემოთ მოყვანილი მაგალითის შესაბამისად თვე და წელი
// ანუ კიდე რო დავაზუსტოთ, რახან month + 1 დავწერეთ,რეალურად ინდექსის მიხედვით გვიწერია
// მიმდინარე თვის შემდეგი თვე,და მიმდინარე თვის შემდეგი თვის 0 ინდექსზე არის მიმდინარე თვის
// ბოლო რიცხვი.

class GetInfo {
  static htmlRender() {
    const dt = new Date();
    // dt ში ვინახავ მიმდინარე თარიღს

    if (count != 0) {
      dt.setMonth(new Date().getMonth() + count);
    }
    // აქ ვეუბნები რო ქაუნთერის გაზრდა ან კლებასთან ერთად dt ში შეცვალოს თვე

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    // აქ უკვე ვარქმევ სახელებს dt დან ამოღებულ დღეს,თვეს და წელს

    const firstDayOfMonth = new Date(year, month, 1);
    // firstDayOfMonth  არის მიმდინარე თვის პირველი რიცხვი

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // daysInMonth  არის მიმდინარე თვის ბოლო რიცხვი,რაც ასევე ნიშნავს მიმდინარე თვეში დღეების რაოდენობას

    const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    // console.log(dateString); დაგვიბეჭდევს შემდეგს: Thursday, 9/1/2022

    const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
    //აქ უკვე ვგებულობთ Thursday რომელ ინდექსზეა ჩვენს შექმნილ weekdays ის მასივში

    currentMonth.innerHTML = `
    ${dt.toLocaleDateString("en-us", { month: "long" })} ${year}
    `;
    //currentMonth ში ჩავწერეთ მიმდინარე თვე(ოღონდ სახელით) და წელი

    calendar.innerHTML = "";

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = document.createElement("div");
      daySquare.classList.add("day");

      if (i > paddingDays) {
        let tempDay = i - paddingDays;
        if (tempDay === day && count === 0) {
          daySquare.id = "currentDay";
          currentEvenet(dt, tempDay);
        }

        daySquare.innerText = tempDay;
        daySquare.addEventListener("click", () => {
          eventDate = `${tempDay}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
          eventForDay = events.filter((e) => e.date === eventDate);
          console.log(eventForDay);
          currentEvenet(dt, tempDay);
          renderEventList(eventForDay);
        });
      } else {
        daySquare.innerText = "*";
      }
      calendar.appendChild(daySquare);
    }
  }
}

GetInfo.htmlRender();

backButton.addEventListener("click", () => {
  count--;
  GetInfo.htmlRender();
});
nextButton.addEventListener("click", () => {
  count++;
  GetInfo.htmlRender();
});

function currentEvenet(date, curDay) {
  const eventSectionWrapper = document.querySelector(".event-section-wrapper");
  eventSectionWrapper.innerHTML = "";
  eventSectionWrapper.innerHTML = `
<div class="event-section">
<div class="cur-allData">
<div class="cur-month-year">
  <div class="cur-month">${date.toLocaleDateString("en-us", {
    month: "long",
  })}</div>
  <div class="cur-year">${date.getFullYear()}</div>
</div>
<div class="cur-weekDay-time">
  <div class="cur-time-title">Current Time</div>
  <div class="slesh">/</div>
  <div class="cur-time"></div>
</div>
</div>
<div class="cur-day-weekDay-time">
<div class=${
    curDay === date.getDate() ? "cur-day-bck-cl" : "cur-day"
  }>${curDay}</div>
</div>
</div>

<div class="cur-event">
  <div class="all-events">
    <div class="events-header">All Events</div>
    
  </div>
    <div class="event-btns">
      <button class="add-evenet" onclick="openModal()">Add Evenet</button>
      <button class="delete-evenet">Delete Evenet</button>
    </div>
</div>
  `;
  setInterval(liveTime, 1000);
}

const newEventModal = document.querySelector("#newEventModal");
const backDrop = document.querySelector("#modalBackDrop");
const eventTitleInput = document.querySelector("#eventTitleInput");
const apptTime = document.querySelector("#appt-time");
const cancelButton = document.querySelector("#cancelButton");
const saveButton = document.querySelector("#saveButton");

//მოდალის გახსნა
function openModal() {
  eventTitleInput.classList.remove("error");
  apptTime.classList.remove("error");
  cancelButton.addEventListener("click", () => {
    closeModal();
  });

  saveButton.addEventListener("click", () => {
    saveEvent();
    renderEventList(eventForDay);
  });
  newEventModal.style.display = "block";
  backDrop.style.display = "block";
}

//მოდალის დახურვა
function closeModal() {
  newEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  apptTime.value = "";
  eventTitleInput.classList.remove("error");
  apptTime.classList.remove("error");
}

//ივენთის დასეივება + ინფუთების ვალიდაცია
function saveEvent() {
  if (eventTitleInput.value != "" && apptTime.value != "") {
    eventTitleInput.classList.remove("error");
    apptTime.classList.remove("error");
    events.push({
      date: eventDate,
      time: apptTime.value,
      eventTitle: eventTitleInput.value,
    });
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
    console.log(123);
  }
  if (apptTime.value === "") {
    apptTime.classList.add("error");
  } else {
    apptTime.classList.remove("error");
  }
  if (eventTitleInput.value === "") {
    eventTitleInput.classList.add("error");
  } else {
    eventTitleInput.classList.remove("error");
  }
}

function renderEventList(evDay) {
  if (evDay && evDay.length > 0) {
    evDay.forEach((item) => {
      document.querySelector(".all-events").innerHTML += `
      <div class="checkbox-delBtn">
 
      <input type="checkbox" class='event-checkBox' value="Bike">
      <div class="ev-time">${item.time}</div>
      <div class=event-title>${item.eventTitle}</div>
              
    </div>

    `;
    });
  }
}
