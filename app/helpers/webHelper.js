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

function formatDateYYMMDDHHmmss(date = new Date()) {
    const yy = String(date.getFullYear()).slice(2);
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const HH = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yy}${MM}${dd}${HH}${mm}${ss}`;
}

module.exports = {
    generatePassword,dateToString,formatDateYYMMDDHHmmss
};
