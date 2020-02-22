import { CreateTreeRequest } from "../interfaces/CreateTreeRequest";
import { CreateFactoryRequest } from "../interfaces/CreateFactoryRequest";

export function getRandomNumber(min: number, max: number) {
    const highMin = Math.ceil(min);
    const lowMax = Math.floor(max);
    return Math.round(Math.random() * (lowMax - highMin)) + highMin;
};

export function isNumeric(number: string, base: number = 10):boolean {
    const parsedInt = parseInt(number, base);

    if (isNaN(parsedInt)) {
        return false;
    } else {
        return true;
    }
}

export function isInt(number: string) {
    return /^\+?\d+$/.test(number);
}

export function isEmpty(value: string) {
    return value === undefined || value === '';
}

export function isValidIdentifier(number: string) {
    return isNumeric(number) && isInt(number);
}

export function isValidMaxMin(max: number, min: number) {
    return max >= 0 && min >= 0 && max > min;
}

export function isValidCreateFactoryRequest(createFactoryRequest: CreateFactoryRequest) {
    const { name, min, max, number } = createFactoryRequest;
    return !isEmpty(name) && isValidMaxMin(max, min) && number > 0 && number < 16;

}

export function isValidCreateTreeRequest(createTreeRequest: CreateTreeRequest) {
    // check its not undefined
    let validFactories = createTreeRequest.factories !== undefined;

    // if factories were provided, make sure they are valid
    if (validFactories && createTreeRequest.factories.length > 0) {
        validFactories = createTreeRequest.factories
            .map(createFactoryRequest => isValidCreateFactoryRequest(createFactoryRequest))
            .every(isValid => isValid);
    }

    return !isEmpty(createTreeRequest.name) && validFactories;
}