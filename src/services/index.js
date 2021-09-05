import axios from 'axios';
export const requestHandler = async (url, data, header, method) => {
    try {
        let response = await axios({
            method,
            url,
            data,
            headers: header
        });
        return response
    } catch (error) {
        console.log("error services", error);
        if(error.response.status === 401 ) {
            console.log("401", 401);   
        }
        return(error.response)
    }
}
