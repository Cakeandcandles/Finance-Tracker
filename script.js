const submitButton = document.getElementById("enter");
const resetButton = document.getElementById("reset");
let pieChart, barChart;


submitButton.addEventListener("click", () => {
  let amountInput = document.getElementById("cash");
  let selected = document.querySelector('input[name="category"]:checked');
  let descInput = document.getElementById("desc");

  let amount = parseFloat(amountInput.value);
  let desc = descInput.value;

  if (!amount || !selected || !desc) {
    alert("Please fill out all fields.");
    return;
  }

  let category = selected.value;
  let timestamp = new Date().toISOString();

  let entry = {
    amount,
    category,
    desc,
    dateAdded: timestamp
  };

  let allData = JSON.parse(localStorage.getItem("financeData") || "[]");
  allData.push(entry);
  localStorage.setItem("financeData", JSON.stringify(allData));

  updateCharts(allData);

 
  amountInput.value = "";
  descInput.value = "";
  selected.checked = false;
});


resetButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all entries?")) {
    localStorage.removeItem("financeData");
    updateCharts([]);
  }
});

function updateCharts(data) {
  let categories = { "essentials": 0, "non-essentials": 0 };
  let descriptions = {};

  data.forEach(entry => {
    categories[entry.category] += entry.amount;
    descriptions[entry.desc] = (descriptions[entry.desc] || 0) + entry.amount;
  });

  let pieData = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: ["#7c4dff", "#ce93d8"]
    }]
  };

  let barData = {
    labels: Object.keys(descriptions),
    datasets: [{
      label: "Spent ($)",
      data: Object.values(descriptions),
      backgroundColor: "#7c4dff"
    }]
  };

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: pieData,
    options: { responsive: true }
  });

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: barData,
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

window.onload = () => {
  let saved = JSON.parse(localStorage.getItem("financeData") || "[]");
  updateCharts(saved);
};
