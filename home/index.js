function showL() {
  document.getElementById("login_form").style.display = "flex";
  document.getElementById("register_form").style.display = "none";
}

function showR() {
  document.getElementById("login_form").style.display = "none";
  document.getElementById("register_form").style.display = "flex";
}

async function register(event) {
  event.preventDefault();

  const name = document.f2.name.value;
  const email = document.f2.email.value;
  const password = document.f2.pwd2.value;
  const username = document.f2.user.value;

  try {
    const response = await fetch("https://cine-sphere-chi.vercel.app/adduser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: username,
        email: email,
        password: password,
      }),
    });

    const result = await response.json();

    if (result.status === 200) {
      showL();
    } else {
      document.getElementById("fail2").innerHTML = result.message;
      document.f2.reset();
    }
  } catch (err) {
    document.getElementById("fail2").innerHTML = "Unable to Register !!";
    document.f2.reset();
  }
}
async function login(event) {
  event.preventDefault();

  const username = document.f1.user.value;
  const password = document.f1.pwd1.value;

  try {
    const response = await fetch("https://cine-sphere-chi.vercel.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const result = await response.json();

    if (result.status === 200) {
      localStorage.setItem("username", username);
      window.location.replace("https://cine-sphere-bz91.vercel.app/");
    } else {
      document.getElementById("fail1").innerHTML = result.message;
      document.f1.reset();
    }
  } catch (err) {
    document.getElementById("fail1").innerHTML = "Login Failed !!";
    document.f1.reset();
  }
}
