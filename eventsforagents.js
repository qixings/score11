// Example JS for handling events, adding more interactivity

document.addEventListener('DOMContentLoaded', () => {
    const joinButtons = document.querySelectorAll('.join-event-btn');
    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Thank you for joining the event!');
        });
    });

    const rsvpButtons = document.querySelectorAll('.rsvp-btn');
    rsvpButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('You have successfully RSVP\'d!');
        });
    });
});
