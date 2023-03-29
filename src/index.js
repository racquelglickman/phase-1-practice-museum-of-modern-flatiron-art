let exhibitTitle = document.querySelector('#exhibit-title');
let exhibitImage = document.querySelector('#exhibit-image');
let exhibitDescription = document.querySelector('#exhibit-description');
let ticketsBought = document.querySelector('#tickets-bought');
let commentSection = document.querySelector('#comments-section');
let form = document.querySelector('#comment-form');
let buyTicketsButton = document.querySelector('#buy-tickets-button');

fetch('http://localhost:3000/current-exhibits')
    .then((response) => response.json())
    .then((data) => {
        renderExhibit(data);
    })

function renderExhibit(exhibits) {

    // data is an array of objects, even though it only has one object right now
    exhibits.forEach((exhibit) => {

        exhibitTitle.textContent = exhibit.title;
        exhibitImage.src = exhibit.image;
        exhibitDescription.textContent = exhibit.description;
        ticketsBought.textContent = `${exhibit.tickets_bought} Tickets Bought`
    
        // display comments in commentSection div
        exhibit.comments.forEach((comment) => {

            let p = document.createElement('p');
            p.textContent = comment;

            commentSection.append(p);

        });

        // when comment form is submitted, make new p and add to commentSection div
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('new comment submitted!');

            let p = document.createElement('p');
            p.textContent = e.target['comment-input'].value;

            commentSection.append(p);

            // update array with new comments
            exhibit.comments.push(e.target['comment-input'].value);

            // patch db with new array
            fetch(`http://localhost:3000/current-exhibits/${exhibit.id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    comments: exhibit.comments
                }),
            });
            
        });

        // when buy ticket button is pressed, increment number of tickets and update DOM
        buyTicketsButton.addEventListener('click', () => {
            console.log('new ticket bought!');

            exhibit.tickets_bought = exhibit.tickets_bought +1;

            // patch the db with updated ticket amount
            fetch(`http://localhost:3000/current-exhibits/${exhibit.id}`, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    tickets_bought: exhibit.tickets_bought,
                }),
            })
            .then((response) => response.json())
            .then((data) => {
                // update DOM with new amount of tickets
                ticketsBought.textContent = `${data.tickets_bought} Tickets Bought`           
            });
        });
    
    });

};