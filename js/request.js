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
                        object {
                        name
                        type
                    }
                    }
                }
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch filtered transactions');
    }

    const data = await response.json();

    // Filter for transactions that ARE project type
    const filteredData = data.data.transaction.filter((transaction) => 
        transaction.object && transaction.object.type === 'project'
    );

    return filteredData;

}


export async function xpUser(token) {
    const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                query {
                    transaction_aggregate(where: {
                        type: { _eq: "xp" },
                        eventId: {_eq: 303}
                    }) {
                        aggregate {
                            sum {
                                amount
                            }
                        }
                    }
                }
            `
        })
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user info')
    }
    const data = await response.json()

    return data.data.transaction_aggregate.aggregate.sum

}

export async function fetchUserInfo(token) {
    const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            query: `
                query {
                    user {
                        id
                        login
                        attrs
                        auditRatio
                        createdAt
                        totalUp
                        totalDown
                    }
                }
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    const data = await response.json();
    return data.data.user[0];
}

export async function userXPLevel(token, userLogin) {
  
  const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
          query: `
              query {
                  event_user(where: { userLogin: { _eq: "${userLogin}" }, eventId: { _eq: 303 } }) {
                      level
                  }
              }
          `
      })
  });
  if (!response.ok) {
      throw new Error('Failed to fetch user level')
  }
  const data = await response.json()
  
  
  // Return the level or 0 if no data is found
  return data.data.event_user[0]?.level || 0;
}

export async function getUserAudit(token){
  const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        query: `
            query {
                  audits {
                    id
                    grade
                    createdAt
                    updatedAt
                    version
                    group {
                      id
                      object {
                        id
                        name
                        type
                        attrs(path: "$.auditRequirements")
                      }
                    }
                    auditor {
                      id
                      login
                      avatarUrl
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

export async function fetchUserAudit(token, userName, onlyLast = false) {
  const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
          query: `
              query {
                  audit(
                      where: {
                          _and: [
                              {auditorLogin: {_eq: "${userName}"}},
                              {grade: {_is_null: false}}
                          ]
                      }
                      ${onlyLast ? ', limit: 1' : ''},
                      order_by: {group: {createdAt: desc}}
                  ) {
                      private {
                          code 
                      }
                      grade
                      resultId
                      group {
                          captainLogin
                          createdAt
                          object {
                              name
                              type
                          }
                      }
                  }
              }
          `
      })
  });
  if (!response.ok) {
      throw new Error('Failed to fetch user info')
  }
  const data = await response.json()

  return data.data.audit
}