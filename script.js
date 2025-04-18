document.getElementById('submitBtn').addEventListener('click', function() {
    const birthYear = parseInt(document.getElementById('birthyear').value, 10);
    if (isNaN(birthYear)) {
        alert('Please enter a valid year.');
        return;
    }
    let message = '';
    if (birthYear > 2018) {
        message = 'Lilo et Stitch';
    }
    if (birthYear <= 2018 && birthYear > 1980) {
        message = 'Matrix';
    }
    if (birthYear <= 1980) {
        message = 'Ben-Hur';
    }
    alert(message);
});