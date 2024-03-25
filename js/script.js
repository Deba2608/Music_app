console.log('Lets write javascript');
let currentSong = new Audio();
let songs;
let currfolder;

//seconds to minutes : second format
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
         
                          <img class="invert" src="img/music.svg" alt="">
                             <div class="info">
                                 <div class="song">${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
                                 <div>Debayan</div>
                             </div>
                             <div class="playnow">
                                 <span>Play Now</span>
                                 <img src="img/play.svg" alt="">
                             </div>
                         </li>
                     </li> `;
    }

    // attach an event listener to each song in the libary section
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            
        })
    })
    return songs;
}


const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+ track)
    track += ".mp3"
    currentSong.src = `/${currfolder}/` + track;

    if (!pause) {

        currentSong.play()
        play.src = "img/pause.svg"
    }


    // document.querySelector(".playnow").innerHTML ="Playing"
    document.querySelector(".songinfo").innerHTML = decodeURI(track.replaceAll(".mp3", ""));
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(4)[0];

            //get the meta data of the folder
            currfolder=folder;
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div  data-folder="${folder}" class="card rounded">
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"
                    fill="none">
                    <circle cx="50" cy="50" r="25" fill="#1fdf64" />
                    <g transform="translate(39, 38)">
                        <path d="M5 20V4L19 12L5 20Z" fill="#000" />
                    </g>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0].replace(".mp3", ""));
        })
    })


}


async function main() {


    // get the list of all the songs
    await getSongs("songs/Bengali");
    playMusic(songs[0].replace(".mp3", ""), true);

    //Display all the albums on the page
    displayAlbums()


    // Attach an event listener to play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //add an eventlistner to previous
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1].replace(".mp3", ""))
        }

    })

    //add an eventlistner to  next
    next.addEventListener("click", () => {
        currentSong.pause()
        play.src = "img/play.svg"

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1].replace(".mp3", ""))
        } else {
            play.src = "img/play.svg"
        }

    })


    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100+ "%";
        
        const value = (currentSong.currentTime / currentSong.duration) * 100;
        document.querySelector(".seekbar").style.background = `linear-gradient(to right, #fff 0%, #fff ${value}%, #82da7fb4 ${value}%, #82da7fb4 100%)`
    })


    // Add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    //Add an eventlistner to hamburger
    document.querySelector(".hamberger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add an eventlistner for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //search option appear
    document.querySelector(".search-icon").addEventListener("click", () => {
        if (document.querySelector(".search-form").style.display === "none" || document.querySelector(".search-form").style.display === " ") {
            document.querySelector(".search-form").style.display="flex";
            document.querySelector(".left").style.left = "-120%"
        } else {
            document.querySelector(".search-form").style.display = "none";
        }
    })

    document.querySelector(".search-form").addEventListener("click", () => {

        document.querySelector(".search-form").style.cssText = `
            display: flex;
            border: 1px solid white;
        `;
    })

    // add an eventlistner for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100;

        if (e.target.value == 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg");
            console.log(document.querySelector(".volume>img").src)
        }
        else {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    })

    //Add eventlistner to mute the volume
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            document.querySelector('.progress').style.background = `linear-gradient(to right, #9ffb96 0%, #9ffb96 0%, #fff 0%, #fff 100%)`;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .15;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 15;
            document.querySelector('.progress').style.background = `linear-gradient(to right, #9ffb96 0%, #9ffb96 15%, #fff 15%, #fff 100%)`;
        }
    })

// Add event listner to volume update
    const progress = document.querySelector('.progress');

    progress.addEventListener('input', function () {
        const value = this.value;
        console.log(value);
        this.style.background = `linear-gradient(to right, #9ffb96 0%, #9ffb96 ${value}%, #fff ${value}%, #fff 100%)`
    })




}
main()
