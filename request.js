export async function fetchGraphFieldsInfo(token) {
    const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                query {
                    __schema{
                        queryType{
                            fields{
                                name
                                type{
                                    kind
                                    name
                                    __typename
                                }
                            }
                        }
                    }
                }
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    const data = await response.json();
    return data.data;
}


export async function transactionIntrospectSchema(token) {
    const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                query IntrospectionQuery {
                    __schema {
                        types {
                            name
                            fields {
                                name
                                type {
                                    name
                                    kind
                                    ofType {
                                        name
                                        kind
                                    }
                                }
                            }
                        }
                    }
                }
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch schema');
    }

    const data = await response.json();
    return data.data;
}


export async function transactionTableByUserId(token, userId) {
    const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                query {
                    transaction(where: { userId: { _eq: ${userId} },
                        type: { _eq: "xp" } }) {
                        id
                        type
                        amount
                        objectId
                        userId
                        createdAt
                        path
                    }
                }
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch filtered transactions');
    }

    const data = await response.json();
    return data.data.transaction;
}
