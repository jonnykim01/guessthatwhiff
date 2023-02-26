async function init(){
    let urlInput = document.getElementById("urlInput");
    loadPosts();
}

async function loadPost(){
    document.getElementById("post_box").innerText = "Loading...";
    let postInfo = await fetchJSON(`api/posts/`)
    let postsHtml = `
        <div class="post">
            <h2>Guess the rank of this clip</h2>
            <a href='${postInfo.url}' target='_blank'>${postInfo.url}</a>
        </div>
        <div class="guess">
            <label for="rankGuess">What rank is this clip?:</label>
            <select name="rank" id="rankGuess">
                <option value="">--Please choose an option--</option>
                <option value="ir1">Iron 1</option>
                <option value="ir2">Iron 2</option>
                <option value="ir3">Iron 3</option>
                <option value="b1">Bronze 1</option>
                <option value="b2">Bronze 2</option>
                <option value="b3">Bronze 3</option>
                <option value="s1">Silver 1</option>
                <option value="s2">Silver 2</option>
                <option value="s3">Silver 3</option>
                <option value="g1">Gold 1</option>
                <option value="g2">Gold 2</option>
                <option value="g3">Gold 3</option>
                <option value="p1">Platinum 1</option>
                <option value="p2">Platinum 2</option>
                <option value="p3">Platinum 3</option>
                <option value="d1">Diamond 1</option>
                <option value="d2">Diamond 2</option>
                <option value="d3">Diamond 3</option>
                <option value="a1">Acendant 1</option>
                <option value="a2">Acendant 2</option>
                <option value="a3">Acendant 3</option>
                <option value="imm1">Immortal 1</option>
                <option value="imm2">Immortal 2</option>
                <option value="imm3">Immortal 3</option>
                <option value="radiant">Radiant</option>
            </select>
            <button onClick="guess()">Submit Guess</button>
            <div id="results"></div>
        </div>`
    document.getElementById("post_box").innerHTML = postsHtml;
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

function guess() {
    let guess = document.getElementById("rankGuess").value
    console.log("you guessed: " + guess)
}