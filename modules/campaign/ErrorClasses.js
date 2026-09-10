export class CampaignErrors extends Error {
    constructor(msg) {
        super(msg);
    }
}

export class EndpointNotReachable extends CampaignErrors {
    constructor(status) {
        super(`Unable to fetch data from API: ${status}`)
    }
}
export class InvalidCampaignCode extends CampaignErrors {
    constructor(message) {
        super(message)
    }
}

export class CampaignMessage {
    constructor(message) {
        this.message = message
        this.isMessage = true
    }
}