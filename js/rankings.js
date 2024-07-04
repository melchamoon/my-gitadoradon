window.onload = async function () {
  const docs = await fetchRankings();
  const table = document.getElementById('ranking-table');
  let rank = 0;
  let previousPoint = null;
  docs.forEach((doc) => {
    const data = doc.data();
    if (previousPoint !== data.point) {
      rank++;
    }
    const row = table.insertRow(-1);
    const cellRank = row.insertCell(0);
    const cellName = row.insertCell(1);
    const cellPoint = row.insertCell(2);

    cellRank.textContent = rank;
    if (data.name == "") {
      cellName.textContent = "名無しさん";
    } else {
      cellName.textContent = data.name.substring(0, 20);
    }
    cellPoint.textContent = data.point;
    previousPoint = data.point;
  });
};
