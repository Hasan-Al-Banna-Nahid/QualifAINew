import { storage } from "@/app/(main)/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UploadedDocument {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Date;
}

export const documentService = {
    async uploadDocument(file: File, path: string = 'documents'): Promise<UploadedDocument> {
        try {
            // Generate a unique ID (fallback for older browsers if needed)
            const fileId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

            if (!storage) {
                throw new Error("Firebase Storage is not initialized");
            }

            const storageRef = ref(storage, `${path}/${fileId}_${file.name}`);

            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);

            return {
                id: fileId,
                name: file.name,
                url,
                type: file.type,
                size: file.size,
                uploadedAt: new Date()
            };
        } catch (error) {
            console.error("Error uploading document:", error);
            throw error;
        }
    },

    async extractText(documentUrl: string, type: string): Promise<string> {
        try {
            const response = await fetch('/api/documents/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: documentUrl, type }),
            });

            if (!response.ok) {
                throw new Error('Failed to extract text');
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error("Error extracting text:", error);
            throw error;
        }
    }
};
