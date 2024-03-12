console.log('Lets write javascript');
let currentSong = new Audio();
// console.log(currentSong)
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
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    return songs
}


const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+ track)
    track += ".mp3"
    currentSong.src = `/${currfolder}/` + track;

    if (!pause) {

        currentSong.play()
        play.src = "pause.svg"
    }


    // document.querySelector(".playnow").innerHTML ="Playing"
    document.querySelector(".songinfo").innerHTML =
        decodeURI(track.replaceAll(".mp3", ""));
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {


    // get the list of all the songs
    songs = await getSongs("songs/Bengali");

    playMusic(songs[0].replace(".mp3", ""), true);

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div class="song">${song.replaceAll("%20", " ").replaceAll(".mp3", "")}</div>
                                <div>Debayan</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="play.svg" alt=""> 
                            </div>
                        </li>
                    </li> `;
    }

    // attach an event listener to each song in the libary section
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
            // document.querySelector(".playnow").innerHTML + "playing";
        })
    });

    // Attach an event listener to play
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //add an eventlistner to previous 
    previous.addEventListener("click",()=>{

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        console.log(songs,index);
        if((index-1)>=0){
            playMusic(songs[index-1].replace(".mp3", ""))
        }
        
    })

    //add an eventlistner to  next 
    next.addEventListener("click",()=>{
        currentSong.pause()
        play.src = "play.svg"

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        
        if((index+1)<songs.length){
            playMusic(songs[index+1].replace(".mp3", ""))
        }else{
            play.src = "play.svg"
        }
        
    })


    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
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
        if (document.querySelector(".search-form").style.display === "none" || document.querySelector(".search-form").style.display === "") {
            document.querySelector(".search-form").style.cssText = `display: flex; `;
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
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("setting volume to",e.target.value,"/100");
        currentSong.volume = parseInt(e.target.value)/100;
        
    })

    //Load the playlist whenever csrd is clicked
    

    

}
main()
