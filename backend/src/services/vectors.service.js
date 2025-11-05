// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_API_KEY } from '../config/env.config.js';

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

// Create a dense index with integrated embedding
const zenAiIndex = pc.index('zen-ai');

export const addVectors = async (id, metadata, vectors) => {
	try {
		await zenAiIndex.upsert([
			{
				id,
				metadata,
				values: vectors,
			},
		]);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const searchVectors = async (queryVector, limit = 5, metadataFilter) => {
	try {
		const response = await zenAiIndex.query({
			vector: queryVector, // ✅ correct key
			topK: limit,
			includeMetadata: true,
			filter: metadataFilter || undefined,
		});
		return response.matches;
	} catch (error) {
		console.error('Error querying Pinecone:', error);
		return [];
	}
};
