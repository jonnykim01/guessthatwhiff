async function init() {
    let identityInfo = await fetchJSON(`/api/users/myIdentity`)
    let identityDiv = document.getElementById("identity_div");

    if(identityInfo.status == "loggedin") {
        identityDiv.innerHTML = `Logged in as ${identityInfo.userInfo.name} (${identityInfo.userInfo.username})`

        // TODO: Populate "saved_videos" div
    } else {
        identityDiv.innerHTML = `Not logged in. Return to homepage to login`
    }
}