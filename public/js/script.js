
  


  const dueDate = new Date("<%= bookdata.dueDate %>");
  const currentDate = new Date();
  const timeDiff = dueDate - currentDate;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  document.getElementById('days-left').innerText = `Days left to return: ${daysLeft}`;

