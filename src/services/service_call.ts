import { CallType } from "../models/enums/CallType";

export async function service_get(callType: CallType, data: Record<string, any> = {}) {
    debugger
    try {
        let apiUrl = 'https://localhost:7201/api/' + callType;

        const queryParams = Object.entries(data)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        if (queryParams !== '') {
            apiUrl += `?${queryParams}`;
        }

        const response = await fetch(apiUrl);
        debugger
        if (response.ok) {
            const result = await response.json();
            console.log(result); 
            return result;
        } else {
            console.error('Failed to retrieve data');
        }
    } catch (error) {
        console.error('An error occurred while retrieving data:', error);
    }
}

export async function service_post(callType: CallType, data: Record<string, any> = {}) {
    try {
        const apiUrl = 'https://localhost:7201/api/' + callType;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result); 
            return result;
        } else {
            console.error('Failed to retrieve data');
        }
    } catch (error) {
        console.error('An error occurred while retrieving data:', error);
    }
}

