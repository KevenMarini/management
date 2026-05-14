const url = "https://teamplenum.vercel.app/api/init-db";

fetch(url)
  .then(res => res.json())
  .then(data => {
    console.log("Init DB Response:", data);
  })
  .catch(err => console.error(err));
