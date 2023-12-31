import fetch from 'isomorphic-fetch'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const apiResponse = response => {
    return response.json().then(json => {
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    })
}

const fetchOptions = (method, data) => {
    let header = null
    if (method !== 'GET') {
        header = new Headers({
            'Content-Type': 'application/json; charset=utf-8',
            'X-CSRF-token': getCookie('csrftoken')
        })
    } else {
        header = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
        })
    }
    return {
        method,
        body: JSON.stringify(data),
        headers: header
    }
}

const callApi = (endpoint, method, data) => {
    const fullUrl = (endpoint.indexOf(BASE_URL) === -1) ? BASE_URL + endpoint : endpoint
    if (method) {
        method = method.toUpperCase()
        return fetch(fullUrl, fetchOptions(method, data)).then(apiResponse)
    } else {
        return fetch(fullUrl).then(apiResponse)
    }
}

export const CALL_API = 'Call API'

export default store => next => action => {
    const callAPI = action[CALL_API]

    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    const { endpoint, types, data, method } = callAPI

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.')
    }

    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.')
    }

    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }

    const [requestType, successType, failureType] = types
    next(actionWith({ type: requestType }))

    return callApi(endpoint, method, data).then(
        response => next(actionWith({
            response,
            type: successType
        })),
        error => next(actionWith({
            type: failureType,
            error: error.message || 'Something bad happened'
        }))
    )
}

export const getFormConfig = (method, body, accept=null) => {
    const csrftoken = getCookie('csrftoken');
    let config = {
        headers: {
            'X-CSRF-token': csrftoken,
            'Accept': accept,
        },
        method: method,
        body: body
    }
    return config;
}