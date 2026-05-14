fetch("http://localhost:3000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    domain: "Full Stack Web Developer",
    name: "sdfe",
    description: "asdfgf",
    instructions: "",
    questions: [{ text: "", type: "text" }]
  })
}).then(res => res.json()).then(console.log).catch(console.error);
