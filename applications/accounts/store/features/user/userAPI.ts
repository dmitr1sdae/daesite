const fetchMe = async (amount = 1) => {
  const response = await fetch("http://localhost:3000/api/counter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  const result: { data: number } = await response.json();

  return result;
};
