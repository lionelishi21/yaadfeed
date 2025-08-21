// Stub for OpenAI to reduce bundle size
export class OpenAI {
  constructor(config?: any) {
    // Don't throw error in constructor to allow object creation
  }

  chat = {
    completions: {
      create: async (params: any) => {
        // Return a mock response structure
        return {
          choices: [
            {
              message: {
                content: 'OpenAI is not available in production build'
              }
            }
          ]
        };
      }
    }
  };

  images = {
    generate: async (params: any) => {
      return {
        data: [
          {
            url: 'https://via.placeholder.com/512x512?text=OpenAI+Not+Available'
          }
        ]
      };
    }
  };
}

export default OpenAI;
