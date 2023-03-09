async function init() {
    let identityInfo = await fetchJSON(`/api/users/myIdentity`);
    let identityDiv = document.getElementById("identity_div");

    if(identityInfo.status == "loggedin") {
        identityDiv.innerHTML = `Logged in as ${identityInfo.userInfo.name} (${identityInfo.userInfo.username})`;

        let savedVideos = await fetchJSON(`/api/save?username=${identityInfo.userInfo.username}`);
        console.log(savedVideos);

        // TODO: delete saved video
        savedVideos.forEach(vid => {
            let embedLink = vid.url.split("watch?v=")[1];
            embedLink = embedLink.split("&")[0];
            let videoEmbed = `
                <div class="mt-2 border border-dark">
                    <iframe width=500 height=280 src='${"https://youtube.com/embed/" + embedLink}'></iframe>
                    <p>Rank: ${vid.rank}</p>
                    <button onclick="deleteSaved(${vid.url})">Un-Save Video</button>
                </div>
            `;
            document.getElementById("saved_videos").innerHTML += videoEmbed;
        });

    } else {
        identityDiv.innerHTML = `Not logged in. Return to homepage to login`;
    }
}

// TODO: DELETE FUNCTION
async function deleteSaved(url) {

}