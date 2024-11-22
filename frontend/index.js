var language = "te";
var page = 1;
var cur_movie;

const APILINK = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3138cbdc0ea47398fa41b29ae9f47cf6&with_original_language=`;
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=3138cbdc0ea47398fa41b29ae9f47cf6&query=";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const host = "http://localhost:8000";

const home1 = document.getElementById("home1");
const goWatch1 = document.getElementById("gowatchlist1");
const goliked1 = document.getElementById("goliked1");
const profile1 = document.getElementById("profile1");
const logout1 = document.getElementById("logout1");

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const home = document.getElementById("home");
const Display = document.getElementsByClassName("display")[0];
const detail_img = document.getElementById("detail_img");
const detail_title = document.getElementById("detail_title");
const year = document.getElementById("year");
const popularity = document.getElementById("popularity");
const rating = document.getElementById("rating");
const overview = document.getElementById("para");
const original_title = document.getElementById("original_title");
const watchlist = document.getElementById("fvrt_box");
const liked = document.getElementById("liked_box");
const watch_btn = document.getElementById("fvrt");
const liked_btn = document.getElementById("liked");
const top_nav = document.getElementsByClassName("topnav")[0];
const nextid = document.getElementById("nextid");
const goWatch = document.getElementById("gowatchlist");
const goliked = document.getElementById("goliked");
const movies = document.getElementById("movies");
const nextdiv = document.getElementById("nextid");

const tl = document.getElementById("tl");
const en = document.getElementById("en");
const hin = document.getElementById("hin");

tl.addEventListener("click", () => {
  language = "te";
  page = 1;
  returnMovies(`${APILINK}${language}&page=${page}`);
});

en.addEventListener("click", () => {
  language = "en";
  page = 1;
  returnMovies(`${APILINK}${language}&page=${page}`);
});

hin.addEventListener("click", () => {
  language = "hi";
  page = 1;
  returnMovies(`${APILINK}${language}&page=${page}`);
});
document.getElementById("menu-icon").addEventListener("click", function () {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("active");
});
document.getElementById("nav-links").addEventListener("click", function () {});
home.addEventListener("click", (e) => {
  Display.style.display = "none";
  if (likedlistactive) likedlistactive = false;
  if (profile_active) profile_active = false;
  if (watchlistactive) watchlistactive = false;
  showSection();
  page = 1;
  returnMovies(`${APILINK}${language}&page=${page}`);
});

const username = localStorage.getItem("username");
let Name;
let email;
let password;
var div_row;
async function getUser(username) {
  try {
    const response = await fetch(`${host}/users/${username}`);
    const userData = await response.json();
    console.log(userData);
    Name = userData.name;
    email = userData.email;
    password = userData.password;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
}
getUser(username);

returnMovies(`${APILINK}${language}&page=${page}`);
function returnMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      console.log(data);
      if (data.results) data = data.results;
      movies.innerHTML = "";
      div_row = document.createElement("div");
      div_row.setAttribute("class", "row");
      data.forEach((element) => {
        const div_card = document.createElement("div");
        div_card.setAttribute("class", "card");
        const div_column = document.createElement("div");
        div_column.setAttribute("class", "column");
        const image = document.createElement("img");
        image.setAttribute("class", "thumbnail");
        image.setAttribute("id", "image");
        const title = document.createElement("h3");
        title.setAttribute("id", "title");

        title.innerHTML = `${element.title}`;
        image.src = IMGPATH + element.poster_path;

        div_card.appendChild(image);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        div_card.addEventListener("click", (e) => {
          e.preventDefault();
          console.log(`clicked title is ${element.title}`);
          cur_movie = element;
          document.getElementById("cat").style.display = "none";
          displaydiv(element);
        });
      });

      nextdiv.innerHTML = "";
      if (url === `${APILINK}${language}&page=${page}`) {
        const nextbtn = document.createElement("button");
        nextbtn.setAttribute("id", "nextbtn");
        nextbtn.innerHTML = "Next";
        nextbtn.onclick = (e) => nextpage(e);

        const prevbtn = document.createElement("button");
        prevbtn.setAttribute("id", "prevbtn");
        prevbtn.innerHTML = "Prev";
        prevbtn.onclick = (e) => prevpage(e);

        nextdiv.appendChild(nextbtn);
        nextdiv.appendChild(prevbtn);
        main.appendChild(nextdiv);
        if (page == 1) {
          prevbtn.style.display = "none";
        } else {
          prevbtn.style.display = "block";
        }
      }
      movies.appendChild(div_row);
    });
}

function nextpage(e) {
  e.preventDefault();
  page++;
  console.log("clikced next" + page);
  returnMovies(`${APILINK}${language}&page=${page}`);
  setTimeout(() => {
    top_nav.scrollIntoView({ behavior: "smooth" });
  }, 5000);
}
function prevpage(e) {
  e.preventDefault();
  page--;
  console.log("clikced prev " + page);
  returnMovies(`${APILINK}${language}&page=${page}`);
  setTimeout(() => {
    top_nav.scrollIntoView({ behavior: "smooth" });
  }, 5000);
}

nextdiv.addEventListener("click", () => {
  Display.style.display = "none";
  document.getElementById("cat").style.display = "flex";
});

async function displaydiv(element) {
  Display.style.display = "flex";
  detail_title.innerHTML = `Title : ${element.title}`;
  original_title.innerHTML = `Original Title : ${element.original_title}`;
  detail_img.src = IMGPATH + element.poster_path;
  year.innerHTML = `Year : ${element.release_date.split("-")[0]}`;
  popularity.innerHTML = `Popularity: ${element.popularity}`;
  rating.innerHTML = `Rating : ${element.vote_average}`;
  overview.innerHTML = element.overview;
  top_nav.scrollIntoView({ behavior: "smooth" });

  var isWatch = await isWatched(element.id, username);
  var isLike = await isLiked(element.id, username);
  console.log(isWatch, isLike, element.id);
  watchlist.checked = isWatch;
  liked.checked = isLike;

  showreview();
}

async function isWatched(movie_id, username) {
  const url = `${host}/iswatched`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        movie_id: movie_id,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      console.log(data.status === 200);
      return data.status === 200;
    } else {
      console.error(`Error: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

async function isLiked(movie_id, username) {
  const url = `${host}/isliked`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        movie_id: movie_id,
      }),
    });

    const data = await response.json();
    if (response.status === 200) {
      console.log(data.status === 200);
      return data.status === 200;
    } else {
      console.error(`Error: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

watch_btn.addEventListener("click", (e) => {
  e.preventDefault();
  watchlist.checked = !watchlist.checked;
  if (watchlist.checked) {
    console.log("adding fvrt");
    addfvrt(cur_movie);
  } else {
    console.log("removing fvrt");
    removefvrt(cur_movie);
  }
});

watchlist.addEventListener("change", (e) => {
  e.preventDefault();
  if (watchlist.checked) {
    console.log("adding fvrt");
    addfvrt(cur_movie);
  } else {
    console.log("removing fvrt");
    removefvrt(cur_movie);
  }
});

liked.addEventListener("change", (e) => {
  e.preventDefault();
  if (liked.checked) {
    addliked(cur_movie);
  } else {
    removeliked(cur_movie);
  }
});

function handleIsLiked(event) {
  event.preventDefault();
  liked.checked = !liked.checked;
  if (liked.checked) {
    addliked(cur_movie);
  } else {
    removeliked(cur_movie);
  }
}

async function addfvrt(element) {
  try {
    const response = await fetch(`${host}/addfvrt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        movie_id: element.id,
        title: element.title,
        original_title: element.original_title,
        poster_path: element.poster_path,
        year: element.release_date,
        rating: element.vote_average,
        overview: element.overview,
        popularity: element.popularity,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log(data.status === 200);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Failed to add to favorites:", error);
    return false;
  }
}

async function addliked(element) {
  try {
    const response = await fetch(`${host}/addliked`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        movie_id: element.id,
        title: element.title,
        original_title: element.original_title,
        poster_path: element.poster_path,
        year: element.release_date,
        rating: element.vote_average,
        overview: element.overview,
        popularity: element.popularity,
      }),
    });

    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      console.log(data.status === 200);
      return true;
    } else {
      console.log(data.status === 200);
      return false;
    }
  } catch (error) {
    console.error("Failed to add to liked:", error);
    return false;
  }
}

function removefvrt(element) {
  fetch(`${host}/removefvrt`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      movie_id: element.id,
    }),
  })
    .then((res) => res.json())
    .then(function (data) {
      if (data.status === 200) {
        console.log("removed successfully");
        return true;
      } else {
        console.log("unable to remove");
        return false;
      }
    });
}
function removeliked(element) {
  fetch(`${host}/removeliked`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      movie_id: element.id,
    }),
  })
    .then((res) => res.json())
    .then(function (data) {
      if (data.status === 200) return true;
      else return false;
    });
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  div_row.innerHTML = "";
  const searchTerm = search.value;

  if (searchTerm) {
    returnMovies(SEARCHAPI + searchTerm);
    Display.style.display = "none";
    search.value = "";
  }
});

const logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
  window.location.replace("home/home.html");
});

function showSection() {
  middle2.style.display = "none";
  main.style.display = "flex";
  document.getElementById("cat").style.display = "flex";
}
function hideSection() {
  main.style.display = "none";
  middle2.style.display = "flex";
}

var profile_active = false;
const middle2 = document.getElementsByClassName("middle2")[0];
middle2.style.display = "none";

document.addEventListener("DOMContentLoaded", function () {
  main.style.display = "flex";
  middle2.style.display = "none";
});

const profile = document.getElementById("profile");
const id = document.getElementById("welcome");
profile.addEventListener("click", (e) => {
  document.getElementById("fail").innerHTML = "";
  if (likedlistactive) likedlistactive = false;
  if (watchlistactive) watchlistactive = false;
  profile_active = !profile_active;
  document.getElementById("pwd2").type = "text";
  if (profile_active) {
    id.innerHTML = `Hello , ${Name}`;
    document.getElementById("username").value = username;
    console.log(username);
    document.getElementById("email").value = email;
    console.log(email);
    console.log(password);
    document.getElementById("pwd2").value = password;
    hideSection();
  } else {
    showSection();
  }
});

function changeP(event) {
  event.preventDefault();
  document.getElementById("username").readOnly = false;
  document.getElementById("email").readOnly = false;
  document.getElementById("pwd2").readOnly = false;

  document.getElementById("username").placeholder = `${username}`;
  document.getElementById("email").placeholder = `${email}`;
  document.getElementById("pwd2").placeholder = `${password}`;

  document.getElementById("fail").innerHTML = "Change Now !!";
}

async function saveChanged(event) {
  event.preventDefault();
  document.getElementById("username").readOnly = true;
  document.getElementById("email").readOnly = true;
  document.getElementById("pwd2").readOnly = true;
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("pwd2").value;

  const response = await fetch(`${host}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
      name: Name,
    }),
  });

  const data = await response.json();
  if (data.status === 200) {
    document.getElementById("fail").innerHTML = "Changes Saved !";
  } else {
    document.getElementById("fail").innerHTML = data.message;
  }

  getUser(username);
  document.getElementById("username").value = username;
  document.getElementById("email").value = email;
  document.getElementById("pwd2").value = password;
}
var watchlistactive = false;
var likedlistactive = false;
var homeactive = false;
goWatch.addEventListener("click", async () => {
  Display.style.display = "none";
  watchlistactive = !watchlistactive;
  if (likedlistactive) likedlistactive = false;
  if (profile_active) profile_active = false;
  if (watchlistactive) displayWatchList(username);
  else returnMovies(APILINK);
});
async function displayWatchList(username) {
  showSection();
  document.getElementById("cat").style.display = "none";
  returnMovies(`${host}/showwatch/${username}`);
}

goliked.addEventListener("click", async () => {
  likedlistactive = !likedlistactive;
  if (watchlistactive) watchlistactive = false;
  if (profile_active) profile_active = false;
  Display.style.display = "none";
  if (likedlistactive) displayLiked(username);
  else returnMovies(APILINK);
});

async function displayLiked(username) {
  showSection();
  document.getElementById("cat").style.display = "none";
  returnMovies(`${host}/showliked/${username}`);
}
function showAlert(message) {
  const alertBox = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");
  document.getElementById("csbtn").style.backgroundColor = "green";
  alertMessage.textContent = message;
  alertBox.style.display = "block";
}

function closeAlert() {
  const alertBox = document.getElementById("customAlert");
  alertBox.style.display = "none";
}

async function showreview() {
  try {
    const res = await fetch(`${host}/showreview/${cur_movie.id}`);
    const data = await res.json();
    console.log(data);
    console.log(cur_movie.id);
    const reviews = document.getElementsByClassName("review_row")[0];
    reviews.innerHTML = "";

    const addReviewDiv = document.createElement("div");
    addReviewDiv.id = "addreview";

    const reviewBtnsDiv = document.createElement("div");
    reviewBtnsDiv.id = "reviewbtns";

    const addReviewBtn = document.createElement("button");
    addReviewBtn.type = "button";
    addReviewBtn.id = "addreviewbtn";
    addReviewBtn.textContent = "ADD";

    const saveReviewBtn = document.createElement("button");
    saveReviewBtn.type = "button";
    saveReviewBtn.id = "savereviewbtn";
    saveReviewBtn.textContent = "SAVE";

    reviewBtnsDiv.appendChild(addReviewBtn);
    reviewBtnsDiv.appendChild(saveReviewBtn);

    const userReviewTextarea = document.createElement("textarea");
    userReviewTextarea.setAttribute("id", "user_review");
    userReviewTextarea.rows = "5";
    userReviewTextarea.placeholder = "Enter Your Review :";

    addReviewDiv.appendChild(reviewBtnsDiv);
    addReviewDiv.appendChild(userReviewTextarea);

    reviews.appendChild(addReviewDiv);

    addReviewBtn.onclick = (e) => addreview(e);
    saveReviewBtn.onclick = (e) => savereview(e);

    if (data.length > 0) {
      data.forEach((element) => {
        const reviewDiv = document.createElement("div");
        reviewDiv.className = "review";

        const usernameH3 = document.createElement("h4");
        usernameH3.textContent = element.username;

        const reviewP = document.createElement("p");
        reviewP.textContent = element.review;

        reviewDiv.appendChild(usernameH3);
        reviewDiv.appendChild(reviewP);

        reviews.appendChild(reviewDiv);
      });
    } else {
      console.log("no reviews");
    }
  } catch (err) {
    console.error("Error fetching reviews:", err);
  }
}

function addreview(event) {
  event.preventDefault();
  const user_review = document.getElementById("user_review");
  const savereviewbtn = document.getElementById("savereviewbtn");
  user_review.style.display = "flex";
  savereviewbtn.style.display = "flex";
}

async function savereview(event) {
  event.preventDefault();
  const user_review = document.getElementById("user_review");
  const savereviewbtn = document.getElementById("savereviewbtn");
  const review = user_review.value;
  try {
    const res = await fetch(`${host}/addreview`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        movie_id: cur_movie.id,
        review: review,
      }),
    });
    const data = await res.json();
    if (data.status === 200) {
      console.log(data.status + "success");
      document.getElementById("csbtn").style.backgroundColor = "green";
      showAlert("Review added successfully");
    } else {
      console.log(data.status + " failed");
      showAlert("Review can't be Empty !");
      document.getElementById("csbtn").style.backgroundColor = "red";
    }
  } catch (err) {
    console.log(err + "failed");
    reviewinfo.innerHTML = `Failed`;
    reviewinfo.style.color = "red";
    reviewinfo.style.display = "flex";
    showAlert("Failed to add review");
  }
  user_review.style.display = "none";
  savereviewbtn.style.display = "none";
  showreview();
}
