async function init() {
    try {
        let identityInfo = await fetchJSON(`/api/users/myIdentity`);
        let identityDiv = document.getElementById("identity_div");

        if(identityInfo.status == "loggedin") {
            identityDiv.innerHTML = `Logged in as ${identityInfo.userInfo.name} (${identityInfo.userInfo.username})`;

            loadStreaks(identityInfo);
            loadSavedVideos(identityInfo);
        } else {
            identityDiv.innerHTML = `Not logged in. Return to homepage to login`;
        }
    } catch (err) {
        console.log(error);
        throw(error);
    }
}

async function loadSavedVideos(identityInfo) {
    try {
        let savedVideos = await fetchJSON(`/api/save?username=${identityInfo.userInfo.username}`);
        console.log(savedVideos);

        savedVideos.forEach(vid => {
            let embedLink = vid.url.split("watch?v=")[1];
            embedLink = embedLink.split("&")[0];
            let videoEmbed = document.createElement("div");
            videoEmbed.classList.add("mt-2");
            let iframe = document.createElement("iframe");
            iframe.width = 500;
            iframe.height = 280;
            iframe.src = "https://youtube.com/embed/" + embedLink;
            let rank = document.createElement("p");
            rank.innerHTML = "Rank: " + vid.rank;
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Un-Save Video";
            deleteButton.addEventListener('click', function(){
                deleteSavedVideos(vid.url);
                document.getElementById("saved_videos").innerHTML = "";
            });
            let line = document.createElement("hr")
            videoEmbed.appendChild(iframe);
            videoEmbed.appendChild(rank);
            videoEmbed.appendChild(deleteButton);
            videoEmbed.appendChild(line);
            document.getElementById("saved_videos").appendChild(videoEmbed);
        });
    } catch (err) {
        console.log(error);
        throw(error);
    }
}

async function deleteSavedVideos(url) {
    try {
        let identityInfo = await fetchJSON(`/api/users/myIdentity`);
        await fetchJSON(`api/save/delete`, {
            method: "POST",
            body: {username: identityInfo.userInfo.username, url: url}
        });

        loadSavedVideos(identityInfo);
    } catch(error){
        console.log(error);
        throw(error);
    }
}

async function loadStreaks(identityInfo) {
    try{
        let user = await fetchJSON(`/api/users?username=${identityInfo.userInfo.username}`);

        let currStreak = document.createElement("p");
        currStreak.innerHTML = "Current Streak: " + user.current_streak;
        let longStreak = document.createElement("p");
        longStreak.innerHTML = "Longest Streak: " + user.longest_streak;

        document.getElementById("streaks").appendChild(currStreak);
        document.getElementById("streaks").appendChild(longStreak);
    } catch (err) {

    }
}