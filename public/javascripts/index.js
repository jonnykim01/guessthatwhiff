const youtubeEmbedUrl = "https://youtube.com/embed/";

async function init() {
    checkProfile();
}

async function checkProfile() {
    try{
        console.log("checking profile");
        let identityInfo = await fetchJSON(`api/users/myIdentity`);
        let username = identityInfo.userInfo.username;
        await fetchJSON(`api/users`, {
            method: "POST",
            body: {username: username}
        });
    }catch(error){
        document.getElementById("postStatus").innerText = "Error";
        throw(error);
    }
}

async function loadPost(){
    try {
        let identityInfo = await fetchJSON(`api/users/myIdentity`);
        let username = identityInfo.userInfo.username;

        document.getElementById("post_box").innerText = "Loading...";
        let postInfo = await fetchJSON(`api/posts?username=${username}`);
        if (postInfo.content) {
            document.getElementById("post_box").innerHTML = postInfo.content;
        } else {
            console.log("pst! The correct answer is " + postInfo.rank);

            // get id from youtube link
            let vidId = postInfo.url.split("watch?v=")[1];
            vidId = vidId.split("&")[0];

            let postsHtml = `
                <div id="post">
                    <h2 class="pt-5">Guess the rank of this clip</h2>
                    <iframe width=1000 height=563 src='${youtubeEmbedUrl + vidId}'></iframe>
                </div>
                <div id="guess" class="pt-2">
                    <label for="rankGuess">What rank is this clip?:</label>
                    <select name="rank" id="rankGuess">
                    <option value="">--Please choose an option--</option>
                    <option value="iron">Iron</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                    <option value="diamond">Diamond</option>
                    <option value="acendant">Acendant</option>
                    <option value="immortal">Immortal</option>
                    <option value="radiant">Radiant</option>
                    </select>
                    <div id="results"></div>
                </div>`;
            document.getElementById("post_box").innerHTML = postsHtml;
            let guessButton = document.createElement('button');
            guessButton.innerHTML = "Submit Guess";
            guessButton.addEventListener('click', function(){
                guess(postInfo);
            });
            document.getElementById("guess").appendChild(guessButton);

            let saveButton = document.createElement('button');
            saveButton.innerHTML = "Save Video";
            saveButton.addEventListener('click', function(){
                saveVideo(postInfo);
            });
            document.getElementById("guess").appendChild(saveButton);

            let guessResult = document.createElement('div');
            guessResult.classList.add("guessResult");
            guessResult.classList.add("pt-3");
            document.getElementById("guess").appendChild(guessResult);
        }
    } catch (err) {
        console.log(err);
        throw(err);
    }
}

async function resetVideos() {
    try {
        let identityInfo = await fetchJSON(`api/users/myIdentity`);
        let username = identityInfo.userInfo.username;

        await fetchJSON(`api/posts/reset`, {
            method: "POST",
            body: {username: username}
        });

        document.getElementById("post_box").innerHTML = `<h2>Successfully Reset!</h2>`;
    } catch(error){
        console.log(error);
        throw(error);
    }
}

async function postUrl(){
    if (document.getElementById("urlInput.value" != "")) {
        document.getElementById("postStatus").innerHTML = "sending data...";
    let url = document.getElementById("urlInput").value;
    let rank = document.getElementById("rankInput").value;

    try{
        await fetchJSON(`api/posts`, {
            method: "POST",
            body: {url: url, rank: rank}
            });
    }catch(error){
            document.getElementById("postStatus").innerText = "Error";
            throw(error);
    }
    document.getElementById("urlInput").value = "";
    document.getElementById("rankInput").value = "";
        document.getElementById("postStatus").innerHTML = "successfully uploaded";
    } else {
        document.getElementById("postStatus").innerHTML = "please include a url";
    }
}

async function guess(post) {
    let result = document.createElement('p');
    let msg = ""
    let guess = document.getElementById("rankGuess").value;
    console.log("you guessed: " + guess);
    document.getElementById("guess").remove();
    result.classList.add("mt-3");
    let resultMsg = ""
    try {
        let identityInfo = await fetchJSON(`api/users/myIdentity`);
        if (identityInfo.status == "loggedin") {
            // find user info
            var user = await fetchJSON(`api/users?username=${identityInfo.userInfo.username}`);
        }

        if(guess == post.rank) {
            console.log("correct!");
            result.style.color = 'lightgreen';
            resultMsg = "Correct!";
        } else {
            console.log("incorrect. The correct answer was " + post.rank + ".");
            result.style.color = 'red';
            resultMsg = ("Incorrect. The correct answer was " + post.rank + ".");
        }

        if (identityInfo.status == "loggedin") {
            resultMsg += " Your current streak is now " + user.current_streak
        } else {
            resultMsg += " Log in to track your guess streak."
        }
        result.innerHTML = resultMsg;
        document.getElementById("post").appendChild(result);
        seenVideo(post);
    } catch (err) {
        result.innerHTML = "error";
        document.getElementById("post").appendChild(result);
        throw(err);
    }
}

async function saveVideo(postInfo) {
    try {
        let identityInfo = await fetchJSON(`api/users/myIdentity`);
        let username = identityInfo.userInfo.username;

        await fetchJSON(`api/save`, {
            method: "POST",
            body: {url : postInfo.url, username: username}
        });
    } catch(error){
        document.getElementById("postStatus").innerText = "Error";
        throw(error);
    }
}

// for no duplicate functionality
async function seenVideo(post) {
    try {
        let identityInfo = await fetchJSON(`api/users/myIdentity`);
        let username = identityInfo.userInfo.username;

        await fetchJSON(`api/posts/seen`, {
            method: "POST",
            body: {url: post.url, username: username}
        });
    } catch(error){
        console.log(error);
        throw(error);
    }
}