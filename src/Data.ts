import { Squad, SquadMember } from './Squad';

//TODO: encoding was UTF-16 LE --> changed to UTF-8 without BOM
var squad: Squad = require('./../data/568c7e7c-9ddd-11e6-abea-06c66a004f76@1490386135.json');


var nextPersonId = 0;
var firstNames: any = []
var lastNames: any = []
var loremIpsum: any = [];
var statuses: any = [];

var posterWidth = 400;
var posterHeight = 400;
var _canvas: HTMLCanvasElement;
function makePoster(color: any) {
    if (!_canvas) {
        _canvas = document.createElement("canvas");
        _canvas.width = posterWidth;
        _canvas.height = posterHeight;
    }
    var ctxt = _canvas.getContext("2d");
    ctxt.fillStyle = color;
    ctxt.fillRect(0, 0, posterWidth, posterHeight);
    return _canvas.toDataURL();
}

var posterColors = [
    [68, 34, 87], [100, 66, 119], [132, 98, 151],
    [164, 162, 165], [196, 194, 197], [228, 226, 229],
    [220, 77, 6], [252, 109, 38], [255, 141, 70]
];
var posters = posterColors.map(function (color) {
    return makePoster("rgb(" + color.join(", ") + ")");
});

function randomInt(first: any, last: any) {
    return Math.round(Math.random() * (last - first)) + first;
}

function randomElement(array: Array<any>) {
    return array[randomInt(0, array.length - 1)];
}

function genArray(minLength: any, maxLength: any, genElement: any) {
    var len = randomInt(minLength, maxLength);
    var result = new Array(len);
    for (var i = 0; i < len; i++) {
        result[i] = genElement();
    }
    return result;
}

function genName() {
    return randomElement(firstNames) + " " + randomElement(lastNames);
}

function genPhoneNumber() {
    return "555-0" + randomInt(100, 199);
}

function genPerson() {
    return {
        id: nextPersonId++,
        name: genName(),
        status: randomElement(statuses),
        score: randomElement([2, 3, 4, 5, 6, 7, 8, 9]),
        picture: randomElement(posters),
        mobilePhone: genPhoneNumber(),
        workPhone: genPhoneNumber()
    };
}

var personCount = 50;
var people = genArray(personCount, personCount, genPerson);

people = []
var person: Object
squad.members.forEach(element => {
    person = {
        attacks: element.attacksWon,
        defenses: element.defensesWon,
        planetary: element.hasPlanetaryCommand,
        hq: element.hqLevel,
        officer: element.isOfficer,
        joinDate: element.joinDate,
        login: element.lastLoginTime,
        updated: element.lastUpdated,
        name: element.name,
        planet: element.planet,
        id: element.playerId,
        rank: element.rank,
        reputationInvested: element.reputationInvested,
        score: element.score,
        tournamentRating: element.tournamentRating,
        tournamentScores: element.tournamentScores,
        troopsDonated: element.troopsDonated,
        troopsReceived: element.troopsReceived,
        warParty: element.warParty,
        xp: element.xp,
        picture: randomElement(posters)
    }
    people.push(person)
});

module.exports = {
    people: people
};
