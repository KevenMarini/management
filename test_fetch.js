const url = "https://teamplenum.vercel.app/api/tasks";

fetch(url)
  .then(res => res.json())
  .then(tasks => {
    console.log("Tasks:", tasks);
    if(tasks.length > 0) {
      tasks.forEach(task => {
        fetch(`https://teamplenum.vercel.app/api/tasks/submissions?taskId=${task.id}`)
          .then(res => res.json())
          .then(subs => {
            console.log(`Submissions for Task ${task.id}:`, subs);
          })
          .catch(err => console.error(err));
      });
    }
  })
  .catch(err => console.error(err));
