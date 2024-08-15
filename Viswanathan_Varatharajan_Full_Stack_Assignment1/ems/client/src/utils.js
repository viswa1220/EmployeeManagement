export const graphQLCommand = async (query, variables = {}) => {
  try {
    const response = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors.map((err) => err.message).join('\n'));
    }

    return json.data;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};
