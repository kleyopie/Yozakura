document.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission

        const roomType = this.getAttribute('data-room');
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        const checkIn = document.getElementById('check-in').value;
        const checkOut = document.getElementById('check-out').value;

        console.log('Form values:', { roomType, adults, children, checkIn, checkOut });

        if (!adults || !checkIn || !checkOut) {
            alert('Please fill out the reservation form first.');
            return;
        }

        const reservationId = 'res-' + Date.now();
        const reservation = {
            id: reservationId,
            roomType,
            adults,
            children,
            checkIn,
            checkOut
        };

        console.log('Sending reservation:', reservation);

        fetch('http://localhost:3001/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservation)
        })
        .then(response => response.text())
        .then(data => {
            console.log('Server response:', data);
            if (data === 'Reservation saved successfully') {
                alert('Booking successful!');
            } else {
                alert('Failed to save reservation');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});