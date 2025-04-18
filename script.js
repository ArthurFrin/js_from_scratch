document.getElementById('submitBtn').addEventListener('click', function() {
    const age = parseInt(document.getElementById('age').value, 10);
    if (isNaN(age)) {
        alert('Veuillez entrer un âge valide.');
        return;
    }
    let message = '';
    if (age < 7) {
        message = 'Lilo et Stitch';
    }
    if (age >= 7 && age <= 45) {
        message = 'Matrix';
    }
    if (age > 45) {
        message = 'Ben-Hur';
    }
    alert(message);
});