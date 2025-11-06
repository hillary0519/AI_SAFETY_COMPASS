import XLSX from 'xlsx';
import { OpenAIEmbeddings } from '@langchain/openai';
import faiss from 'faiss-node';

const { IndexFlatL2 } = faiss;

export interface AccidentCase {
  id: number;
  작업유형: string;
  기인물: string;
  설비명: string;
  재해발생일: string;
  시간: string;
  재해유형: string;
  사고명: string;
  나이: string;
  근속: string;
  재해정도: string;
  발생상황: string;
  발생원인: string;
  시사점: string;
}

class RAGService {
  private cases: AccidentCase[] = [];
  private embeddings: OpenAIEmbeddings;
  private index: InstanceType<typeof IndexFlatL2> | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
      modelName: 'text-embedding-3-small',
    });
  }

  async initialize() {
    // Return existing promise if initialization is in progress
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (this.isInitialized) {
      return;
    }

    // Create initialization promise to prevent concurrent calls
    this.initializationPromise = this.doInitialize();
    
    try {
      await this.initializationPromise;
    } finally {
      this.initializationPromise = null;
    }
  }

  private async doInitialize() {

    console.log('Loading accident cases from Excel...');
    
    // Load Excel file
    const workbook = XLSX.readFile('attached_assets/accident_List3_1762451020150.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Parse cases and convert dates
    this.cases = data.map((row: any, index: number) => ({
      id: index + 1,
      작업유형: row['작업유형'] || '',
      기인물: row['기인물'] || '',
      설비명: row['설비명'] || '',
      재해발생일: this.excelDateToString(row['재해발생일']),
      시간: this.excelTimeToString(row['시간']),
      재해유형: row['재해유형'] || '',
      사고명: row['사고명'] || '',
      나이: row['나이'] || '',
      근속: row['근속'] || '',
      재해정도: row['재해정도'] || '',
      발생상황: row['발생상황'] || '',
      발생원인: row['발생원인'] || '',
      시사점: row['시사점'] || '',
    }));

    console.log(`Loaded ${this.cases.length} accident cases`);

    // Create embeddings
    console.log('Creating embeddings...');
    const texts = this.cases.map(c => this.caseToText(c));
    const embeddingVectors = await this.embeddings.embedDocuments(texts);

    // Build FAISS index
    console.log('Building FAISS index...');
    const dimension = embeddingVectors[0].length;
    this.index = new IndexFlatL2(dimension);
    
    // Add vectors to index
    for (const vector of embeddingVectors) {
      this.index.add(vector);
    }

    this.isInitialized = true;
    console.log('RAG service initialized successfully');
  }

  private excelDateToString(excelDate: number): string {
    if (!excelDate || typeof excelDate !== 'number') return '';
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private excelTimeToString(excelTime: number): string {
    if (!excelTime || typeof excelTime !== 'number') return '';
    const hours = Math.floor(excelTime * 24);
    const minutes = Math.floor((excelTime * 24 * 60) % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  private caseToText(c: AccidentCase): string {
    return `작업유형: ${c.작업유형}
기인물: ${c.기인물}
설비명: ${c.설비명}
재해유형: ${c.재해유형}
사고명: ${c.사고명}
발생상황: ${c.발생상황}
발생원인: ${c.발생원인}
시사점: ${c.시사점}`;
  }

  async findSimilarCases(
    workTypes: string[],
    workName: string,
    workDescription: string,
    equipmentName: string,
    limit: number = 2
  ): Promise<AccidentCase[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Create query text from permit information
    const queryText = `작업유형: ${workTypes.join(', ')}
작업명: ${workName}
설비명: ${equipmentName}
작업내용: ${workDescription}`;

    console.log('Finding similar cases for:', queryText);

    // Get query embedding
    const queryEmbedding = await this.embeddings.embedQuery(queryText);

    // Search in FAISS index
    if (!this.index) {
      throw new Error('FAISS index not initialized');
    }

    const k = Math.min(limit, this.cases.length);
    const result = this.index.search(queryEmbedding, k);

    // Return similar cases
    const similarCases = result.labels.map((idx: number) => this.cases[idx]);
    console.log(`Found ${similarCases.length} similar cases:`, similarCases.map((c: AccidentCase) => c.사고명));

    return similarCases;
  }

  getCaseById(id: number): AccidentCase | undefined {
    return this.cases.find(c => c.id === id);
  }
}

// Singleton instance
let ragService: RAGService | null = null;

export function getRAGService(): RAGService {
  if (!ragService) {
    ragService = new RAGService();
  }
  return ragService;
}
