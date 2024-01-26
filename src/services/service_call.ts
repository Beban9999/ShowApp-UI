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

        const token = sessionStorage.getItem('token');
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
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

export async function service_post(callType: CallType, data: Record<string, any> = {}) {
    try {
        const apiUrl = 'https://localhost:7201/api/' + callType;

        const token = sessionStorage.getItem('token');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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

        const token = sessionStorage.getItem('token');

        const formData = new FormData();
        formData.append('Id', postId);

        files.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });

        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
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
