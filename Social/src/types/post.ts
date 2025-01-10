export type PostType = 'classical' | 'selection' | 'cloze';

export interface PostOption {
  text: string;
  odds: number;
}

export interface BasePost {
  id: number;
  author: string;
  handle: string;
  type: PostType;
  content?: string;  // Optional since selection posts might not have main content
  likes: number;
  comments: number;
  reposts: number;
}

export interface ClassicalPost extends BasePost {
  type: 'classical';
  content: string;  // Required for classical posts
}

export interface SelectionPost extends BasePost {
  type: 'selection';
  content?: string;  // Optional main content
  commitment: string;  // Hash of the correct option
  options: PostOption[];  // List of options with betting odds
}

export interface ClozePost extends BasePost {
  type: 'cloze';
  content: string;  // Content with [hidden] parts
  commitment: string;  // Hash of the hidden content
  hiddenParts?: string[];  // Optional array of hidden content parts
}

export type Post = ClassicalPost | SelectionPost | ClozePost;
