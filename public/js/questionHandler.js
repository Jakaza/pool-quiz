const choiceQuestion = document.getElementById('choice-question')
const binaryQuestion = document.getElementById('binary-question')

function checkSelectedType(){
    const selectType = document.getElementById('question-type').value
    if(selectType == 'binary-question'){
        binaryQuestion.style.display = 'block'
        choiceQuestion.style.display = 'none'
    }else if(selectType == 'choice-question'){
        choiceQuestion.style.display = 'block'
        binaryQuestion.style.display = 'none'
    }
}
choiceQuestion.addEventListener('submit', (e)=>{
    e.preventDefault();
    updateUI()
    const formData = new FormData(choiceQuestion);
    const url = 'http://localhost:5000/'
    createNewQuestion(`${url}api/choice-question`, formData)
    .then(res =>{
        console.log(res);
        updateUI(false)
    }).catch(err =>{
        console.log(err);
    })
})
binaryQuestion.addEventListener('submit', (e)=>{
    e.preventDefault();
    updateUI()
    const formData = new FormData(binaryQuestion);
    const url = 'http://localhost:5000/'
    createNewQuestion(`${url}api/binary-question`, formData)
    .then(res =>{
        console.log(res);
        updateUI(false)
    }).catch(err =>{
        console.log(err);
    })
})
async function createNewQuestion(url, formData){
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('question-type').value;
    const category = document.getElementById('category').value;
    formData.append('difficulty',difficulty);
    formData.append('type',type);
    formData.append('category',category);
    const response = await fetch(url, {
        method: "POST", 
        mode: "cors",
        cache: "no-cache", 
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
    });
    return response.json(); 
}
function updateUI(isLoading = true){
    if(isLoading){
        document.getElementById('submitBtn').textContent = 'Loading'
    }else{
        document.getElementById('submitBtn').textContent = 'Submit'
    }
}