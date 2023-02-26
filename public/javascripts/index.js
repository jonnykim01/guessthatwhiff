async function init(){
    let urlInput = document.getElementById("urlInput");
    loadPosts();
}

async function loadPost(){
    document.getElementById("post_box").innerText = "Loading...";
    let postInfo = await fetchJSON(`api/posts/`)

    // for testing
    console.log("pst! The correct answer is " + postInfo.rank)

    let postsHtml = `
        <div id="post">
            <h2>Guess the rank of this clip</h2>
            <a href='${postInfo.url}' target='_blank'>${postInfo.url}</a>
        </div>
        <div id="guess">
            <label for="rankGuess">What rank is this clip?:</label>
            <select name="rank" id="rankGuess">
            <option value="">--Please choose an option--</option>
            <option value="iron 1">Iron 1</option>
            <option value="iron 2">Iron 2</option>
            <option value="iron 3">Iron 3</option>
            <option value="bronze 1">Bronze 1</option>
            <option value="bronze 2">Bronze 2</option>
            <option value="bronze 3">Bronze 3</option>
            <option value="silver 1">Silver 1</option>
            <option value="silver 2">Silver 2</option>
            <option value="silver 3">Silver 3</option>
            <option value="gold 1">Gold 1</option>
            <option value="gold 2">Gold 2</option>
            <option value="gold 3">Gold 3</option>
            <option value="platinum 1">Platinum 1</option>
            <option value="platinum 2">Platinum 2</option>
            <option value="platinum 3">Platinum 3</option>
            <option value="diamond 1">Diamond 1</option>
            <option value="diamond 2">Diamond 2</option>
            <option value="diamond 3">Diamond 3</option>
            <option value="acendant 1">Acendant 1</option>
            <option value="acendant 2">Acendant 2</option>
            <option value="acendant 3">Acendant 3</option>
            <option value="immortal 1">Immortal 1</option>
            <option value="immortal 2">Immortal 2</option>
            <option value="immortal 3">Immortal 3</option>
            <option value="radiant">Radiant</option>
            </select>
            <div id="results"></div>
        </div>`
    document.getElementById("post_box").innerHTML = postsHtml;
    let guessButton = document.createElement('button');
    guessButton.innerHTML = "Submit Guess"
    guessButton.addEventListener('click', function(){
        guess(postInfo)
    });
    document.getElementById("guess").appendChild(guessButton)

    let guessResult = document.createElement('div');
    guessResult.classList.add("guessResult");
    document.getElementById("guess").appendChild(guessResult)
}

async function postUrl(){
    document.getElementById("postStatus").innerHTML = "sending data..."
    let url = document.getElementById("urlInput").value;
    let rank = document.getElementById("rankInput").value;

    try{
        await fetchJSON(`api/posts`, {
            method: "POST",
            body: {url: url, rank: rank}
        })
    }catch(error){
        document.getElementById("postStatus").innerText = "Error"
        throw(error)
    }
    document.getElementById("urlInput").value = "";
    document.getElementById("rankInput").value = "";
    document.getElementById("postStatus").innerHTML = "successfully uploaded"
}

function guess(post) {
    let guess = document.getElementById("rankGuess").value
    console.log("you guessed: " + guess)
    document.getElementById("guess").remove()


    let result = document.createElement('p');

    if(guess == post.rank) {
        console.log("correct!")
        result.style.color = 'lightgreen'
        result.innerHTML = "Correct!"
    } else {
        console.log("incorrect. The correct answer was " + post.rank)
        result.style.color = 'red'
        result.innerHTML = ("Incorrect. The correct answer was " + post.rank)
    }

    document.getElementById("post").appendChild(result)
}