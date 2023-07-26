# projeto14-mywallet-back

POST `/sign-in`
    body = {
        email,
        password
    }
POST `/sign-up`
    body = {
        name,
        email,
        password
    }
GET `/historic`
    headers = {
        authorization: 'Bearer token'
    }
POST `/input`
    body = {
        title,
        description,
        value
    }
    headers = {
        authorization: 'Bearer token'
    }
POST `/output`
    body = {
        title,
        description,
        value
    }
    headers = {
        authorization: 'Bearer token'
    }