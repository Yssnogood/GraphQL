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

    console.log(filteredData)

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


export async function allUserInfos(token) {
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
    # Basic user info
    id
    login
    attrs
    auditRatio
    totalUp
    totalDown
    avatarUrl
    campus
    createdAt
    updatedAt
    
    # Profile information
    public {
      firstName
      lastName
      profile
    }
    
    # Group participation
    groups {
      id
      # confirmed
      createdAt
      updatedAt
      group {
        id
        objectId
        eventId
        status
        path
        campus
        createdAt
        updatedAt
        captainId
        object {
          id
          name
          type
          attrs
        }
        event {
          id
          path
          # status
          createdAt
          endAt
        }
        members {
          user {
            id
            login
            avatarUrl
          }
        }
      }
    }
    
    # Event participation
    events {
      id
      createdAt
      event {
        id
        createdAt
        endAt
        path
        # status
        # code
        object {
          id
          name
          type
          attrs
        }
        registrations {
          id
          startAt
          endAt
          startAt
        }
      }
    }
    
    # XP transactions with object details
    transactions(
      where: {type: {_eq: "xp"}}
      order_by: {createdAt: asc}
    ) {
      id
      type
      amount
      createdAt
      path
      campus
      object {
        id
        name
        type
        attrs
        # childrenAttrs
        parent: childrenRelation {
          parent {
            id
            name
            type
          }
        }
      }
      event {
        id
        path
      }
    }
    
    # XP summary
    transactions_aggregate(where: {type: {_eq: "xp"}}) {
      aggregate {
        sum { amount }
        avg { amount }
        max { amount }
        count
      }
    }
    
    # Progress history with object details
    progresses(
      where: {isDone: {_eq: true}}
      order_by: {updatedAt: desc}
    ) {
      id
      grade
      createdAt
      updatedAt
      path
      version
      campus
      object {
        id
        name
        type
        attrs(path: "$") # Get all attributes
        parent: childrenRelation {
          parent {
            id
            name
            type
          }
        }
      }
      group {
        id
        status
      }
      event {
        id
        path
      }
    }
    
    # Progress summary
    progresses_aggregate(where: {isDone: {_eq: true}}) {
      aggregate {
        count
        avg { grade }
        max { grade }
      }
    }
    
    # Audit results (as auditee)
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
    
    # Audit results (as auditor)
    audits_as_auditor: audits(where: {auditorId: {_eq: 3361}}) {
      id
      grade
      createdAt
      updatedAt
      group {
        id
        object {
          id
          name
          type
        }
        members {
          user {
            id
            login
          }
        }
      }
    }
    
    # Audit statistics
    audits_aggregate {
      aggregate {
        count
        sum { grade }
        avg { grade }
      }
    }
    
    # All results with object details
    results(
      order_by: [{updatedAt: desc}, {createdAt: desc}]
    ) {
      id
      grade
      type
      # status
      isLast
      createdAt
      updatedAt
      path
      version
      campus
      object {
        id
        name
        type
        attrs
        parent: childrenRelation {
          parent {
            id
            name
            type
          }
        }
      }
      group {
        id
        status
      }
      event {
        id
        path
      }
    }
    
    # Registration history
    registrations {
      id
      createdAt
      registration {
        id
        startAt
        endAt
        startAt
        object {
          id
          name
          type
          attrs
        }
        event {
          id
          path
        }
      }
    }
    
    # Match system participation
    matches {
      id
      createdAt
      updatedAt
      confirmed
      bet
      result
      path
      campus
      object {
        id
        name
        type
      }
      match_user: user {
        id
        login
      }
      event {
        id
        path
      }
    }
    
    # Roles and permissions
    user_roles {
      id
      # createdAt
      role {
        id
        slug
        name
        description
      }
    }
    
    # Records (bans, etc.)
    records {
      id
      message
      # banEndAt
      createdAt
      author {
        id
        login
      }
    }
    
    # Peer relationships
    transactions_up: transactions(
      where: {type: {_eq: "up"}}
      order_by: {createdAt: desc}
    ) {
      id
      amount
      createdAt
      object {
        id
        name
      }
      relatedUser: user {
        id
        login
      }
    }
    
    transactions_down: transactions(
      where: {type: {_eq: "down"}}
      order_by: {createdAt: desc}
    ) {
      id
      amount
      createdAt
      object {
        id
        name
      }
      relatedUser: user {
        id
        login
      }
    }
  }
  
  # Optional: Get campus information if needed
  # campuses {
  #   id
  #   name
  #   attrs
  # }

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