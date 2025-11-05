// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone';
import { PINECONE_API_KEY } from '../config/env.config';

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });

// Create a dense index with integrated embedding
const zenAiIndex = pc.index('zen-ai-index');

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

export const searchVectors = async (query, limit = 5, metadata) => {
	try {
		const response = await zenAiIndex.query({
			query,
			topK: limit,
			includeMetadata: true,
			filter: metadata ? { metadata } : undefined,
		});
		return response.matches;
	} catch (error) {
		console.log(error);
		return [];
	}
};
