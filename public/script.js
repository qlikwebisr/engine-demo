//Frontend js file
//settings
const server_url = `http://${window.location.hostname}:3000/table`

//console.log('window.location.hostname ', window.location.hostname);
//console.log('server_url ', server_url);

//send data to server and get response 

const submit_button = document.getElementById("prompt_submit");

submit_button.addEventListener("click", async () => {

    document.querySelector('.content').innerHTML = '<div class="spinner spinner-grow text-success" role="status"></div><span class="visually-hidden">Loading...</span>';

    //show the spinner
    const spinner = document.querySelector('.spinner');
    spinner.style.display = "block";

    //console.log('data', data);

       await fetch(server_url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                //body: JSON.stringify(data)
            })
            .then(response => {
                return response.json()
            })
            .then(responseJson => {
                //hide spinner
                spinner.style.display = "none";

                // Handle the response
                console.log('responseJson', responseJson);
                document.querySelector('.content').innerHTML = responseJson;
            })

            .catch(error => {
                spinner.style.display = "none";
                // Handle any errors
                console.log(error);
                document.querySelector('.content').innerHTML = error;

            });


});