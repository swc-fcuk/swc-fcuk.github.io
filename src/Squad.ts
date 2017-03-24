
enum Faction {
    Empire,
    Rebel
}


enum Planet {
    planet1,
    planet2,
    planet3,
    planet4,
    planet5,
    planet6,

}


export interface MembershipRestrictions {
    openEnrollment: boolean;
    maxSize: 30;
    // TODO: multiples of 500?
    minScoreAtEnrollment: number;
    faction: Faction;
}


export interface SquadMember {
    name: string;
    isOwner: boolean;
    isOfficer: boolean;
    joinDate: number;
    troopsDonated: number;
    troopsReceived: number;
    rank: number;
    hqLevel: number;
    reputationInvested: number;
    xp: number;
    score: number;
    warParty: number;
    tournamentRating: number;
    // TODO:
    tournamentScores: any
    //planet3: number;
    attacksWon: 1405;
    defensesWon: 150;
    planet: Planet;
    // TODO: EpochTime class?
    lastLoginTime: number;
    lastUpdated: number;
    hasPlanetaryCommand: boolean;
    // TODO: GUID class?
    playerId: string;
}


export interface WarHistory {
    warId: string;
    endDate: 1481139469;
    score: 15;
    opponentScore: 0;
    opponentGuildId: string;
    opponentName: string;
    opponentIcon: string;
}

// TODO:
enum PerkTypes {
    CBar_CFac,
    DntAmt_DntT,
    GCon_DntT,
    GCon_TDrd,
    CHro_GAll,
    GCrd_GCon,
    CCan_TDrd,
    TDrd,
    CBar_CCan,
    CFac_CCan,
    GAll_GCon,
    GCrd_DntT,
}


export interface Perks {
    // TODO:
    available: Object
    inProgress: Object
}


export interface Squad {
    name: string;
    icon: string;
    description: string;
    membershipRestrictions: MembershipRestrictions;
    members: SquadMember[];
    created: number;
    highestRankAchieved: number;
    activeMemberCount: number;
    squadWarReadyCount: number;
    // TODO: any or null and GUID?
    currentWarId: any;
    // TODO: any or what?
    warSignUpTime: any;
    warRating: any;
    isSameFactionWarAllowed: boolean;
    score: number;
    rank: number;
    // TODO: GUID?
    id: any;
    memberCount: number;
    warHistory: WarHistory[];
    level: 27;
    totalRepInvested: number;
    perks: Perks;
    lastPerkNotif: number;
}


export class Squad {

}


