export type ProcessItem = {
  filename: string;
  person: string | null;
  scene: string | null;
  storage_path: string;
  photo_id: string;
};

export type ProcessResult = {
  success: boolean;
  summary?: any;
  items?: ProcessItem[];
  folderId?: string | null;
  batchPrefix?: string | null;
  zipBase64?: string | null;
  error?: string;
  message?: string;
};

export type RenamePair = { from: string; to: string };

export type LabeledImage = { id: string; file: File; subject: string | null };

export type ReviewRow = {
  key: string;
  previewURL: string;
  suggestedFolder: string;
  filename: string;
};
