import { CallType } from "../models/enums/CallType";

export async function service_get(callType: CallType, data: Record<string, any> = {}) {
    try {
        let apiUrl = 'https://localhost:7201/api/' + callType;

        const queryParams = Object.entries(data)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&');

        if (queryParams !== '') {
            apiUrl += `?${queryParams}`;
        }

        const response = await fetch(apiUrl);
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

export async function service_upload(postId: any, files: File[]) {
    try {
        const apiUrl = 'https://localhost:7201/api/Media/upload';

        // Create a FormData object
        const formData = new FormData();

        // Append post_id to the FormData
        formData.append('Id', postId);

        //Append each file to the FormData
        files.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });

        // Make a POST request using fetch
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result);
            return result;
        } else {
            console.error('Failed to upload images');
        }
    } catch (error) {
        console.error('An error occurred while uploading images:', error);
    }
}
