import axios from 'axios';

const url = 'https://app-i3vi7xffsa-lm.a.run.app/api';

export const createBracket = async (formData) => {
    let data = null;
    try {
        data = (await axios.post(`${url}/bracket/create`, formData)).data;
    } catch (error) {
        console.log(error);
    }
    return data;
}

export const updateBracket = async (id, match, score, password, bracketType) => {
    let data = null;
    try {
        data = (await axios.post(`${url}/bracket/update`, { id, match, score, password, bracketType })).data;
    } catch (error) {
        console.error(error.response.data.message);
    }
    return data;
}

export const getAllBrackets = async () => {
    let data = null;
    try {
        data = (await axios.get(`${url}/bracket/get-all`)).data;
    } catch (error) {
        console.log(error);
    }
    return data;
}

export const getBracket = async (id) => {
    let data = null;
    try {
        data = (await axios.get(`${url}/bracket/get/${id}`)).data;
    } catch (error) {
        console.log(error);
    }
    return data;
}