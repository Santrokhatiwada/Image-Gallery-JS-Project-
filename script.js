const imageWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const closeImgBtn = lightbox.querySelector(".close-icon");
const downloadImgBtn = lightbox.querySelector(".uil-import");





const apiKey = "jiqdbuZlrF3OF7nuwcII0i58tTo6lT8MqQyPBzAXPl55g7k5TGGZearF";
const perpage = 20;
let currentPage = 1;
let searchTerm = null;


const showLightbox = (name,img) => {

    lightbox.querySelector("img").src = img;
    lightbox.querySelector("span").innerText = name;

    downloadImgBtn.setAttribute("data-img",img);

    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";


}


const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map((img) => `
      <li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
      <img src="${img.src.large2x}" alt="img">
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();">
            <i class="uil uil-import"></i>
          </button>
        </div>
      </li>
    `).join(""); // Join the array of HTML strings into a single string
  
  
  };
  


const getImages = (apiURL) => {

    loadMoreBtn.innerText = "Loading..."
    loadMoreBtn.classList.add("disabled"); 
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())  
    .then((data) => {
      console.log(data);
      generateHTML(data.photos);

      loadMoreBtn.innerText = "Load More"
      loadMoreBtn.classList.remove("disabled"); 
    }).catch(()=> alert("Failed to load images"));

};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perpage}`

);

const loadMoreImages = () => {
    currentPage++;
    let apiURL=   `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perpage}`;
apiURL = searchTerm ?`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perpage}`:apiURL ;  

    getImages(apiURL);
}

const loadSearchImages =(e) => {

if(e.target.value === ""){
    return searchTerm = null;
}

if(e.key === "Enter"){
    currentPage=1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML ="";   

getImages( `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perpage}`);

}
}
const hideLightbox = () => {
  // Hiding lightbox on close icon click
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
}

const downloadImg = (imgURL) => {

  fetch(imgURL).then(res => res.blob()).then(file => {
  const a= document.createElement("a");
  a.href= URL.createObjectURL(file);
  a.download = new Date().getTime();
  a.click();
  })
  // .catch(() => alert("Failed to download image!"));
  .catch((error) => console.error("Error while downloading image:", error));
  
  
  }

loadMoreBtn.addEventListener("click",loadMoreImages);
searchInput.addEventListener("keyup",loadSearchImages);
closeImgBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img))




