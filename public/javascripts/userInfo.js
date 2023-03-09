async function init() {
    try {
        let identityInfo = await fetchJSON(`/api/users/myIdentity`);
        let identityDiv = document.getElementById("identity_div");

        if(identityInfo.status == "loggedin") {
            identityDiv.innerHTML = `Logged in as ${identityInfo.userInfo.name} (${identityInfo.userInfo.username})`;

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
            videoEmbed.classList.add("border");
            videoEmbed.classList.add("border-dark");
            let iframe = document.createElement("iframe");
            iframe.width = 500;
            iframe.height = 280;
            iframe.src = "https://youtube.com/embed/" + embedLink;
            let rank = document.createElement("p");
            rank.innerHTML = "Rank: " + vid.rank;
            videoEmbed.appendChild(iframe);
            videoEmbed.appendChild(rank);
            let deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Un-Save Video";
            deleteButton.addEventListener('click', function(){
                deleteSavedVideos(vid.url);
                document.getElementById("saved_videos").innerHTML = "";
                loadSavedVideos(identityInfo);
            });
            document.getElementById("saved_videos").appendChild(videoEmbed);
            document.getElementById("saved_videos").appendChild(deleteButton);
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