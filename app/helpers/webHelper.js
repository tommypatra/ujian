/**
 * Generate password default 6 angka
 * @param {numeric} length
 */
function generatePassword(length = 6) {
    let pass = '';
    for (let i = 0; i < length; i++) {
        pass += Math.floor(Math.random() * 10);
    }
    return pass;
}

function dateToString(date) {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

module.exports = {
    generatePassword,dateToString
};
