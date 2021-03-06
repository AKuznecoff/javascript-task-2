'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

function checkPhoneAndName(phone, name) {
    return typeof phone === 'string' &&
        /^\d{10}$/.test(phone) &&
        typeof name === 'string' &&
        name.length > 0;
}

function transformPhone(phone) {
    return `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-` +
        `${phone.slice(6, 8)}-${phone.slice(8, 10)}`;
}

const getAllRecords = () => Array.from(phoneBook.values());

const getRecordsByQuery = query => Array.from(phoneBook.values())
    .filter((contact) => contact.name.indexOf(query) !== -1 ||
            contact.phone.indexOf(query) !== -1 ||
            (contact.email && contact.email.indexOf(query) !== -1));

function getRecords(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }
    if (query === '*') {
        return getAllRecords();
    }

    return getRecordsByQuery(query);
}


/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!checkPhoneAndName(phone, name) || phoneBook.has(phone)) {
        return false;
    }
    phoneBook.set(phone, {
        name,
        phone,
        email
    });

    return true;
}


/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!checkPhoneAndName(phone, name) || !phoneBook.has(phone)) {
        return false;
    }
    let contact = phoneBook.get(phone);
    contact.name = name;
    if (email && typeof email === 'string') {
        contact.email = email;
    } else {
        delete contact.email;
    }

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    let finded = getRecords(query);
    let count = 0;
    finded.forEach(
        contact => {
            if (phoneBook.delete(contact.phone)) {
                count++;
            }
        });

    return count;
}


/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    let result = getRecords(query)
        .sort((first, second) => first.name > second.name)
        .map(contact => contact.email
            ? [contact.name, transformPhone(contact.phone), contact.email]
            : [contact.name, transformPhone(contact.phone)]);

    return result.map(contact => contact.join(', '));
}


/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    if (typeof csv !== 'string') {
        return 0;
    }
    let count = 0;
    csv.split('\n').forEach(record => {
        let splitted = record.split(';');
        if (add(splitted[1], splitted[0], splitted[2]) ||
            update(splitted[1], splitted[0], splitted[2])) {
            count++;
        }
    });

    return count;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
