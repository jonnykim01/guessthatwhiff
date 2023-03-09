const youtubeEmbedUrl = "https://youtube.com/embed/";

async function init(){
    let urlInput = document.getElementById("urlInput");
    await loadIdentity();
    loadPosts();
}

function signIn() {
    document.getElementById("make_post_div").classList.remove("display");
    console.log("here");
}

function signOut() {

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
    checkProfile();
    let identityInfo = await fetchJSON(`api/users/myIdentity`);
    let username = identityInfo.userInfo.username;

    document.getElementById("post_box").innerText = "Loading...";
    let postInfo = await fetchJSON(`api/posts?username=${username}`);

    // for testing
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

function guess(post) {
    let guess = document.getElementById("rankGuess").value;
    console.log("you guessed: " + guess);
    document.getElementById("guess").remove();


    let result = document.createElement('p');
    result.classList.add("mt-3");

    if(guess == post.rank) {
        console.log("correct!");
        result.style.color = 'lightgreen';
        result.innerHTML = "Correct!";
    } else {
        console.log("incorrect. The correct answer was " + post.rank);
        result.style.color = 'red';
        result.innerHTML = ("Incorrect. The correct answer was " + post.rank);
    }

    document.getElementById("post").appendChild(result);
    seenVideo(post);
}

async function saveVideo(postInfo) {
    let identityInfo = await fetchJSON(`api/users/myIdentity`);
    let username = identityInfo.userInfo.username;

    try{
        await fetchJSON(`api/save`, {
            method: "POST",
            body: {url : postInfo.url, username: username}
        });
    }catch(error){
        document.getElementById("postStatus").innerText = "Error";
        throw(error);
    }
}

// for no duplicate functionality
async function seenVideo(post) {
    try{
        let identityInfo = await fetchJSON(`api/users/myIdentity`);
        let username = identityInfo.userInfo.username;

        await fetchJSON(`api/posts/seen`, {
            method: "POST",
            body: {url: post.url, username: username}
        });
    }catch(error){
        console.log(error);
        throw(error);
    }
}